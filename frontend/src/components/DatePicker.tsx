import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { DatePickerProps } from '../types';
import dayjs from 'dayjs';

// Custom styles for react-datepicker to match app theme
const customStyles = `
  .dark-theme {
    background-color: #2f2f3a !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 12px !important;
  }
  
  .dark-theme .react-datepicker__header {
    background-color: #2f2f3a !important;
    border-bottom: 1px solid rgba(255,255,255,0.2) !important;
  }
  
  .dark-theme .react-datepicker__current-month,
  .dark-theme .react-datepicker__day-name {
    color: #e8e8f0 !important;
  }
  
  .dark-theme .react-datepicker__day {
    color: #e8e8f0 !important;
  }
  
  .dark-theme .react-datepicker__day:hover {
    background-color: rgba(255,255,255,0.1) !important;
  }
  
  .dark-theme .react-datepicker__day--selected {
    background-color: rgba(255,255,255,0.2) !important;
    color: #e8e8f0 !important;
  }
  
  .dark-theme .react-datepicker__day--today {
    background-color: rgba(255,255,255,0.05) !important;
    color: #e8e8f0 !important;
  }
  
  .dark-theme .react-datepicker__navigation {
    color: #e8e8f0 !important;
  }
  
  .dark-theme .react-datepicker__navigation:hover {
    background-color: rgba(255,255,255,0.1) !important;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  context,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onDateChange(dayjs(date).format('YYYY-MM-DD'));
    }
    onClose();
  };

  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date();
    
    switch (context) {
      case 'entry':
        startDate.setMonth(today.getMonth() - 12);
        break;
      case 'chart':
        startDate.setFullYear(today.getFullYear() - 2); // Allow 2 years back for chart
        break;
      case 'history':
        startDate.setMonth(today.getMonth() - 12);
        break;
      case 'edit':
        startDate.setMonth(today.getMonth() - 12); // Allow 12 months back for editing
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }
    
    return { startDate, endDate: today };
  };

  const { startDate, endDate } = getDateRange();

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#2f2f3a',
          borderRadius: 20,
          padding: 20,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DatePicker
          selected={dayjs(selectedDate).toDate()}
          onChange={handleDateChange}
          minDate={startDate}
          maxDate={endDate}
          inline
          calendarClassName="dark-theme"
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: 16 
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20,
              color: '#e8e8f0',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;
