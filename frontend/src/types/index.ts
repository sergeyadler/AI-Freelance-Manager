// Core domain types
export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: number;
  amount: number;
  note: string | null | undefined;
  created_at: string;
  category_id: number;
}

export interface Balance {
  income: number;
  expense: number;
  net: number;
}

export interface ReportItem {
  category: string;
  type: string;
  total: number;
}

// UI State types
export type ViewType = 'entry' | 'chart' | 'edit' | 'history' | 'categories' | 'createCategory' | 'editCategory';
export type TransactionType = 'income' | 'expense';
export type DatePickerContext = 'entry' | 'chart' | 'history' | 'edit';

// Navigation types
export type NavigationView = 'entry' | 'chart' | 'history' | 'edit' | 'categories' | 'createCategory' | 'editCategory';

// Form types
export interface EditFormData {
  amount: number;
  category_id: number;
  note: string;
  created_at: string;
}

export interface HeaderProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  goBack: () => void;
  setShowMenuModal: (show: boolean) => void;
  activeType: TransactionType;
}

// Component Props interfaces
export interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
}

export interface CategoryCarouselProps {
  categories: Category[];
  onSelect: (id: number) => void;
  onNavigateToCategories: () => void;
}

export interface EntryViewProps {
  onSetActiveType: (type: TransactionType) => void;
  activeType: TransactionType;
  onOpenDatePicker: (context: DatePickerContext) => void;
  filteredCategories: Category[];
  filteredTransactions: Transaction[];
  todayTotal: number;
  setEditingTransaction: (transaction: Transaction) => void;
  setEditFormData: (formData: EditFormData) => void;
  setHistoryDate: (date: string) => void;
  // Navigation functions
  navigateToHistory: () => void;
  navigateToEdit: (transaction: Transaction) => void;
  navigateToCategories: () => void;
  // Transaction handling
  addTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  // Form state
  amount: string;
  note: string;
  categoryId: number | undefined;
  entryDate: string;
  setAmount: (amount: string) => void;
  setNote: (note: string) => void;
  setCategoryId: (id: number | undefined) => void;
  resetForm: () => void;
}

export interface ChartPanelProps {
  mode: 'day' | 'month' | 'year';
  activeType: TransactionType;
  chartDate: string;
  onModeChange: (mode: 'day' | 'month' | 'year') => void;
  onDateChange: (date: string) => void;
  onToggleType: () => void;
  onOpenDatePicker: () => void;
}

export interface EditTransactionViewProps {
  transaction: Transaction;
  categories: Category[];
  onFormChange: (formData: EditFormData) => void;
  onDelete: () => void;
  onOpenDatePicker: () => void;
  onSave: () => void;
}

export interface HistoryViewProps {
  historyDate: string;
  transactions: Transaction[];
  categories: Category[];
  activeType: TransactionType;
  onNavigateToEdit: (transaction: Transaction) => void;
  onsetHistoryDate: (date: string) => void;
  onSetEditingTransaction: (transaction: Transaction) => void;
  onSetEditFormData: (formData: EditFormData) => void;
}

export interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  context: DatePickerContext;
  isOpen: boolean;
  onClose: () => void;
}

export interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: Balance | null;
  onExportCSV: () => void;
  onRefreshBalance: () => void;
}

// Hook return types
export interface UseTransactionsReturn {
  transactions: Transaction[];
  categories: Category[];
  balance: Balance | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: number, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  createCategory: (name: string, type: 'income' | 'expense') => Promise<void>;
  updateCategory: (id: number, name: string, type: 'income' | 'expense') => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export interface UseNavigationReturn {
  view: ViewType;
  navigationStack: NavigationView[];
  setView: (view: ViewType) => void;
  goBack: () => void;
  navigateToHistory: () => void;
  navigateToEdit: (transaction: Transaction) => void;
  navigateToCategories: () => void;
  navigateToCreateCategory: () => void;
  navigateToEditCategory: (category: Category) => void;
  resetToHistory: () => void;
  resetToCategories: () => void;
}

export interface UseFormReturn {
  amount: string;
  note: string;
  categoryId: number | undefined;
  entryDate: string;
  setAmount: (amount: string) => void;
  setNote: (note: string) => void;
  setCategoryId: (id: number | undefined) => void;
  setEntryDate: (date: string) => void;
  resetForm: () => void;
}
