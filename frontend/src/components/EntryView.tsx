import React from 'react';
import type { EntryViewProps } from '../types';
import dayjs from 'dayjs';
import { CategoryIcon } from '../utils/categoryIcons';
import CategoryCarousel from './CategoryCarousel';
import { useTransactions } from '../hooks/useTransactions';
import { Minus, Plus, CalendarDays, History } from 'lucide-react';
import Keypad from './Keypad';

const EntryView: React.FC<EntryViewProps> = ({
  onSetActiveType,
  activeType,
  onOpenDatePicker,
  filteredCategories,
  filteredTransactions,
  todayTotal,
  setEditingTransaction,
  setEditFormData,
  setHistoryDate,
  navigateToHistory,
  navigateToEdit,
  navigateToCategories,
  addTransaction,
  amount,
  note,
  categoryId,
  entryDate,
  setAmount,
  setNote,
  setCategoryId,
  resetForm,
}) => {
  const { categories } = useTransactions();

    // Transaction management functions
    const handleAddTransaction = async (selectedCategoryId?: number) => {
      const catId = selectedCategoryId || categoryId;
      if (!catId || !amount) return;
      
      // Use the selected entry date with current time for transaction creation
      const selectedDate = dayjs(entryDate);
      const currentTime = dayjs();
      const transactionDate = selectedDate.hour(currentTime.hour())
        .minute(currentTime.minute())
        .second(currentTime.second())
        .millisecond(currentTime.millisecond())
        .toISOString();
      
      await addTransaction({ 
        amount: Number(amount), 
        category_id: catId, 
        note, 
        created_at: transactionDate 
      });
      resetForm();
    };

  return (
    <div style={{ marginTop: 24, position: 'relative' }}>
      {/* Side Rail */}
      <div className="side-rail" style={{ top: 120 }}>
        <button 
          aria-label="Toggle income/expense" 
          onClick={() => onSetActiveType(activeType === 'income' ? 'expense' : 'income')}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            border: '2px solid rgba(255,255,255,0.4)',
            background: 'rgba(0,0,0,0.3)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {activeType === 'income' ? <Minus size={24} /> : <Plus size={24} />}
        </button>
        
        <button 
          aria-label="Pick date" 
          onClick={() => {
            onOpenDatePicker('entry');
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            border: '2px solid rgba(255,255,255,0.4)',
            background: 'rgba(0,0,0,0.3)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarDays size={24} />
        </button>
      </div>

      {/* Keypad */}
      <div className="keypad-wrap">
        <div className="display">
          {amount || '\xa0'}
        </div>
        <Keypad value={amount} onChange={setAmount} />
      </div>

      {/* Note Field */}
      <div style={{ marginTop: 24, padding: '0 16px' }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            fontSize: 16,
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Categories */}
      <CategoryCarousel
        categories={filteredCategories}
        onSelect={(id) => {
          setCategoryId(id);
          // Automatically add transaction when category is selected
          if (amount) {
            handleAddTransaction(id);
          }
        }}
        onNavigateToCategories={navigateToCategories}
      />

      {/* Recent Transactions */}
      <div style={{ marginTop: 32, padding: '0 16px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#e8e8f0', fontSize: 18, fontWeight: 600 }}>
          {activeType === 'expense' ? 'Spent today: ' : 'Earned today: '} {todayTotal.toFixed(2)}
        </h3>
        
        {filteredTransactions.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredTransactions.map(t => {
              const cat = categories.find(c => c.id === t.category_id);
              return (
                <li key={t.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setEditingTransaction(t);
                  setEditFormData({
                    amount: t.amount,
                    category_id: t.category_id,
                    note: t.note || '',
                    created_at: t.created_at
                  });
                  navigateToEdit(t);
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CategoryIcon categoryName={cat?.name || ''} size={20} />
                    <span style={{ color: '#e8e8f0', fontSize: 16 }}>
                      {cat?.name || 'Unknown'}
                    </span>
                    {t.note && (
                      <span style={{ color: '#a0a0a0', fontSize: 14 }}>
                        - {t.note}
                      </span>
                    )}
                  </div>
                  <span style={{ color: '#e8e8f0', fontWeight: 600 }}>
                    {t.amount.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: '#a0a0a0', textAlign: 'center', margin: '20px 0' }}>
            No transactions today
          </p>
        )}
        
        <button
          onClick={() => {
            setHistoryDate(dayjs().format('YYYY-MM-DD'));
            navigateToHistory();
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: 16,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: '#e8e8f0',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <History size={20} />
          History
        </button>
      </div>
  </div>
  );
};

export default EntryView;
