import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { TEAM_MEMBERS } from '../constants';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-10">
             <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6 transform -rotate-6">
                <Wallet size={40} className="text-white" />
             </div>
             <h1 className="text-4xl font-bold text-white mb-3">PenaltyDash <span className="text-primary-400">Team</span></h1>
             <p className="text-gray-400">Chọn tài khoản của bạn để truy cập hệ thống</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
                <button
                    key={member.name}
                    onClick={() => onLogin(member)}
                    className="group relative glass-card-gradient p-6 rounded-3xl border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-primary-500/20 transform hover:-translate-y-1"
                >
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-[#0f172a] border-4 border-white/5 group-hover:border-primary-500/50 transition-colors overflow-hidden relative z-10">
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Glow effect behind avatar */}
                        <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full z-0"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{member.name}</h3>
                    <div className="mt-2 px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 font-medium border border-white/5 group-hover:border-primary-500/30 group-hover:text-gray-300 transition-all">
                        {member.role}
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Sparkles size={16} className="text-yellow-400" />
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};