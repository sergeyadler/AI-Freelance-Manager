import { useState, useCallback } from 'react';
import type { ViewType, NavigationView, UseNavigationReturn, Transaction, Category } from '../types';

export const useNavigation = (): UseNavigationReturn => {
  const [view, setView] = useState<ViewType>('entry');
  const [navigationStack, setNavigationStack] = useState<NavigationView[]>(['entry']);

  const goBack = useCallback(() => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      const previousView = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setView(previousView as ViewType);
    } else {
      // If we're at the root, stay at entry
      setView('entry');
    }
  }, [navigationStack]);

  const navigateToHistory = useCallback(() => {
    setNavigationStack(prev => [...prev, 'history']);
    setView('history');
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigateToEdit = useCallback((_transaction: Transaction) => {
    setNavigationStack(prev => [...prev, 'edit']);
    setView('edit');
  }, []);

  const navigateToCategories = useCallback(() => {
    setNavigationStack(prev => [...prev, 'categories']);
    setView('categories');
  }, []);

  const navigateToCreateCategory = useCallback(() => {
    setNavigationStack(prev => [...prev, 'createCategory']);
    setView('createCategory');
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigateToEditCategory = useCallback((_category: Category) => {
    setNavigationStack(prev => [...prev, 'editCategory']);
    setView('editCategory');
  }, []);

  const resetToHistory = useCallback(() => {
    setNavigationStack(['entry', 'history']);
    setView('history');
  }, []);

  const resetToCategories = useCallback(() => {
    setNavigationStack(['entry', 'categories']);
    setView('categories');
  }, []);

  return {
    view,
    navigationStack,
    setView,
    goBack,
    navigateToHistory,
    navigateToEdit,
    navigateToCategories,
    navigateToCreateCategory,
    navigateToEditCategory,
    resetToHistory,
    resetToCategories,
  };
};