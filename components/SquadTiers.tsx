import React from 'react';
import type { SquadTier } from '../types';

interface SquadTiersProps {
  tiers: SquadTier[];
}

const tierStyles = {
    1: { border: 'border-cyan-500/30', icon: 'text-cyan-400' },
    2: { border: 'border-cyan-500/60', icon: 'text-cyan-300' },
    3: { border: 'border-cyan-500', icon: 'text-cyan-200' },
};

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;

export const SquadTiers: React.FC<SquadTiersProps> = ({ tiers }) => {
  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">Assemble your Snapp Squad!</h2>
      <p className="text-cyan-300/80 text-center max-w-2xl mx-auto mb-8 font-sans">Recruiting more members unlocks enhanced perks for the entire squad.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map(tier => {
            const styles = tierStyles[tier.tier as keyof typeof tierStyles] || tierStyles[1];
            return (
              <div key={tier.tier} className={`bg-black/50 rounded-lg p-6 border-2 ${styles.border} flex flex-col text-center`}>
                <div className={`mx-auto mb-4 ${styles.icon}`}>
                    <UsersIcon />
                </div>
                <h3 className="text-xl font-bold text-white">Tier {tier.tier}</h3>
                <p className="text-cyan-300 font-semibold mb-4">+{tier.min_members} Travelers</p>
                <ul className="text-cyan-400 space-y-2 text-sm flex-grow font-sans">
                  {(tier.rewards || []).map((reward, index) => (
                    <li key={index} className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>{reward}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-cyan-600 italic mt-6 font-sans">{tier.cta}</p>
              </div>
            );
        })}
      </div>
    </div>
  );
};