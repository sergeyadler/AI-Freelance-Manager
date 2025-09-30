import React from 'react';
import type { HistoryViewProps } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import { CategoryIcon } from '../utils/categoryIcons';

const HistoryView: React.FC<HistoryViewProps> = ({
  onNavigateToEdit,
  onSetEditingTransaction,
  onSetEditFormData,
  transactions,
  categories,
  activeType,
  historyDate,
  onsetHistoryDate,
}) => {

  const monthlyTransactions = transactions.filter(t => {
    const cat = categories.find(c => c.id === t.category_id);
    const transactionDate = dayjs(t.created_at);
    const historyDateObj = dayjs(historyDate);
    return cat?.type === activeType && 
           transactionDate.month() === historyDateObj.month() && 
           transactionDate.year() === historyDateObj.year();
  }).sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());

  const navigateHistoryMonth = (direction: 'prev' | 'next') => {
    const currentDate = dayjs(historyDate);
    const today = dayjs();
    const twelveMonthsAgo = today.subtract(12, 'month');
    
    let newDate;
    if (direction === 'prev') {
      newDate = currentDate.subtract(1, 'month');
      // Don't go beyond 12 months ago
      if (newDate.isSame(twelveMonthsAgo, 'month') || newDate.isBefore(twelveMonthsAgo, 'month')) {
        return;
      }
    } else {
      newDate = currentDate.add(1, 'month');
      // Don't go beyond current month
      if (newDate.isAfter(today, 'month')) {
        return;
      }
    }
    
    onsetHistoryDate(newDate.format('YYYY-MM-DD'));
  };

  return (
    <div style={{ padding: '20px' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <button
        onClick={() => navigateHistoryMonth('prev')}
        style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          borderRadius: 20,
          color: '#e8e8f0', 
          cursor: 'pointer',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChevronLeft size={20} />
      </button>
      
      <select
        value={dayjs(historyDate).format('YYYY-MM')}
        onChange={(e) => {
          const selectedDate = dayjs(e.target.value + '-01');
          onsetHistoryDate(selectedDate.format('YYYY-MM-DD'));
        }}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 20,
          color: '#e8e8f0',
          padding: '8px 12px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          minWidth: '140px',
          textAlign: 'center'
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const month = dayjs().subtract(i, 'month');
          return (
            <option key={month.format('YYYY-MM')} value={month.format('YYYY-MM')}>
              {month.format('MMMM YYYY')}
            </option>
          );
        })}
      </select>
      
      <button
        onClick={() => navigateHistoryMonth('next')}
        style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          borderRadius: 20,
          color: '#e8e8f0', 
          cursor: 'pointer',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>

    {/* Transactions List */}
    {monthlyTransactions.length > 0 ? (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {monthlyTransactions.map(t => {
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
              onSetEditingTransaction(t);
              onSetEditFormData({
                amount: t.amount,
                category_id: t.category_id,
                note: t.note || '',
                created_at: t.created_at
              });
              onNavigateToEdit(t);
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CategoryIcon categoryName={cat?.name || ''} size={20} />
                <div>
                  <div style={{ color: '#e8e8f0', fontSize: 16 }}>
                    {cat?.name || 'Unknown'}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: 12 }}>
                    {dayjs(t.created_at).format('MMM DD, YYYY')}
                  </div>
                  {t.note && (
                    <div style={{ color: '#a0a0a0', fontSize: 12 }}>
                      {t.note}
                    </div>
                  )}
                </div>
</div>
              <span style={{ color: '#e8e8f0', fontWeight: 600 }}>
                {t.amount.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    ) : (
      <p style={{ color: '#a0a0a0', textAlign: 'center', margin: '40px 0' }}>
        No transactions this month
      </p>
    )}
  </div>
  );
};

export default HistoryView;
