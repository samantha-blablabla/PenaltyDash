import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2, ArrowLeft, User } from 'lucide-react';
import { Transaction, TransactionType, UserProfile } from '../types';
import { categoryService } from '../services/storageService';
import { TEAM_MEMBERS } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => Promise<void> | void;
  onClose: () => void;
  currentUser: UserProfile;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose, currentUser }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [amount, setAmount] = useState<string>('');
  
  // State for categories
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);

  const [description, setDescription] = useState<string>('');
  const [relatedPerson, setRelatedPerson] = useState<string>(currentUser.name);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const cats = categoryService.getAll();
    setAvailableCategories(cats);
    if (cats.length > 0) {
      setCategory(cats[0]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Removed !description check to make it optional
    if (!amount || isSubmitting) return;
    if (isCreatingCategory && !category.trim()) return;

    setIsSubmitting(true);
    try {
      // If user created a new category, save it
      if (isCreatingCategory) {
        categoryService.add(category);
      }

      const newTransaction: Transaction = {
        id: '', // ID will be assigned by storage service
        type,
        amount: parseFloat(amount),
        category: category.trim(),
        description: description.trim(), // Allow empty description
        relatedPerson: relatedPerson.trim() || currentUser.name,
        date,
        status: 'completed'
      };

      await onAdd(newTransaction);
      // onClose handled by parent
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-md p-4">
      <div className="glass-card-gradient rounded-3xl w-full max-w-md shadow-2xl overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Plus className="mr-2 text-blue-500" /> Thêm Giao dịch
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full disabled:opacity-50">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
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

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Số tiền</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 font-mono"
                  placeholder="0"
                  required
                />
              </div>
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
          </div>

          {/* Related Person - Modified to Select Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
               {type === TransactionType.INCOME ? 'Người nộp phạt' : 'Người nhận/Chi cho'}
            </label>
            <div className="relative">
                <select
                  value={relatedPerson}
                  onChange={(e) => setRelatedPerson(e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                  required
                >
                  {TEAM_MEMBERS.map(member => (
                    <option key={member.name} value={member.name}>{member.name} ({member.role})</option>
                  ))}
                  {/* Option for external entities if needed, like 'Company Funds' */}
                  <option value="Quỹ chung">Quỹ chung / Khác</option>
                </select>
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Category Selection or Creation */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Danh mục</label>
            
            {isCreatingCategory ? (
               <div className="flex gap-2">
                 <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nhập tên danh mục mới..."
                    autoFocus
                    required
                 />
                 <button 
                   type="button"
                   onClick={() => {
                     setIsCreatingCategory(false);
                     setCategory(availableCategories[0] || '');
                   }}
                   className="px-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                   title="Quay lại danh sách"
                 >
                   <ArrowLeft size={20} />
                 </button>
               </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '___NEW___') {
                    setIsCreatingCategory(true);
                    setCategory('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
              >
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="___NEW___" className="font-semibold text-blue-400 bg-[#1e293b]">+ Thêm danh mục mới...</option>
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Mô tả chi tiết</label>
                <span className="text-[10px] text-gray-500 italic">(Không bắt buộc)</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-gray-600"
              placeholder="Ví dụ: Đi trễ 15p họp đầu tuần..."
              // Removed required attribute
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full accent-gradient text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Đang lưu...
                </>
              ) : (
                'Lưu giao dịch'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};