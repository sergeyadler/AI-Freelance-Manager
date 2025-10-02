import { useState } from 'react';
import './App.css';
import dayjs from 'dayjs';

// Import our refactored components and hooks
import { 
  ChartPanel, 
  EditTransactionView, 
  DatePicker, 
  MenuModal,
  CategoriesView,
  CreateCategoryView,
  EditCategoryView 
} from './components';
import { useTransactions, useNavigation, useForm } from './hooks';
import type { TransactionType, DatePickerContext, EditFormData, Transaction, Category } from './types';
import { exportCSV } from './lib/api';
import HistoryView from './components/HistoryView';
import EntryView from './components/EntryView';
import Header from './components/Header';

function App() {
  // Use our custom hooks for state management
  const { 
    transactions, 
    categories, 
    balance,
    updateTransaction, 
    deleteTransaction,
    createCategory,
    updateCategory,
    deleteCategory,
    addTransaction
  } = useTransactions();
  
  const { 
    view, 
    setView,
    goBack,
    navigateToHistory,
    navigateToEdit,
    navigateToCategories,
    navigateToCreateCategory,
    navigateToEditCategory,
    resetToHistory,
    resetToCategories
  } = useNavigation();
  const { 
    amount,
    note,
    categoryId,
    entryDate,
    setAmount,
    setNote,
    setCategoryId,
    setEntryDate,
    resetForm
  } = useForm();

  // Additional state for UI
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [chartDate, setChartDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [chartMode, setChartMode] = useState<'day' | 'month' | 'year'>('month');
  const [historyDate, setHistoryDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [datePickerContext, setDatePickerContext] = useState<DatePickerContext>('entry');


  const handleUpdateTransaction = async (transactionId: number, updates: Partial<Transaction>) => {
    await updateTransaction(transactionId, updates);
    setEditingTransaction(null);
    setEditFormData(null);
    resetToHistory();
  };

  const handleDeleteTransaction = async () => {
    if (editingTransaction) {
      await deleteTransaction(editingTransaction.id);
      setEditingTransaction(null);
      setEditFormData(null);
      resetToHistory();
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  // Filtered data
  const filteredCategories = categories.filter(c => c.type === activeType);
  
  const filteredTransactions = transactions.filter(t => {
    const cat = categories.find(c => c.id === t.category_id);
    const transactionDate = dayjs(t.created_at);
    const today = dayjs();
    const isToday = transactionDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
    return cat?.type === activeType && isToday;
  }).sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());

  const todayTotal = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);


  return (
    <div className="screen">
      {/* Top Bar */}
      <Header
        view={view}
        setView={setView}
        goBack={goBack}
        setShowMenuModal={setShowMenuModal}
        activeType={activeType}
      />

      {/* Main Content */}
      {view === 'entry' ? (
        <EntryView
          onSetActiveType={setActiveType}
          activeType={activeType}
          onOpenDatePicker={(context) => {
            setDatePickerContext(context);
            setShowDatePicker(true);
          }}
          filteredCategories={filteredCategories}
          filteredTransactions={filteredTransactions}
          todayTotal={todayTotal}
          setEditingTransaction={setEditingTransaction}
          setEditFormData={setEditFormData}
          setHistoryDate={setHistoryDate}
          navigateToHistory={navigateToHistory}
          navigateToEdit={navigateToEdit}
          navigateToCategories={navigateToCategories}
          addTransaction={addTransaction}
          amount={amount}
          note={note}
          categoryId={categoryId}
          entryDate={entryDate}
          setAmount={setAmount}
          setNote={setNote}
          setCategoryId={setCategoryId}
          resetForm={resetForm}
        />
      ) : view === 'chart' ? (
        <ChartPanel 
          mode={chartMode}
          activeType={activeType} 
          chartDate={chartDate}
          onModeChange={setChartMode}
          onDateChange={setChartDate}
          onToggleType={() => setActiveType(activeType === 'income' ? 'expense' : 'income')}
          onOpenDatePicker={() => {
            setDatePickerContext('chart');
            setShowDatePicker(true);
          }}
        />
      ) : view === 'history' ? (
        <HistoryView
          onNavigateToEdit={navigateToEdit}
          onSetEditingTransaction={setEditingTransaction}
          onSetEditFormData={setEditFormData}
          onsetHistoryDate={setHistoryDate}
          historyDate={historyDate}
          transactions={transactions}
          categories={categories}
          activeType={activeType}
        />
      ) : view === 'edit' ? (
        <div>
          {editingTransaction && (
            <EditTransactionView
              transaction={{
                ...editingTransaction,
                ...(editFormData || {})
              }}
              categories={categories}
              onFormChange={setEditFormData}
              onDelete={handleDeleteTransaction}
              onOpenDatePicker={() => {
                setDatePickerContext('edit');
                setShowDatePicker(true);
              }}
              onSave={() => editFormData && editingTransaction && handleUpdateTransaction(editingTransaction.id, editFormData)}
            />
          )}
        </div>
      ) : view === 'categories' ? (
        <CategoriesView
          categories={categories}
          onNavigateToCreateCategory={navigateToCreateCategory}
          onNavigateToEditCategory={(category) => {
            setEditingCategory(category);
            navigateToEditCategory(category);
          }}
        />
      ) : view === 'createCategory' ? (
        <CreateCategoryView
          onCreateCategory={async (name, type) => {
            await createCategory(name, type);
            resetToCategories();
          }}
        />
      ) : view === 'editCategory' ? (
        <div style={{ padding: '20px' }}>
          {editingCategory && (
            <EditCategoryView
              category={editingCategory}
              onUpdateCategory={async (id, name, type) => {
                await updateCategory(id, name, type);
                resetToCategories();
              }}
              onDeleteCategory={async (id) => {
                await deleteCategory(id);
                resetToCategories();
              }}
            />
          )}
        </div>
      ) : null}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePicker 
          selectedDate={
            datePickerContext === 'entry' ? entryDate : 
            datePickerContext === 'chart' ? chartDate :
            editFormData ? dayjs(editFormData.created_at).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
          } 
          onDateChange={(date: string) => {
            if (datePickerContext === 'entry') {
              setEntryDate(date);
            } else if (datePickerContext === 'chart') {
              setChartDate(date);
            } else if (datePickerContext === 'edit' && editFormData) {
              const selectedDate = dayjs(date);
              const currentTime = dayjs();
              const updatedDateTime = selectedDate.hour(currentTime.hour())
                .minute(currentTime.minute())
                .second(currentTime.second())
                .millisecond(currentTime.millisecond());
              
              setEditFormData({
                ...editFormData,
                created_at: updatedDateTime.toISOString()
              });
            }
            setShowDatePicker(false);
          }}
          context={datePickerContext}
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)} 
        />
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <MenuModal
          isOpen={showMenuModal}
          onClose={() => setShowMenuModal(false)}
          balance={balance}
          onExportCSV={handleExportCSV}
          onRefreshBalance={() => {/* TODO: Implement refresh balance */}}
        />
      )}
    </div>
  );
}

export default App;
