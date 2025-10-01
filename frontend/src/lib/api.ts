import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://ai-freelance-manager.ew.r.appspot.com';

export type Category = { id: number; name: string; type: 'income' | 'expense' };
export type Transaction = {
  id: number;
  amount: number;
  note: string | null | undefined;
  created_at: string;
  category_id: number;
};

export async function listCategories(): Promise<Category[]> {
  try {
    const { data } = await axios.get(`${API_BASE}/categories`);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(payload: { name: string; type: 'income' | 'expense' }): Promise<Category> {
  const { data } = await axios.post(`${API_BASE}/categories`, payload);
  return data;
}

export async function listTransactions(): Promise<Transaction[]> {
  const { data } = await axios.get(`${API_BASE}/transactions`);
  return data;
}

export async function createTransaction(payload: {
  amount: number;
  category_id: number;
  note?: string | null;
  created_at?: string;
}): Promise<Transaction> {
  const { data } = await axios.post(`${API_BASE}/transactions`, payload);
  return data;
}

export async function getBalance(): Promise<{ income: number; expense: number; net: number }> {
  const { data } = await axios.get(`${API_BASE}/balance`);
  return data;
}

export async function getMonthlyReport(year: number, month: number, type?: 'income' | 'expense'): Promise<{ category: string; type: string; total: number }[]> {
  // Get user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await axios.get(`${API_BASE}/report/month`, { 
    params: { year, month, type, timezone } 
  });
  return data;
}

export async function getDailyReport(year: number, month: number, day: number, type?: 'income' | 'expense'): Promise<{ category: string; type: string; total: number }[]> {
  // Get user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await axios.get(`${API_BASE}/report/day`, { 
    params: { year, month, day, type, timezone } 
  });
  return data;
}


