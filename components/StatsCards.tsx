import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Main Balance Card */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 accent-gradient opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-40"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-cyan-400 rounded-full blur-[60px] opacity-40"></div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-blue-100 font-medium mb-1 flex items-center gap-2">
                <Wallet size={18} /> Số dư quỹ hiện tại
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-white mt-2">
                {formatCurrency(stats.netBalance)}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
              <CreditCard className="text-white" size={20} />
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                <p className="text-blue-100 text-xs mb-1">Thu (Phạt)</p>
                <div className="flex items-center gap-2">
                   <span className="text-lg font-bold text-white">{formatCurrency(stats.totalIncome)}</span>
                   <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                     <ArrowUpRight size={10} className="mr-0.5"/> 12%
                   </span>
                </div>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                <p className="text-blue-100 text-xs mb-1">Chi tiêu</p>
                <div className="flex items-center gap-2">
                   <span className="text-lg font-bold text-white">{formatCurrency(stats.totalExpense)}</span>
                   <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                     <ArrowDownRight size={10} className="mr-0.5"/> 5%
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="glass-card-gradient rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Hoạt động</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <TrendingUp size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Tổng thu</p>
                <p className="text-xs text-gray-500">Tháng này</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-400">{formatCurrency(stats.totalIncome)}</span>
          </div>

          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Tổng chi</p>
                <p className="text-xs text-gray-500">Tháng này</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-400">{formatCurrency(stats.totalExpense)}</span>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700/50">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Ngân sách sử dụng</span>
                <span className="text-xs text-white font-bold">70%</span>
             </div>
             <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};