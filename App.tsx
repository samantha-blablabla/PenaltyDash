import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  Settings, 
  ChevronDown
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
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-primary-500 selection:text-gray-900">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-800 bg-gray-900">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center ps-2.5 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-orange-500/20">
              <span className="text-gray-900 font-bold text-lg">P</span>
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-white tracking-tight">Penalty<span className="text-primary-500">Dash</span></span>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <a href="#" className="flex items-center p-3 text-gray-900 rounded-lg bg-primary-500 shadow-lg shadow-primary-900/20 group">
                <LayoutDashboard className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-900" />
                <span className="ms-3 font-semibold">Tổng quan</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white group transition-all">
                <List className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Lịch sử giao dịch</span>
              </a>
            </li>
             <li>
              <a href="#" className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white group transition-all">
                <Settings className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Cài đặt</span>
              </a>
            </li>
          </ul>
          
          <div className="absolute bottom-5 left-0 w-full px-4">
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
               <div className="flex items-center space-x-3 mb-3">
                 <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs">AD</div>
                 <div>
                    <p className="text-sm font-semibold text-white">Admin User</p>
                    <p className="text-xs text-gray-400">Quản trị viên</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Quản Lý Quỹ</h1>
            <p className="text-gray-400 text-sm mt-1">Hôm nay, {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-grow md:flex-grow-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 outline-none placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button className="p-2.5 text-gray-400 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-gray-900 font-bold rounded-lg text-sm px-5 py-2.5 shadow-lg shadow-primary-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
               <Plus size={18} /> <span className="hidden sm:inline">Thêm mới</span>
             </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts */}
        <Charts transactions={transactions} />

        {/* Transaction Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Giao dịch gần đây</h3>
            
            <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700">
               <button 
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'ALL' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
               >
                 Tất cả
               </button>
               <button 
                  onClick={() => setFilter('INCOME')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'INCOME' ? 'bg-gray-700 text-green-400 shadow' : 'text-gray-400 hover:text-white'}`}
               >
                 Thu phạt
               </button>
               <button 
                  onClick={() => setFilter('EXPENSE')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'EXPENSE' ? 'bg-gray-700 text-red-400 shadow' : 'text-gray-400 hover:text-white'}`}
               >
                 Chi tiêu
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Mô tả</th>
                  <th scope="col" className="px-6 py-4 font-medium">Danh mục</th>
                  <th scope="col" className="px-6 py-4 font-medium">Ngày</th>
                  <th scope="col" className="px-6 py-4 font-medium">Trạng thái</th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {t.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-700 text-gray-300 text-xs px-2.5 py-0.5 rounded border border-gray-600">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(t.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full mr-2 ${t.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-gray-300">{t.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}</span>
                         </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {showForm && (
        <TransactionForm onAdd={handleAddTransaction} onClose={() => setShowForm(false)} />
      )}

      {/* AI Assistant */}
      <AIConsultant transactions={transactions} />
    </div>
  );
};

export default App;