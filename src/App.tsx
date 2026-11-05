import { useState, useEffect } from 'react';
import { Expense, DateFilter } from './types';
import { getActiveUser, setActiveUser } from './services/storage';
import {
  fetchExpensesFromCloud,
  createExpenseLocallyOrCloud,
  deleteExpenseFromCloud,
  syncOfflineQueueToCloud
} from './services/supabase';
import { calculateTotalExpense, filterExpensesByDateRange } from './utils/calculations';
import { getTodayDateString } from './utils/formatters';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { DailySummaryCard } from './components/dashboard/DailySummaryCard';
import { ExpenseList } from './components/dashboard/ExpenseList';
import { ReceiptScanner } from './components/scan/ReceiptScanner';
import { ManualExpenseForm } from './components/manual/ManualExpenseForm';
import { SettingsView } from './components/settings/SettingsView';
import { ProfilePinModal } from './components/auth/ProfilePinModal';

export default function App() {
  const [activeUser, setActiveUserState] = useState<'user_1' | 'user_2'>(getActiveUser());
  const [isLocked, setIsLocked] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueueToCloud();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchExpensesFromCloud(activeUser).then(data => {
      if (data && data.length > 0) setExpenses(data);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeUser]);

  const handleSwitchUser = (newUser: 'user_1' | 'user_2') => {
    setActiveUser(newUser);
    setActiveUserState(newUser);
    fetchExpensesFromCloud(newUser).then(data => setExpenses(data || []));
  };

  const handleSaveExpense = async (newExpense: Expense) => {
    const saved = await createExpenseLocallyOrCloud(newExpense);
    setExpenses(prev => [saved, ...prev]);
    setActiveTab('dashboard');
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await deleteExpenseFromCloud(id);
  };

  const filteredExpenses = filterExpensesByDateRange(expenses, dateFilter);
  const todayExpenses = filterExpensesByDateRange(expenses, 'today', getTodayDateString());
  const monthExpenses = filterExpensesByDateRange(expenses, 'month', getTodayDateString());

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24 shadow-xl">
      <Header
        activeUser={activeUser}
        isOnline={isOnline}
        onLock={() => setIsLocked(true)}
      />

      <main className="p-4 space-y-4">
        {activeTab === 'dashboard' && (
          <>
            <DailySummaryCard
              todayTotal={calculateTotalExpense(todayExpenses)}
              monthTotal={calculateTotalExpense(monthExpenses)}
              todayCount={todayExpenses.length}
            />

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'today', label: 'Hari Ini' },
                { id: 'week', label: '7 Hari' },
                { id: 'month', label: 'Bulan Ini' },
                { id: 'all', label: 'Semua' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDateFilter(f.id as DateFilter)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    dateFilter === f.id
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} />
          </>
        )}

        {activeTab === 'scan' && (
          <ReceiptScanner
            activeUser={activeUser}
            onSaveExpense={handleSaveExpense}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'manual' && (
          <ManualExpenseForm activeUser={activeUser} onSave={handleSaveExpense} />
        )}

        {activeTab === 'settings' && (
          <SettingsView activeUser={activeUser} expenses={expenses} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {isLocked && (
        <ProfilePinModal
          activeUser={activeUser}
          onUnlock={() => setIsLocked(false)}
          onSwitchUser={handleSwitchUser}
        />
      )}
    </div>
  );
}

