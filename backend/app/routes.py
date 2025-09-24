from datetime import datetime
from calendar import monthrange
from io import StringIO

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .db import get_db, Base, engine
from .models import Category, Transaction
from .schemas import Category as CategorySchema
from .schemas import CategoryCreate, Transaction as TransactionSchema, TransactionCreate, Balance


router = APIRouter()


def init_db():
    Base.metadata.create_all(bind=engine)
    # Preload default categories (idempotent)
    defaults: list[tuple[str, str]] = [
        # Income (5)
        ("Salary", "income"),
        ("Business", "income"),
        ("Dividends", "income"),
        ("Gifts", "income"),
        ("Other income", "income"),
        # Expenses from provided list
        ("Food", "expense"),
        ("Eating Out", "expense"),
        ("Clothes", "expense"),
        ("Sport", "expense"),
        ("Car", "expense"),
        ("Household", "expense"),
        ("Relaxation", "expense"),
        ("Mobile", "expense"),
        ("Internet", "expense"),
        ("Insurance", "expense"),
        ("Finance", "expense"),
        ("DM", "expense"),
        ("Home", "expense"),
        ("Personal care", "expense"),
        ("Electronics", "expense"),
        ("Travel", "expense"),
        ("Sharing", "expense"),
        ("Charity", "expense"),
        ("Medication", "expense"),
        ("Education", "expense"),
        ("Investing", "expense"),
        ("Pets", "expense"),
        ("Hobbys", "expense"),
        ("Other", "expense"),
        ("Children", "expense"),
        ("Presents", "expense"),
    ]
    from sqlalchemy.orm import Session

    with Session(engine) as db:
        existing = {name for (name,) in db.execute(select(Category.name)).all()}
        for name, type_ in defaults:
            if name not in existing:
                db.add(Category(name=name, type=type_))
        db.commit()


@router.post("/categories", response_model=CategorySchema)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(Category).where(Category.name == payload.name))
    if existing:
        raise HTTPException(status_code=409, detail="Category already exists")
    category = Category(name=payload.name, type=payload.type)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/categories", response_model=list[CategorySchema])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(Category).order_by(Category.name)).all()


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(category)
    db.commit()
    return {"ok": True}


@router.post("/transactions", response_model=TransactionSchema)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    category = db.get(Category, payload.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")
    created_at = payload.created_at or datetime.utcnow()
    t = Transaction(
        amount=payload.amount,
        note=payload.note,
        created_at=created_at,
        category_id=payload.category_id,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/transactions", response_model=list[TransactionSchema])
def list_transactions(db: Session = Depends(get_db)):
    return db.scalars(select(Transaction).order_by(Transaction.created_at.desc())).all()


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    t = db.get(Transaction, transaction_id)
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


@router.get("/balance", response_model=Balance)
def get_balance(db: Session = Depends(get_db)):
    income = db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).join(Category).where(Category.type == "income")) or 0
    expense = db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).join(Category).where(Category.type == "expense")) or 0
    return Balance(income=float(income), expense=float(expense), net=float(income) - float(expense))


@router.get("/report/month")
def report_month(year: int, month: int, type: str | None = None, db: Session = Depends(get_db)):
    start = datetime(year, month, 1)
    end = datetime(year, month, monthrange(year, month)[1], 23, 59, 59)
    stmt = (
        select(Category.name, Category.type, func.sum(Transaction.amount).label("total"))
        .join(Category)
        .where(Transaction.created_at.between(start, end))
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
def report_day(year: int, month: int, day: int, type: str | None = None, db: Session = Depends(get_db)):
    start = datetime(year, month, day, 0, 0, 0)
    end = datetime(year, month, day, 23, 59, 59)
    stmt = (
        select(Category.name, Category.type, func.sum(Transaction.amount).label("total"))
        .join(Category)
        .where(Transaction.created_at.between(start, end))
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
def export_csv(db: Session = Depends(get_db)):
    rows = db.execute(
        select(
            Transaction.id, Transaction.created_at, Transaction.amount, Transaction.note, Category.name, Category.type
        ).join(Category)
    ).all()
    df = pd.DataFrame(rows, columns=["id", "created_at", "amount", "note", "category", "type"])
    buf = StringIO()
    df.to_csv(buf, index=False)
    buf.seek(0)
    return StreamingResponse(buf, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=transactions.csv"})


