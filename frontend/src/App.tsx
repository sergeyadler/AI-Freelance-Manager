import { useEffect, useMemo, useState } from 'react';
import './App.css';
import dayjs from 'dayjs';
import type { Category } from './lib/api';
import { createCategory, createTransaction, getBalance, getMonthlyReport, getDailyReport, listCategories, listTransactions } from './lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Shared exact-name emoji map so both Grid and Carousel use the same source
const CATEGORY_EMOJI: Record<string, string> = {
  // Income
  'Salary': '💼', 'Business': '🏢', 'Dividends': '📈', 'Gifts': '🎁', 'Other income': '➕',
  // Expenses from your list
  'Food': '🍎', 'Eating Out': '🍽️', 'Clothes': '👖', 'Sport': '🏋️', 'Car': '🚗', 'Household': '🏠', 'Relaxation': '🧘', 'Mobile': '📱',
  'Internet': '🌐', 'Insurance': '🛡️', 'Finance': '💱', 'DM': '🛍️', 'Home': '🧰', 'Personal care': '🧴', 'Electronics': '💻',
  'Travel': '✈️', 'Sharing': '🚌', 'Charity': '🤝', 'Medication': '💊', 'Education': '🎓', 'Investing': '🪙', 'Pets': '🐾',
  'Hobbys': '🎮', 'Other': '⭐️', 'Children': '🧒', 'Presents': '🎁'
};

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState(''); 
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [activeType, setActiveType] = useState<'income' | 'expense'>('expense');
  const [balance, setBalance] = useState<{ income: number; expense: number; net: number } | null>(null);
  const today = useMemo(() => dayjs(), []);
  const [entryDate, setEntryDate] = useState<string>(today.format('YYYY-MM-DD'));
  const [view, setView] = useState<'entry' | 'chart'>('entry');
  async function refresh() {
    const [cats, txs, bal] = await Promise.all([listCategories(), listTransactions(), getBalance()]);
    setCategories(cats);
    setTransactions(txs);
    setBalance(bal);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTransaction() {
    if (!categoryId || !amount) return;
    await createTransaction({ amount: Number(amount), category_id: categoryId, note, created_at: dayjs(entryDate).toISOString() });
    setAmount('');
    setNote('');
    await refresh();
  }

  const monthReport = useMonthReport(today.year(), today.month() + 1, activeType);
  const filteredCategories = categories.filter(c => c.type === activeType);
  const filteredTransactions = transactions.filter(t => {
    const cat = categories.find(c => c.id === t.category_id);
    return cat?.type === activeType;
  });

  return (
    <div className="screen">
      <div className="topbar">
        <div>≡</div>
        <div className="title">{activeType === 'income' ? 'Enter income' : 'Enter expense'}</div>
        <button aria-label="Toggle view" onClick={() => setView(view === 'entry' ? 'chart' : 'entry')} style={{ background: 'transparent', border: 'none', fontSize: 20 }}>📊</button>
      </div>
      <div className="controls">
        {view === 'entry' ? (
          <>
            <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} style={{ flex: '1 1 auto' }} />
            <button onClick={addTransaction}>Add</button>
          </>
        ) : (
          <>
            <button onClick={() => {
              const v = prompt('Choose date (YYYY-MM-DD):', entryDate);
              if (v) setEntryDate(v);
            }} aria-label="Pick date">📅</button>
          </>
        )}
      </div>

      {view === 'entry' && (
        <>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative' }}>
            <div className="keypad-wrap">
              <div className="display">{amount || '0'}</div>
              <Keypad value={amount} onChange={setAmount} />
            </div>
            <div className="side-rail" style={{ top: 120 }}>
              <button aria-label="Toggle income/expense" onClick={() => setActiveType(activeType === 'income' ? 'expense' : 'income')}>{activeType === 'income' ? '➖' : '➕'}</button>
              <button aria-label="Pick date" onClick={() => { const v = prompt('Choose date (YYYY-MM-DD):', entryDate); if (v) setEntryDate(v); }}>📅</button>
            </div>
          </div>

          <CategoryCarousel
            categories={filteredCategories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        </>
      )}

      {view === 'entry' ? (
      <div style={{ width: '100%', marginTop: 24 }}>
        <div style={{ width: '100%' }}>
          <h3>Recent ({activeType})</h3>
          <ul className="list" style={{ listStyle: 'none', padding: 0, width: '100%' }}>
            {filteredTransactions.slice(0, 10).map((t) => {
              const cat = categories.find(c => c.id === t.category_id);
              return (
                <li key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 20, textAlign: 'center' }}>{cat ? (CATEGORY_EMOJI[cat.name] ?? '❓') : '❓'}</span>
                    <span>{cat?.name ?? 'Unknown'}</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>{t.amount}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      ) : (
        <ChartPanel activeType={activeType} />
      )}
    </div>
  );
}

const COLORS = ['#6ec6ff', '#ff80ab', '#ffd54f', '#80deea', '#b39ddb', '#a5d6a7'];

function useMonthReport(year: number, month: number, type: 'income' | 'expense') {
  const [data, setData] = useState<{ category: string; type: string; total: number }[]>([]);
  useEffect(() => {
    getMonthlyReport(year, month, type).then(all => setData(all));
  }, [year, month, type]);
  return data;
}

function ChartPanel({ activeType }: { activeType: 'income' | 'expense' }) {
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const d = dayjs(date);
  const [mode, setMode] = useState<'day' | 'month'>('month');
  const [data, setData] = useState<{ category: string; type: string; total: number }[]>([]);
  useEffect(() => {
    if (mode === 'month') {
      getMonthlyReport(d.year(), d.month() + 1, activeType).then(setData);
    } else {
      getDailyReport(d.year(), d.month() + 1, d.date(), activeType).then(setData);
    }
  }, [date, mode, activeType]);
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setMode(mode === 'month' ? 'day' : 'month')}>Mode: {mode}</button>
        <button onClick={() => { const v = prompt('Choose date (YYYY-MM-DD):', date); if (v) setDate(v); }}>📅 {date}</button>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="total" data={data} nameKey="category" outerRadius={110}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


function CategoryCarousel({ categories, selectedId, onSelect }: { categories: Category[]; selectedId?: number; onSelect: (id: number) => void }) {
  const pageSize = 8; // 2 rows * 4 columns
  const pages: Category[][] = [];
  for (let i = 0; i < categories.length; i += pageSize) pages.push(categories.slice(i, i + pageSize));
  const [page, setPage] = useState(0);
  const max = Math.max(0, pages.length - 1);
  return (
      <div>
      <div className="carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {pages.map((group, idx) => (
            <div className="cat-grid" key={idx}>
              {group.map(c => (
                <div key={c.id} className={"cat-item" + (selectedId === c.id ? ' active' : '')} onClick={() => onSelect(c.id)}>
                  <div className="cat-emoji">{CATEGORY_EMOJI[c.name] ?? '❓'}</div>
                  <div className="cat-name">{c.name}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-nav">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>‹</button>
        <div>{page + 1} / {max + 1}</div>
        <button onClick={() => setPage(p => Math.min(max, p + 1))} disabled={page === max}>›</button>
      </div>
    </div>
  );
}

function Keypad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const press = (c: string) => {
    if (c === 'C') return onChange('');
    if (c === '⌫') return onChange(value.slice(0, -1));
    if (c === '.' && value.includes('.')) return;
    onChange(value + c);
  };
  return (
    <div className="keypad">
      {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
        <button key={k} onClick={() => press(k)}>{k}</button>
      ))}
    </div>
  );
}

export default App;
