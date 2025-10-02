from datetime import datetime
from calendar import monthrange
from io import StringIO
import pytz

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .db import get_db, Base, engine
from .models import Category, Transaction
from .schemas import (
    CategorySchema,
    CategoryCreate,
    TransactionSchema,
    TransactionCreate,
    TransactionUpdate,
    Balance
)
from .auth import get_current_user
from .models import User


router = APIRouter()


def init_db():
    """Initialize the database - no default categories needed since they're created per user."""
    # Database is initialized with proper schema, no default data needed
    pass


@router.post("/categories", response_model=CategorySchema)
def create_category(payload: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new category for the current user"""
    existing = db.scalar(select(Category).where(Category.name == payload.name, Category.user_id == current_user.id))
    if existing:
        raise HTTPException(status_code=409, detail="Category already exists")
    category = Category(name=payload.name, type=payload.type, user_id=current_user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/categories", response_model=list[CategorySchema])
def list_categories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get categories for the current user"""
    return db.scalars(select(Category).where(Category.user_id == current_user.id).order_by(Category.name)).all()


@router.put("/categories/{category_id}", response_model=CategorySchema)
def update_category(category_id: int, payload: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update a category for the current user"""
    category = db.scalar(select(Category).where(Category.id == category_id, Category.user_id == current_user.id))
    if not category:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Check if another category with the same name exists (excluding current category)
    existing = db.scalar(select(Category).where(Category.name == payload.name, Category.id != category_id, Category.user_id == current_user.id))
    if existing:
        raise HTTPException(status_code=409, detail="Category with this name already exists")
    
    category.name = payload.name
    category.type = payload.type
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a category for the current user"""
    category = db.scalar(select(Category).where(Category.id == category_id, Category.user_id == current_user.id))
    if not category:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(category)
    db.commit()
    return {"ok": True}


@router.post("/transactions", response_model=TransactionSchema)
def create_transaction(payload: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new transaction for the current user"""
    # Verify the category belongs to the current user
    category = db.scalar(select(Category).where(Category.id == payload.category_id, Category.user_id == current_user.id))
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    created_at = payload.created_at or datetime.utcnow()
    t = Transaction(
        amount=payload.amount,
        note=payload.note,
        created_at=created_at,
        category_id=payload.category_id,
        user_id=current_user.id
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/transactions", response_model=list[TransactionSchema])
def list_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get transactions for the current user"""
    return db.scalars(select(Transaction).where(Transaction.user_id == current_user.id).order_by(Transaction.created_at.desc())).all()


@router.put("/transactions/{transaction_id}", response_model=TransactionSchema)
def update_transaction(transaction_id: int, payload: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update a transaction for the current user"""
    t = db.scalar(select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == current_user.id))
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Validate category belongs to current user
    category = db.scalar(select(Category).where(Category.id == payload.category_id, Category.user_id == current_user.id))
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    # Update transaction fields
    t.amount = payload.amount
    t.note = payload.note
    t.category_id = payload.category_id
    if payload.created_at:
        t.created_at = payload.created_at
    else:
        t.created_at = datetime.utcnow()
    
    db.commit()
    db.refresh(t)
    return t


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a transaction for the current user"""
    t = db.scalar(select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == current_user.id))
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


@router.get("/balance", response_model=Balance)
def get_balance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get balance for the current user"""
    income = db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).join(Category).where(Category.type == "income", Transaction.user_id == current_user.id)) or 0
    expense = db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).join(Category).where(Category.type == "expense", Transaction.user_id == current_user.id)) or 0
    return Balance(income=float(income), expense=float(expense), net=float(income) - float(expense))


@router.get("/report/month")
def report_month(year: int, month: int, type: str | None = None, timezone: str = "UTC", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get monthly report for the current user"""
    # Convert local month to UTC for proper timezone handling
    try:
        tz = pytz.timezone(timezone)
        _, last_day = monthrange(year, month)
        local_start = datetime(year, month, 1, 0, 0, 0)
        local_end = datetime(year, month, last_day, 23, 59, 59)
        
        # Convert to UTC
        start = tz.localize(local_start).astimezone(pytz.UTC).replace(tzinfo=None)
        end = tz.localize(local_end).astimezone(pytz.UTC).replace(tzinfo=None)
    except pytz.exceptions.UnknownTimeZoneError:
        # Fallback to UTC if timezone is invalid
        start = datetime(year, month, 1)
        end = datetime(year, month, monthrange(year, month)[1], 23, 59, 59)
    stmt = (
        select(Category.name, Category.type, func.sum(Transaction.amount).label("total"))
        .join(Category)
        .where(Transaction.created_at.between(start, end), Transaction.user_id == current_user.id)
        .group_by(Category.id)
        .order_by(func.sum(Transaction.amount).desc())
    )
    if type in {"income", "expense"}:
        stmt = stmt.where(Category.type == type)
    rows = db.execute(stmt).all()
    return [
        {"category": r[0], "type": r[1], "total": float(r[2])}
        for r in rows
    ]


@router.get("/report/day")
def report_day(year: int, month: int, day: int, type: str | None = None, timezone: str = "UTC", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get daily report for the current user"""
    # Convert local date to UTC for proper timezone handling
    try:
        tz = pytz.timezone(timezone)
        local_start = datetime(year, month, day, 0, 0, 0)
        local_end = datetime(year, month, day, 23, 59, 59)
        
        # Convert to UTC
        start = tz.localize(local_start).astimezone(pytz.UTC).replace(tzinfo=None)
        end = tz.localize(local_end).astimezone(pytz.UTC).replace(tzinfo=None)
    except pytz.exceptions.UnknownTimeZoneError:
        # Fallback to UTC if timezone is invalid
        start = datetime(year, month, day, 0, 0, 0)
        end = datetime(year, month, day, 23, 59, 59)
    stmt = (
        select(Category.name, Category.type, func.sum(Transaction.amount).label("total"))
        .join(Category)
        .where(Transaction.created_at.between(start, end), Transaction.user_id == current_user.id)
        .group_by(Category.id)
        .order_by(func.sum(Transaction.amount).desc())
    )
    if type in {"income", "expense"}:
        stmt = stmt.where(Category.type == type)
    rows = db.execute(stmt).all()
    return [
        {"category": r[0], "type": r[1], "total": float(r[2])}
        for r in rows
    ]


@router.get("/export/csv")
def export_csv(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Export transactions as CSV for the current user"""
    rows = db.execute(
        select(
            Transaction.id, Transaction.created_at, Transaction.amount, Transaction.note, Category.name, Category.type
        ).join(Category).where(Transaction.user_id == current_user.id)
    ).all()
    df = pd.DataFrame(rows, columns=["id", "created_at", "amount", "note", "category", "type"])
    buf = StringIO()
    df.to_csv(buf, index=False)
    buf.seek(0)
    return StreamingResponse(buf, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=transactions.csv"})


