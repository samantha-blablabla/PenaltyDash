import React, { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import { Transaction } from '../types';
import { analyzeFinancialData } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIConsultantProps {
  transactions: Transaction[];
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');
    const result = await analyzeFinancialData(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 accent-gradient text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 z-50 group border border-white/10"
      >
        <Sparkles size={24} className="animate-pulse" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-gray-700">
          Hỏi AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <div className="glass-card-gradient rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 ring-1 ring-white/10">
        
        {/* Header */}
        <div className="accent-gradient p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <div className="bg-white/20 p-1.5 rounded-lg">
               <Bot size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-white">Trợ lý Tài chính AI</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-1 rounded-full"
          >
            Đóng
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-[#0b1121]/50 backdrop-blur-xl">
          {!analysis && !loading && (
             <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-blue-400" />
                </div>
                <p className="text-gray-300 mb-6 text-sm">
                  Tôi có thể phân tích dữ liệu thu chi của bạn và đưa ra những nhận xét thông minh.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-xl transition-colors border border-gray-600 shadow-lg text-sm"
                >
                  Bắt đầu phân tích
                </button>
             </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400 text-sm animate-pulse">Đang suy nghĩ...</p>
            </div>
          )}

          {analysis && (
            <div className="prose prose-invert prose-sm max-w-none text-gray-200">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                   <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="mt-6 text-blue-400 text-xs hover:text-blue-300 underline font-medium"
                >
                  Phân tích lại
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};