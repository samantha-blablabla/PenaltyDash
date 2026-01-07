import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Net Balance */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-primary-500/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet size={48} className="text-primary-500" />
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">Số dư hiện tại</p>
        <h3 className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
          {formatCurrency(stats.netBalance)}
        </h3>
        <div className="mt-4 flex items-center text-xs text-gray-400">
          <span className="text-green-400 flex items-center mr-1">
            <TrendingUp size={14} className="mr-1" /> +12%
          </span>
          so với tháng trước
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={48} className="text-green-500" />
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">Tổng thu (Phạt)</p>
        <h3 className="text-2xl font-bold text-green-400">
          {formatCurrency(stats.totalIncome)}
        </h3>
        <div className="w-full bg-gray-700 h-1.5 mt-4 rounded-full">
          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </div>

      {/* Total Expense */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingDown size={48} className="text-red-500" />
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">Tổng chi (Hoạt động)</p>
        <h3 className="text-2xl font-bold text-red-400">
          {formatCurrency(stats.totalExpense)}
        </h3>
         <div className="w-full bg-gray-700 h-1.5 mt-4 rounded-full">
          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
          <DollarSign size={48} className="text-blue-500" />
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">Tổng giao dịch</p>
        <h3 className="text-2xl font-bold text-white">
          {stats.transactionCount}
        </h3>
        <p className="text-xs text-gray-400 mt-4">Ghi nhận trong hệ thống</p>
      </div>
    </div>
  );
};