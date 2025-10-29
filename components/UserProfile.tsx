import React from 'react';
// FIX: Alias the imported UserProfile type to UserProfileType to avoid name collision with the component.
import type { UserProfile as UserProfileType, Persona } from '../types';
import { BADGE_DATA } from '../constants';
import { BadgeCard } from './BadgeCard';

interface UserProfilePageProps {
  userProfile: UserProfileType;
  persona: Persona;
  onReturnToHub: () => void;
}

export const UserProfile: React.FC<UserProfilePageProps> = ({ userProfile, persona, onReturnToHub }) => {
  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <button onClick={onReturnToHub} className="text-cyan-400 hover:text-white mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Welcome Hub
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 pb-8 border-b border-cyan-800">
            <img src={userProfile.picture} alt={userProfile.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-500/50" />
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{userProfile.name}</h1>
                <p className="text-lg text-cyan-400/80">{userProfile.email}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">Your Travel Persona</h2>
                <div className="bg-black/50 border border-cyan-700/50 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white">{persona.name}</h3>
                    <p className="text-md text-cyan-300 italic mb-4">"{persona.vibe}"</p>
                    <p className="text-sm text-cyan-400/80 font-sans leading-relaxed">{persona.description}</p>
                </div>
            </div>
             <div>
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">Earned Badges</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {BADGE_DATA.map(badge => (
                        <BadgeCard key={badge.name} badge={badge} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};