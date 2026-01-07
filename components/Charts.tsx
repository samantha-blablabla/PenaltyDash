import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

// Updated COLORS to include the new Primary Amber/Orange
const COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];

export const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  // Process data for Bar Chart (Monthly Income vs Expense)
  const monthlyData = React.useMemo(() => {
    const data: Record<string, { name: string; Thu: number; Chi: number }> = {};
    
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!data[key]) {
        data[key] = { name: key, Thu: 0, Chi: 0 };
      }

      if (t.type === TransactionType.INCOME) {
        data[key].Thu += t.amount;
      } else {
        data[key].Chi += t.amount;
      }
    });

    return Object.values(data);
  }, [transactions]);

  // Process data for Pie Chart (Expenses by Category)
  const categoryData = React.useMemo(() => {
    const data: Record<string, number> = {};
    transactions.forEach(t => {
      if (!data[t.category]) {
        data[t.category] = 0;
      }
      data[t.category] += t.amount;
    });

    return Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }));
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-6">Biến động Thu Chi theo tháng</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="Thu" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Thu (Phạt)" />
              <Bar dataKey="Chi" fill="#ef4444" radius={[4, 4, 0, 0]} name="Chi tiêu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-6">Phân bổ theo Danh mục</h3>
        <div className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};