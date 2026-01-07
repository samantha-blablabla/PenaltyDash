import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      status: 'completed'
    };

    onAdd(newTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-md p-4">
      <div className="glass-card-gradient rounded-3xl w-full max-w-md shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Plus className="mr-2 text-blue-500" /> Thêm Giao dịch
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-[#0f172a] rounded-2xl border border-gray-700/50">
            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
              onClick={() => setType(TransactionType.INCOME)}
            >
              Thu (Phạt)
            </button>
            <button
              type="button"
              className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
              onClick={() => setType(TransactionType.EXPENSE)}
            >
              Chi tiêu
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Số tiền</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-gray-600"
              placeholder="Ví dụ: Nộp phạt đi trễ..."
              required
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full accent-gradient text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};