from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


# Category Schemas
class CategoryCreate(BaseModel):
    name: str
    type: str  # 'income' or 'expense'


class CategorySchema(BaseModel):
    id: int
    name: str
    type: str
    user_id: Optional[int] = None

    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionCreate(BaseModel):
    amount: float
    category_id: int
    note: Optional[str] = None
    created_at: Optional[datetime] = None


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    category_id: Optional[int] = None
    note: Optional[str] = None
    created_at: Optional[datetime] = None


class TransactionSchema(BaseModel):
    id: int
    amount: float
    note: Optional[str]
    created_at: datetime
    category_id: int
    user_id: Optional[int] = None  # Allow None for existing transactions

    class Config:
        from_attributes = True


# Balance Schema
class Balance(BaseModel):
    income: float
    expense: float
    net: float
