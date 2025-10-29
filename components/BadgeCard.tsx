import React from 'react';
import type { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <div className="bg-black/50 border border-cyan-700/50 rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 hover:bg-cyan-900/50 hover:border-cyan-600">
      <div className="text-4xl mb-2">{badge.icon}</div>
      <h4 className="text-sm font-bold text-white leading-tight">{badge.name}</h4>
      <p className="text-xs text-cyan-400/70 font-sans mt-1">{badge.description}</p>
    </div>
  );
};
