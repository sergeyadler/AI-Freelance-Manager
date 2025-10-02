from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from .db import get_db
from .models import User, Category
from .auth import get_password_hash, verify_password, create_access_token, get_current_user
from .schemas import UserRegister, UserLogin, UserResponse, Token

def create_default_categories_for_user(user_id: int, db: Session):
    """Create default categories for a new user"""
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
    
    for name, type_ in defaults:
        # Check if category already exists for this user
        existing = db.scalar(select(Category).where(
            Category.name == name, 
            Category.user_id == user_id
        ))
        if not existing:
            category = Category(name=name, type=type_, user_id=user_id)
            db.add(category)
    
    db.commit()


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.scalar(select(User).where(User.email == user_data.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default categories for the new user
    create_default_categories_for_user(new_user.id, db)
    
    return new_user


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    # Find user by email
    user = db.scalar(select(User).where(User.email == user_data.email))
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})  # Convert to string
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user


@router.post("/setup-default-categories")
async def setup_default_categories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create default categories for the current user (useful for existing users)"""
    create_default_categories_for_user(current_user.id, db)
    return {"message": "Default categories created successfully"}

