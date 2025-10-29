import React from 'react';
import { MOCK_VAYCOVERS_DATA } from '../constants';
import { VaycoverCard } from './VaycoverCard';
import type { Persona, Vaycover } from '../types';

interface VaycoverHubProps {
    onReturnToCurator: () => void;
    onSelectVaycover: (vaycover: Vaycover) => void;
    userPersona: Persona | null;
}

export const VaycoverHub: React.FC<VaycoverHubProps> = ({ onReturnToCurator, onSelectVaycover, userPersona }) => {
    const spotlightVaycover = MOCK_VAYCOVERS_DATA.find(v => v.isSpotlight);
    const otherVaycovers = MOCK_VAYCOVERS_DATA.filter(v => !v.isSpotlight);

    return (
        <div className="animate-fade-in space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 mb-4">
                    Snapp Squad Vaycovers
                </h1>
                <p className="text-lg text-cyan-300/80 max-w-3xl mx-auto">
                    Join a curated group trip with travelers who share your vibe. The more who join, the better the perks.
                </p>
            </div>

            {spotlightVaycover && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4 text-center">// Spotlight Vaycover</h2>
                    <VaycoverCard 
                        vaycover={spotlightVaycover} 
                        onSelect={onSelectVaycover}
                        userPersona={userPersona}
                    />
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">All Active Vaycovers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {otherVaycovers.map(vaycover => (
                        <VaycoverCard 
                            key={vaycover.id} 
                            vaycover={vaycover} 
                            onSelect={onSelectVaycover}
                            userPersona={userPersona}
                        />
                    ))}
                </div>
            </div>

             <div className="text-center pt-8">
                <button 
                    onClick={onReturnToCurator}
                    className="bg-black/50 hover:bg-cyan-900/50 text-cyan-400 font-bold py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 border border-cyan-700"
                >
                    Back to Personal Curation
                </button>
            </div>
        </div>
    );
};
