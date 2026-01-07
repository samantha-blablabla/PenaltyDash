import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Search, 
  LogOut,
  FolderOpen,
  Calendar,
  Loader2,
  Wallet,
  X,
  Edit2
} from 'lucide-react';
import { Transaction, TransactionType, DashboardStats, UserProfile } from './types';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { AIConsultant } from './components/AIConsultant';
import { LoginScreen } from './components/LoginScreen';
import { TeamPresence } from './components/TeamPresence';
import { AvatarEditor } from './components/AvatarEditor';
import { transactionService } from './services/storageService';
import { presenceService } from './services/presenceService';
import { TEAM_MEMBERS } from './constants';

const USER_STORAGE_KEY = 'penalty_dash_user_v2'; // Bumped version for new avatar support

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);

  // Load user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch data on mount and subscribe to changes
  useEffect(() => {
    if (!currentUser) return; // Only fetch if logged in

    fetchTransactions();

    // Setup Transaction Subscription
    const txSubscription = transactionService.subscribe((payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        setTransactions((prev) => [payload.new as Transaction, ...prev]);
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setTransactions((prev) => prev.filter((t) => t.id !== payload.old!.id));
      } else if (payload.eventType === 'RESET') {
        setTransactions([]);
      }
    });

    // Setup Presence Subscription
    // Note: We subscribe with currentUser. If currentUser changes (e.g. avatar update), 
    // we need to update the presence service.
    const presenceSub = presenceService.subscribe(currentUser, (users) => {
      setOnlineUsers(users);
    });

    return () => {
      txSubscription.unsubscribe();
      presenceSub.unsubscribe();
    };
  }, [currentUser]); // Re-run if currentUser changes (this handles presence update implicitly via re-subscription or we can optimize)

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: UserProfile) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if(confirm('Bạn muốn đăng xuất khỏi thiết bị này?')) {
      localStorage.removeItem(USER_STORAGE_KEY);
      setCurrentUser(null);
    }
  };

  const handleUpdateAvatar = (newUrl: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, avatar: newUrl };
    setCurrentUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Determine which presence instance to update. 
    // Since re-rendering App component will trigger useEffect cleanup and re-subscribe,
    // the new avatar will be broadcast automatically by the new subscription.
    // However, for immediate local feedback without flicker, we can manually update via service if we exposed it,
    // but React effect cleanup/setup is fast enough here.
  };

  // Helper to find avatar from TEAM_MEMBERS or Online Users or Fallback
  const getAvatarUrl = (name: string) => {
    // 1. Check if it's the current user (show their custom avatar immediately)
    if (currentUser && currentUser.name === name) return currentUser.avatar;

    // 2. Check online users (they might have custom avatars broadcasted)
    const onlineUser = onlineUsers.find(u => u.name === name);
    if (onlineUser && onlineUser.avatar) return onlineUser.avatar;

    // 3. Fallback to static list
    const member = TEAM_MEMBERS.find(m => m.name === name);
    if (member && member.avatar) {
        return member.avatar;
    }
    
    // 4. Generate fallback
    return `https://robohash.org/${encodeURIComponent(name)}.png?set=set4&size=150x150`;
  };

  // Calculate stats
  const stats: DashboardStats = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) income += t.amount;
      else expense += t.amount;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      transactionCount: transactions.length
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        // Date Range Filter
        if (dateRange.start && t.date < dateRange.start) return false;
        if (dateRange.end && t.date > dateRange.end) return false;

        if (filter === 'INCOME') return t.type === TransactionType.INCOME;
        if (filter === 'EXPENSE') return t.type === TransactionType.EXPENSE;
        return true;
      })
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.relatedPerson && t.relatedPerson.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, searchTerm, dateRange]);

  const handleAddTransaction = async (newTransaction: Transaction) => {
    try {
      setShowForm(false);
      
      // 1. Add to LocalStorage
      const savedTx = await transactionService.add(newTransaction);
      
      // 2. Update Local State immediately
      setTransactions(prev => [savedTx, ...prev]);

    } catch (error) {
      console.error("Error saving transaction", error);
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Sidebar */}
      <aside className="hidden sm:flex w-64 flex-col justify-between py-6 px-4 bg-[#0b1121] border-r border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Wallet size={16} className="text-white" />
             </div>
             <span className="text-xl font-bold text-white tracking-wide">Penalty<span className="text-primary-500">.</span></span>
          </div>

          <div className="space-y-2">
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-primary-500/10 text-primary-500 font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <List size={20} />
              <span>Giao dịch</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <FolderOpen size={20} />
              <span>Báo cáo</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Calendar size={20} />
              <span>Lịch</span>
            </a>
          </div>
        </div>

        <div className="space-y-4">
           {/* Current User Card in Sidebar with Edit Avatar button */}
           <div className="bg-[#1e293b] rounded-2xl p-3 border border-gray-700/50 flex items-center gap-3 relative group">
              <div className="relative cursor-pointer" onClick={() => setShowAvatarEditor(true)}>
                <img src={currentUser.avatar} alt="me" className="w-10 h-10 rounded-full bg-black/20" />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={12} className="text-white" />
                </div>
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{currentUser.role}</p>
              </div>
           </div>

           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all"
           >
              <LogOut size={20} />
              <span>Đăng xuất</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        
        {/* Header / Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
           {/* Breadcrumbs / Title */}
           <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                 <span>Home</span> / <span>Dashboard</span> / <span className="text-primary-400">{new Date().toLocaleDateString('vi-VN', {day: '2-digit', month: 'short'})}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Quản lý thu chi</h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-gray-400 text-sm">Team Marketing</p>
              </div>
           </div>

           {/* Actions */}
           <div className="flex items-center gap-4 w-full md:w-auto">
              
              <div className="relative flex-1 md:flex-none">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm"
                    className="bg-[#1e293b] text-white text-sm rounded-full pl-10 pr-4 py-2.5 outline-none border border-gray-700 focus:border-primary-500 w-full md:w-48 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              {/* Team Presence Component */}
              <div className="hidden sm:block">
                <TeamPresence onlineUsers={onlineUsers} />
              </div>

              {/* Mobile Profile Indicator (since sidebar is hidden on mobile) */}
              <button onClick={() => setShowAvatarEditor(true)} className="sm:hidden flex items-center gap-3 bg-[#1e293b] py-1.5 px-3 rounded-full border border-gray-700">
                 <img src={currentUser.avatar} alt="user" className="w-8 h-8 rounded-full bg-white/10" />
              </button>

              <button 
                onClick={() => setShowForm(true)} 
                className="accent-gradient text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5 border border-white/10 whitespace-nowrap"
              >
                 + Giao dịch
              </button>
           </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 size={48} className="text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Status Cards */}
            <StatsCards stats={stats} />

            {/* Charts Section */}
            <Charts transactions={transactions} />

            {/* Recent Transactions List (Styled as Glass Card) */}
            <div className="glass-card-gradient rounded-3xl p-6 lg:p-8 shadow-xl border border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
                    <p className="text-gray-500 text-sm">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    
                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 bg-[#0f172a] p-1.5 rounded-xl border border-gray-800 px-3">
                        <input 
                            type="date" 
                            className="bg-transparent text-gray-400 text-xs font-medium outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-gray-600">-</span>
                        <input 
                            type="date" 
                            className="bg-transparent text-gray-400 text-xs font-medium outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                        {(dateRange.start || dateRange.end) && (
                            <button 
                                onClick={() => setDateRange({start: '', end: ''})}
                                className="text-gray-500 hover:text-red-400 ml-1 transition-colors p-0.5"
                                title="Xóa lọc ngày"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex bg-[#0f172a] p-1 rounded-xl border border-gray-800">
                        <button 
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'ALL' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Tất cả
                        </button>
                        <button 
                            onClick={() => setFilter('INCOME')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'INCOME' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Thu
                        </button>
                        <button 
                            onClick={() => setFilter('EXPENSE')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'EXPENSE' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Chi
                        </button>
                    </div>
                  </div>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-gray-500 text-xs uppercase font-semibold">
                        <tr className="border-b border-gray-700/50">
                          <th className="pb-4 pl-4">Mô tả</th>
                          <th className="pb-4">Danh mục</th>
                          <th className="pb-4">Người liên quan</th>
                          <th className="pb-4">Ngày</th>
                          <th className="pb-4 text-right pr-4">Số tiền</th>
                          <th className="pb-4 text-right pr-4">Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredTransactions.map((t, idx) => (
                          <tr key={t.id || idx} className="group border-b border-gray-700/30 last:border-0 hover:bg-white/5 transition-colors">
                              <td className="py-4 pl-4 font-medium text-white flex items-center gap-3">
                                <div className={`w-2 h-10 rounded-full ${t.type === TransactionType.INCOME ? 'bg-primary-500' : 'bg-pink-500'}`}></div>
                                <div>
                                    <div className="text-base">{t.description}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{t.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}</div>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1e293b] text-gray-300 border border-gray-700">
                                    {t.category}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src={getAvatarUrl(t.relatedPerson || 'Unknown')} 
                                        alt="p" 
                                        className="w-6 h-6 rounded-full border border-[#0f172a] bg-white/10" 
                                    />
                                    <span className="text-gray-300 font-medium">{t.relatedPerson || 'N/A'}</span>
                                </div>
                              </td>
                              <td className="py-4 text-gray-400">
                                {new Date(t.date).toLocaleDateString('vi-VN')}
                                <span className="block text-xs text-gray-600">09:00 AM</span>
                              </td>
                              <td className={`py-4 pr-4 text-right font-bold text-base ${t.type === TransactionType.INCOME ? 'text-primary-400' : 'text-pink-400'}`}>
                                {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                              </td>
                              <td className="py-4 pr-4 text-right">
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      if(confirm('Bạn có chắc muốn xóa?')) {
                                          transactionService.delete(t.id);
                                          // Update local state handled by listener
                                      }
                                  }} 
                                  className="text-gray-600 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                                >
                                    <LogOut size={16} />
                                </button>
                              </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {dateRange.start || dateRange.end 
                            ? "Không có giao dịch nào trong khoảng thời gian này"
                            : "Chưa có giao dịch nào"
                        }
                    </div>
                  )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && currentUser && (
        <TransactionForm 
            onAdd={handleAddTransaction} 
            onClose={() => setShowForm(false)} 
            currentUser={currentUser}
        />
      )}
      
      {showAvatarEditor && currentUser && (
        <AvatarEditor 
           user={currentUser}
           onClose={() => setShowAvatarEditor(false)}
           onSave={handleUpdateAvatar}
        />
      )}
      
      <AIConsultant transactions={transactions} />
    </div>
  );
};

export default App;