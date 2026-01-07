import React, { useState } from 'react';
import { Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({ name: name.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="glass-card-gradient p-8 rounded-3xl shadow-2xl border border-white/10 text-center">
          
          <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/30 mb-8 transform -rotate-6">
            <Wallet size={40} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Xin chào! 👋</h1>
          <p className="text-gray-400 mb-8">Chào mừng đến với PenaltyDash. <br/> Vui lòng nhập tên của bạn để bắt đầu.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên hiển thị (VD: Tuấn Anh)"
                className="w-full bg-[#0b1121] border border-gray-700 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-600 text-center text-lg font-medium"
                autoFocus
                required
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={20} />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full accent-gradient text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
            >
              Vào Dashboard <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500">
            Hệ thống sử dụng LocalStorage để lưu dữ liệu. <br/> Không cần mật khẩu.
          </p>
        </div>
      </div>
    </div>
  );
};