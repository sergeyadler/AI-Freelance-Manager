import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://ai-freelance-manager.ew.r.appspot.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add JWT auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const { data } = await api.get('/categories');
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(payload: { name: string; type: 'income' | 'expense' }): Promise<Category> {
  const { data } = await api.post('/categories', payload);
  return data;
}

export async function listTransactions(): Promise<Transaction[]> {
  const { data } = await api.get('/transactions');
  return data;
}

export async function createTransaction(payload: {
  amount: number;
  category_id: number;
  note?: string | null;
  created_at?: string;
}): Promise<Transaction> {
  const { data } = await api.post('/transactions', payload);
  return data;
}

export async function getBalance(): Promise<{ income: number; expense: number; net: number }> {
  const { data } = await api.get('/balance');
  return data;
}

export async function getMonthlyReport(year: number, month: number, type?: 'income' | 'expense'): Promise<{ category: string; type: string; total: number }[]> {
  // Get user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await api.get('/report/month', { 
    params: { year, month, type, timezone } 
  });
  return data;
}

export async function getDailyReport(year: number, month: number, day: number, type?: 'income' | 'expense'): Promise<{ category: string; type: string; total: number }[]> {
  // Get user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await api.get('/report/day', { 
    params: { year, month, day, type, timezone } 
  });
  return data;
}

export async function updateTransaction(id: number, payload: Partial<Transaction>): Promise<Transaction> {
  const { data } = await api.put(`/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}

export async function updateCategory(id: number, payload: { name: string; type: 'income' | 'expense' }): Promise<Category> {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}

export async function exportCSV(): Promise<Blob> {
  const response = await api.get('/export/csv', {
    responseType: 'blob'
  });
  return response.data;
}


