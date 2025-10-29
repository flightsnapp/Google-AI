import React from 'react';
import type { Vaycover, Persona } from '../types';

interface VaycoverCardProps {
    vaycover: Vaycover;
    userPersona: Persona | null;
    onSelect: (vaycover: Vaycover) => void;
}

const ProgressBar: React.FC<{ progress: number; goal: number }> = ({ progress, goal }) => {
    const percentage = (progress / goal) * 100;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-cyan-300">{progress} Joined</span>
                <span className="text-cyan-400/80">{goal} Goal</span>
            </div>
            <div className="w-full bg-cyan-900/50 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const calculateCompatibility = (userWeights: Persona['weights'], idealWeights: Vaycover['ideal_weights']): number => {
    const traits = ['O', 'C', 'E', 'A', 'N'] as const;
    let dotProduct = 0;
    let userMagnitude = 0;
    let idealMagnitude = 0;

    for (const trait of traits) {
        dotProduct += userWeights[trait] * idealWeights[trait];
        userMagnitude += userWeights[trait] ** 2;
        idealMagnitude += idealWeights[trait] ** 2;
    }
    
    userMagnitude = Math.sqrt(userMagnitude);
    idealMagnitude = Math.sqrt(idealMagnitude);

    if (userMagnitude === 0 || idealMagnitude === 0) return 0;
    
    const similarity = dotProduct / (userMagnitude * idealMagnitude);
    // Scale similarity from [-1, 1] to a more intuitive [0, 100] percentage
    // We'll treat anything below 0 as a poor match (0%), and scale the positive range [0, 1] to [50, 100]
    // A simple linear scale from [-1, 1] to [0, 100] is (similarity + 1) * 50
    return Math.max(0, Math.min(100, Math.round((similarity + 1) * 50)));
};


export const VaycoverCard: React.FC<VaycoverCardProps> = ({ vaycover, userPersona, onSelect }) => {
    const cardClasses = vaycover.isSpotlight
        ? 'border-cyan-400 shadow-[0_0_25px_rgba(0,229,229,0.5)]'
        : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,229,229,0.5)]';

    const compatibilityScore = userPersona ? calculateCompatibility(userPersona.weights, vaycover.ideal_weights) : null;

    return (
        <div className={`bg-black/80 backdrop-blur-md border rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 ${cardClasses}`}>
            <div className="relative">
                <img src={vaycover.hero_image} alt={vaycover.title} className="w-full h-48 object-cover" />
                {vaycover.isSpotlight && (
                     <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-br-lg">
                        Spotlight
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-1">{vaycover.destination}</p>
                <h3 className="text-2xl font-bold text-white mb-2">{vaycover.title}</h3>
                <p className="text-sm text-cyan-400/80 mb-4 font-sans">{vaycover.dates} &bull; {vaycover.price_range}</p>
                
                <div className="mb-4">
                    <p className="text-xs font-semibold text-cyan-300 mb-2">Ideal Vibe For:</p>
                    <div className="flex flex-wrap gap-2">
                        {vaycover.dominant_personas.map(persona => (
                            <span key={persona} className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">{persona}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-black/50 border border-cyan-700/50 rounded-md p-3 text-center mb-6">
                    <p className="text-cyan-300 text-sm font-bold">Your Compatibility Score:</p>
                    {compatibilityScore !== null ? (
                         <p className="text-2xl font-bold text-cyan-400">{compatibilityScore}% Match</p>
                    ) : (
                        <p className="text-cyan-500 text-xs italic">Take the quiz to find your match!</p>
                    )}
                </div>
                
                <div className="mt-auto space-y-4">
                    <ProgressBar progress={vaycover.squad_progress} goal={vaycover.squad_goal} />
                    <button 
                        onClick={() => onSelect(vaycover)}
                        className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]"
                    >
                        Explore Vaycover
                    </button>
                </div>
            </div>
        </div>
    );
};
