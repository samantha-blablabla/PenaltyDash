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
  AreaChart,
  Area
} from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

export const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  // Process data for Area Chart (Smoother look like reference)
  const monthlyData = React.useMemo(() => {
    const data: Record<string, { name: string; Thu: number; Chi: number }> = {};
    
    // Sort transactions by date first to ensure chart flows correctly
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getDate()}/${date.getMonth() + 1}`; // Show daily for more granularity
      
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Area Chart - Replaces Bar Chart for a smoother look */}
      <div className="lg:col-span-2 glass-card-gradient rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Phân tích dòng tiền</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorThu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorChi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="Thu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorThu)" name="Thu vào" />
              <Area type="monotone" dataKey="Chi" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorChi)" name="Chi ra" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="glass-card-gradient rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Danh mục</h3>
        <div className="h-72 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={false}
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-center">
                <p className="text-gray-400 text-xs">Tổng số</p>
                <p className="text-white font-bold text-xl">{categoryData.length}</p>
             </div>
          </div>
        </div>
        
        {/* Custom Legend */}
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
           {categoryData.slice(0, 4).map((entry, index) => (
             <div key={index} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-400 truncate max-w-[80px]">{entry.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};