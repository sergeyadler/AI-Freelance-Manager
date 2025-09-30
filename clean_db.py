#!/usr/bin/env python3
"""
Script to clean up the database by removing all categories and transactions,
then reinitializing with the correct default categories.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db import engine, Base
from backend.app.models import Category, Transaction
from backend.app.routes import init_db
from sqlalchemy.orm import Session

def clean_database():
    """Clean the database and reinitialize with default categories."""
    print("🧹 Cleaning database...")
    
    # Create all tables (this will recreate them)
    Base.metadata.drop_all(bind=engine)
    print("✅ Dropped all tables")
    
    Base.metadata.create_all(bind=engine)
    print("✅ Created all tables")
    
    # Initialize with default categories
    init_db()
    print("✅ Initialized with default categories")
    
    # Verify the categories
    with Session(engine) as db:
        categories = db.execute("SELECT name, type FROM categories ORDER BY name").all()
        print(f"\n📋 Current categories ({len(categories)} total):")
        print("Income categories:")
        for name, type_ in categories:
            if type_ == "income":
                print(f"  - {name}")
        
        print("\nExpense categories:")
        for name, type_ in categories:
            if type_ == "expense":
                print(f"  - {name}")
    
    print("\n🎉 Database cleanup complete!")

if __name__ == "__main__":
    clean_database()

