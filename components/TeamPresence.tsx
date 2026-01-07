import React from 'react';
import { UserProfile } from '../types';

interface TeamPresenceProps {
  onlineUsers: UserProfile[];
}

export const TeamPresence: React.FC<TeamPresenceProps> = ({ onlineUsers }) => {
  // Filter out invalid users just in case
  const users = onlineUsers.filter(u => u && u.name);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {users.slice(0, 5).map((user, idx) => (
        <div key={`${user.name}-${idx}`} className="relative group cursor-pointer" title={`${user.name} đang online`}>
          <div className="w-9 h-9 rounded-full border-2 border-[#0f172a] overflow-hidden bg-[#1e293b] relative z-10 hover:scale-110 transition-transform hover:z-20 shadow-md">
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          {/* Green Dot Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f172a] rounded-full z-20 animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg border border-white/10 font-medium">
            {user.name}
          </div>
        </div>
      ))}
      
      {users.length > 5 && (
        <div className="w-9 h-9 rounded-full border-2 border-[#0f172a] bg-[#1e293b] flex items-center justify-center text-[10px] text-gray-300 font-bold relative z-10 hover:z-20 cursor-default shadow-md">
          +{users.length - 5}
        </div>
      )}
      
      <div className="ml-3 text-xs text-gray-400 hidden lg:block">
        <span className="font-bold text-green-400">{users.length}</span> đang online
      </div>
    </div>
  );
};