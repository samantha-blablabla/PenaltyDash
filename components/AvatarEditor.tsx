import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface AvatarEditorProps {
  user: UserProfile;
  onSave: (newAvatarUrl: string) => void;
  onClose: () => void;
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({ user, onSave, onClose }) => {
  const [seed, setSeed] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Extract seed from current avatar url if possible, or use name
    // Format: https://robohash.org/SEED.png?set=set4&size=150x150
    const match = user.avatar?.match(/robohash\.org\/(.+?)\.png/);
    const initialSeed = match ? match[1] : user.name;
    setSeed(initialSeed);
    setPreviewUrl(user.avatar || `https://robohash.org/${initialSeed}.png?set=set4&size=150x150`);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (seed) {
        setPreviewUrl(`https://robohash.org/${encodeURIComponent(seed)}.png?set=set4&size=150x150`);
      }
    }, 500); // Debounce preview update
    return () => clearTimeout(timer);
  }, [seed]);

  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setSeed(randomSeed);
  };

  const handleSave = () => {
    onSave(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md p-4">
      <div className="glass-card-gradient rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-700/50">
          <h3 className="text-lg font-bold text-white">Đổi Avatar Mèo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary-500/30 bg-[#0f172a] overflow-hidden mb-6 relative group">
             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Nhập tên / Seed text</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="flex-1 bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="Nhập chữ bất kỳ..."
                />
                <button 
                  onClick={handleRandomize}
                  className="p-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  title="Random"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Thay đổi text để tạo ra một chú mèo Robohash mới độc đáo cho riêng bạn!
            </p>

            <button
              onClick={handleSave}
              className="w-full accent-gradient text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};