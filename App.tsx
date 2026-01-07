import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  FolderOpen,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Transaction, TransactionType, DashboardStats } from './types';
import { MOCK_TRANSACTIONS } from './constants';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { AIConsultant } from './components/AIConsultant';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

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
        if (filter === 'INCOME') return t.type === TransactionType.INCOME;
        if (filter === 'EXPENSE') return t.type === TransactionType.EXPENSE;
        return true;
      })
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, searchTerm]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Sidebar - Matching Reference (Dark, minimal, curved selected state) */}
      <aside className="hidden sm:flex w-64 flex-col justify-between py-6 px-4 bg-[#0b1121] border-r border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
             </div>
             <span className="text-xl font-bold text-white tracking-wide">Penalty<span className="text-blue-500">.</span></span>
          </div>

          <div className="space-y-2">
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-blue-600/10 text-blue-400 font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
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

        <div>
           <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-2">
              <Settings size={20} />
              <span>Cài đặt</span>
           </a>
           <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <LogOut size={20} />
              <span>Đăng xuất</span>
           </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        
        {/* Header / Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
           {/* Breadcrumbs / Title */}
           <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                 <span>Home</span> / <span>Dashboard</span> / <span className="text-blue-400">{new Date().toLocaleDateString('vi-VN', {day: '2-digit', month: 'short'})}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Quản lý thu chi</h1>
              <p className="text-gray-400 text-sm">Quản lý kế hoạch và ngân sách đơn giản hơn.</p>
           </div>

           {/* Actions */}
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="hidden md:flex items-center -space-x-2">
                 {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-8 h-8 rounded-full border-2 border-[#0f172a]" />
                 ))}
                 <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-[#0f172a] text-xs">+</button>
              </div>

              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm"
                    className="bg-[#1e293b] text-white text-sm rounded-full pl-10 pr-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 w-full md:w-48 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <button className="relative p-2.5 bg-[#1e293b] rounded-full text-gray-400 hover:text-white transition-colors border border-gray-700">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b]"></span>
              </button>

              <button 
                onClick={() => setShowForm(true)} 
                className="accent-gradient text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
              >
                 + Mới
              </button>
           </div>
        </header>

        {/* Status Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <Charts transactions={transactions} />

        {/* Recent Transactions List (Styled as Glass Card) */}
        <div className="glass-card-gradient rounded-3xl p-6 lg:p-8 shadow-xl">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
                 <p className="text-gray-500 text-sm">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              
              <div className="flex bg-[#0f172a] p-1 rounded-xl">
                 <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'ALL' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                 >
                    Tất cả
                 </button>
                 <button 
                    onClick={() => setFilter('INCOME')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'INCOME' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                 >
                    Thu
                 </button>
                 <button 
                    onClick={() => setFilter('EXPENSE')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'EXPENSE' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                 >
                    Chi
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="text-gray-500 text-xs uppercase font-semibold">
                    <tr className="border-b border-gray-700/50">
                       <th className="pb-4 pl-4">Mô tả</th>
                       <th className="pb-4">Danh mục</th>
                       <th className="pb-4">Người tham gia</th>
                       <th className="pb-4">Ngày</th>
                       <th className="pb-4 text-right pr-4">Số tiền</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {filteredTransactions.map((t, idx) => (
                       <tr key={t.id} className="group border-b border-gray-700/30 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4 font-medium text-white flex items-center gap-3">
                             <div className={`w-2 h-10 rounded-full ${t.type === TransactionType.INCOME ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
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
                             <div className="flex -space-x-2">
                                <img src={`https://i.pravatar.cc/100?img=${idx + 15}`} alt="p" className="w-6 h-6 rounded-full border border-[#0f172a]" />
                                <img src={`https://i.pravatar.cc/100?img=${idx + 20}`} alt="p" className="w-6 h-6 rounded-full border border-[#0f172a]" />
                                <div className="w-6 h-6 rounded-full bg-[#1e293b] border border-[#0f172a] flex items-center justify-center text-[10px] text-gray-400">+2</div>
                             </div>
                          </td>
                          <td className="py-4 text-gray-400">
                             {new Date(t.date).toLocaleDateString('vi-VN')}
                             <span className="block text-xs text-gray-600">09:00 AM</span>
                          </td>
                          <td className={`py-4 pr-4 text-right font-bold text-base ${t.type === TransactionType.INCOME ? 'text-blue-400' : 'text-pink-400'}`}>
                             {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                 <div className="text-center py-10 text-gray-500">Chưa có giao dịch nào</div>
              )}
           </div>
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <TransactionForm onAdd={handleAddTransaction} onClose={() => setShowForm(false)} />
      )}
      <AIConsultant transactions={transactions} />
    </div>
  );
};

export default App;