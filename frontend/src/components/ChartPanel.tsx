import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { ChartPanelProps, ReportItem } from '../types';
import { getDailyReport, getMonthlyReport } from '../lib/api';
import { CategoryIcon } from '../utils/categoryIcons';
import { ChevronLeft, ChevronRight, Plus, Minus, CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';

const ChartPanel: React.FC<ChartPanelProps> = ({
  mode,
  activeType,
  chartDate,
  onModeChange,
  onDateChange,
  onToggleType,
  onOpenDatePicker
}) => {
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const d = dayjs(chartDate);
      let reportData: ReportItem[] = [];

      if (mode === 'day') {
        reportData = await getDailyReport(d.year(), d.month() + 1, d.date(), activeType);
      } else if (mode === 'month') {
        reportData = await getMonthlyReport(d.year(), d.month() + 1, activeType);
      } else if (mode === 'year') {
        // For year mode, aggregate all months
        const monthlyData: ReportItem[] = [];
        for (let month = 1; month <= 12; month++) {
          const monthData = await getMonthlyReport(d.year(), month, activeType);
          monthlyData.push(...monthData);
        }
        
        // Aggregate by category
        const aggregated = monthlyData.reduce((acc, item) => {
          const existing = acc.find(a => a.category === item.category);
          if (existing) {
            existing.total += item.total;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, [] as ReportItem[]);
        
        reportData = aggregated;
      }

      setData(reportData);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [mode, activeType, chartDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const d = dayjs(chartDate);
    let newDate: dayjs.Dayjs;

    if (mode === 'day') {
      newDate = direction === 'next' ? d.add(1, 'day') : d.subtract(1, 'day');
    } else if (mode === 'month') {
      newDate = direction === 'next' ? d.add(1, 'month') : d.subtract(1, 'month');
    } else {
      newDate = direction === 'next' ? d.add(1, 'year') : d.subtract(1, 'year');
    }

    onDateChange(newDate.format('YYYY-MM-DD'));
  };

  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);
  const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#fb7185', '#34d399', '#f472b6'];

  // Transform data for Recharts
  const chartData = data.map(item => ({
    name: item.category,
    value: item.total,
    total: item.total
  }));

  const formatDate = () => {
    const d = dayjs(chartDate);
    switch (mode) {
      case 'day':
        return d.format('MMM DD, YYYY');
      case 'month':
        return d.format('MMMM YYYY');
      case 'year':
        return d.format('YYYY');
      default:
        return d.format('MMM DD, YYYY');
    }
  };

  return (
    <div style={{ marginTop: 24, position: 'relative' }}>
      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        {(['day', 'month', 'year'] as const).map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => onModeChange(modeOption)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: mode === modeOption ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: '#e8e8f0',
              cursor: 'pointer',
              fontSize: 14,
              textTransform: 'capitalize'
            }}
          >
            {modeOption}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        <button
          onClick={() => navigateDate('prev')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e8e8f0',
            cursor: 'pointer',
            padding: 8
          }}
        >
          <ChevronLeft size={24} />
        </button>
        
        <h3 style={{ 
          margin: 0, 
          color: '#e8e8f0', 
          fontSize: 18, 
          fontWeight: 600,
          textAlign: 'center',
          minWidth: 120
        }}>
          {formatDate()}
        </h3>
        
        <button
          onClick={() => navigateDate('next')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e8e8f0',
            cursor: 'pointer',
            padding: 8
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Side Rail */}
      <div className="side-rail" style={{ top: 120 }}>
        <button 
          aria-label="Toggle income/expense" 
          onClick={onToggleType}
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
          onClick={onOpenDatePicker}
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

      {/* Chart */}
      <div style={{ width: '60%', height: '300px', justifySelf: 'center', margin: '0 auto' }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#e8e8f0'
          }}>
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#e8e8f0'
          }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="total"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Breakdown */}
      {data.length > 0 && (
        <div style={{ marginTop: 24, padding: '0 16px' }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            color: '#e8e8f0', 
            fontSize: 16,
            fontWeight: 600
          }}>
            Category Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map((item, index) => {
              const percentage = totalAmount > 0 ? (item.total / totalAmount) * 100 : 0;
              const color = COLORS[index % COLORS.length];
              
              return (
                <div key={item.category} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: color,
                    opacity: 0.8,
                    zIndex: 1
                  }} />
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CategoryIcon categoryName={item.category} size={16} />
                      <span style={{ color: '#e8e8f0', fontSize: 14 }}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#e8e8f0', fontSize: 12 }}>
                        {percentage.toFixed(1)}%
                      </span>
                      <span style={{ color: '#e8e8f0', fontWeight: 600 }}>
                        {item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPanel;
