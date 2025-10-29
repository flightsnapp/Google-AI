import React from 'react';
import type { UserProfile } from '../types';

interface HeaderProps {
    userProfile: UserProfile | null;
    onLogout: () => void;
    onNavigateToProfile: () => void;
}

const LogoIcon = () => (
    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8a13 13 0 0 1 13.95 20M2 4a17 17 0 0 1 17.95 20M12 4v16"/>
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ userProfile, onLogout, onNavigateToProfile }) => {
    return (
        <header className="p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
                        FlightSnapp
                    </h1>
                </div>
                {userProfile && (
                     <div className="flex items-center gap-4">
                        <button onClick={onNavigateToProfile} className="flex items-center gap-2 text-right p-1 rounded-md hover:bg-cyan-900/50 transition-colors">
                            <img src={userProfile.picture} alt={userProfile.name} className="w-8 h-8 rounded-full border-2 border-cyan-500/50" />
                            <div>
                                <p className="text-sm text-white font-semibold leading-tight">{userProfile.name}</p>
                                {userProfile.email && <p className="text-xs text-cyan-400/70 leading-tight">{userProfile.email}</p>}
                            </div>
                        </button>
                         <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm rounded-md text-cyan-300 bg-black/50 border border-cyan-700 hover:bg-cyan-900/50 transition-colors"
                         >
                            Sign Out
                         </button>
                     </div>
                )}
            </div>
        </header>
    );
};