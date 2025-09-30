import React from 'react';
import type { Category } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';
import { Plus } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  onNavigateToCreateCategory: () => void;
  onNavigateToEditCategory: (category: Category) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onNavigateToCreateCategory,
  onNavigateToEditCategory
}) => {
  // Group categories by type
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#e8e8f0' }}>
          Categories
        </h1>
        <button
          onClick={onNavigateToCreateCategory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '20px',
            color: '#22c55e',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Income Categories */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: 16, 
          fontWeight: 600, 
          color: '#22c55e' 
        }}>
          Income Categories
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: 12 
        }}>
          {incomeCategories.map(category => (
            <div
              key={category.id}
              onClick={() => onNavigateToEditCategory(category)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
              }}
            >
              <CategoryIcon categoryName={category.name} size={24} />
              <span style={{ 
                marginTop: 8, 
                fontSize: 12, 
                color: '#e8e8f0', 
                textAlign: 'center',
                fontWeight: 500
              }}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: 16, 
          fontWeight: 600, 
          color: '#f87171' 
        }}>
          Expense Categories
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: 12 
        }}>
          {expenseCategories.map(category => (
            <div
              key={category.id}
              onClick={() => onNavigateToEditCategory(category)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              <CategoryIcon categoryName={category.name} size={24} />
              <span style={{ 
                marginTop: 8, 
                fontSize: 12, 
                color: '#e8e8f0', 
                textAlign: 'center',
                fontWeight: 500
              }}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesView;
