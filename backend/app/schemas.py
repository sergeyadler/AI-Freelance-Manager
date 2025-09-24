from datetime import datetime
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(min_length=1)
    type: str = Field(pattern="^(income|expense)$")


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    amount: float
    category_id: int
    note: str | None = None
    created_at: datetime | None = None


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int

    class Config:
        from_attributes = True


class Balance(BaseModel):
    income: float
    expense: float
    net: float


