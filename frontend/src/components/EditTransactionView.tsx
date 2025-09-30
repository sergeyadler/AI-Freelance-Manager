import React, { useState, useEffect } from 'react';
import type { EditTransactionViewProps } from '../types';
import { Trash2, CalendarDays, Save } from 'lucide-react';
import dayjs from 'dayjs';

const EditTransactionView: React.FC<EditTransactionViewProps> = ({
  transaction,
  categories,
  onFormChange,
  onDelete,
  onOpenDatePicker,
  onSave
}) => {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [categoryId, setCategoryId] = useState(transaction.category_id);
  const [note, setNote] = useState(transaction.note || '');
  const [currentDate, setCurrentDate] = useState(transaction.created_at);

  // Update parent with form data whenever it changes
  useEffect(() => {
    // When editing, use the current date state
    onFormChange({
      amount: Number(amount),
      category_id: categoryId,
      note: note.trim(),
      created_at: currentDate
    });
  }, [amount, categoryId, note, currentDate, onFormChange]);

  // Update currentDate when transaction prop changes (from date picker)
  useEffect(() => {
    setCurrentDate(transaction.created_at);
  }, [transaction.created_at]);

  const filteredCategories = categories.filter(c => {
    const transactionCategory = categories.find(cat => cat.id === transaction.category_id);
    return c.type === transactionCategory?.type;
  });

  return (
    <div style={{ 
      padding: '16px', 
      maxWidth: '400px', 
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        >
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Date
        </label>
        <button
          onClick={onOpenDatePicker}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          <span>{dayjs(currentDate).format('MMM DD, YYYY')}</span>
          <CalendarDays size={20} />
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: 16,
        marginTop: 32 
      }}>
        <button
          onClick={onSave}
          style={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '20px',
            color: '#22c55e',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            flex: 1
          }}
        >
          <Save size={20} />
          Save Changes
        </button>
        
        <button
          onClick={onDelete}
          style={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            flex: 1
          }}
        >
          <Trash2 size={20} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditTransactionView;
