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
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-400 text-gray-950 p-4 rounded-full shadow-2xl hover:shadow-primary-500/30 transition-all transform hover:scale-105 z-40 group border border-primary-400/50"
      >
        <Sparkles size={24} className="animate-pulse" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-gray-700 shadow-lg">
          Hỏi AI về ngân sách
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-md">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 ring-1 ring-white/10">
        
        {/* Header */}
        <div className="bg-primary-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <Bot size={24} className="text-gray-900" />
            <h3 className="font-bold text-white">Trợ lý Tài chính AI</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/10 p-1 rounded"
          >
            Đóng
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-900/95">
          {!analysis && !loading && (
             <div className="text-center py-8">
                <Sparkles size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-6">
                  Tôi có thể phân tích dữ liệu thu chi phạt của bạn và đưa ra những nhận xét hữu ích.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-gray-600 shadow-lg"
                >
                  Bắt đầu phân tích
                </button>
             </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="text-primary-500 animate-spin mb-4" />
              <p className="text-gray-400 text-sm animate-pulse">Đang suy nghĩ và phân tích dữ liệu...</p>
            </div>
          )}

          {analysis && (
            <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-inner">
                   <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="mt-6 text-primary-400 text-xs hover:text-primary-300 underline font-medium"
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