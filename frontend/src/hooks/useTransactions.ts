import { useState, useEffect, useCallback } from 'react';
import { listCategories, listTransactions, createTransaction, getBalance, API_BASE } from '../lib/api';
import type { Category, Transaction, Balance, UseTransactionsReturn } from '../types';

export const useTransactions = (): UseTransactionsReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await listCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories.');
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const txs = await listTransactions();
      setTransactions(txs);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions.');
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const bal = await getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError('Failed to load balance.');
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchCategories(), fetchTransactions(), fetchBalance()]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data.');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchTransactions, fetchBalance]);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await createTransaction(transactionData);
      await refresh();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      setError('Failed to add transaction.');
      throw err;
    }
  }, [refresh]);

  const updateTransaction = useCallback(async (id: number, updates: Partial<Transaction>) => {
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      
      await refresh();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setError('Failed to update transaction.');
      throw err;
    }
  }, [refresh]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      
      await refresh();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Failed to delete transaction.');
      throw err;
    }
  }, [refresh]);

  const createCategory = useCallback(async (name: string, type: 'income' | 'expense') => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      await refresh();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('Failed to create category.');
      throw err;
    }
  }, [refresh]);

  const updateCategory = useCallback(async (id: number, name: string, type: 'income' | 'expense') => {
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      await refresh();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category.');
      throw err;
    }
  }, [refresh]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      await refresh();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Failed to delete category.');
      throw err;
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    transactions,
    categories,
    balance,
    loading,
    error,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};