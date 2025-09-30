import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import type { UseFormReturn } from '../types';

export const useForm = (): UseFormReturn => {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [entryDate, setEntryDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const resetForm = useCallback(() => {
    setAmount('');
    setNote('');
    setCategoryId(undefined);
    setEntryDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  return {
    amount,
    note,
    categoryId,
    entryDate,
    setAmount,
    setNote,
    setCategoryId,
    setEntryDate,
    resetForm,
  };
};