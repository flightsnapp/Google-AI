import React, { useState } from 'react';
import type { Vaycover, Persona } from '../types';
import { CompatibilityMatrix } from './CompatibilityMatrix';

interface VaycoverDetailPageProps {
    vaycover: Vaycover;
    userPersona: Persona | null;
    onReturnToHub: () => void;
}

const RewardTier: React.FC<{ tier: Vaycover['reward_tiers'][0] }> = ({ tier }) => (
    <div className={`p-4 rounded-md border transition-all duration-300 ${tier.unlocked ? 'bg-cyan-500/20 border-cyan-500' : 'bg-black/50 border-cyan-700/50'}`}>
        <p className={`font-bold ${tier.unlocked ? 'text-cyan-300' : 'text-white'}`}>{tier.reward}</p>
        <p className={`text-sm ${tier.unlocked ? 'text-cyan-400' : 'text-cyan-400/70'}`}>
            {tier.unlocked ? 'UNLOCKED' : `Unlocks at ${tier.member_count} members`}
        </p>
    </div>
);

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;

// A utility to calculate compatibility - duplicated from VaycoverCard for standalone use
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
    return Math.max(0, Math.min(100, Math.round((similarity + 1) * 50)));
};

export const VaycoverDetailPage: React.FC<VaycoverDetailPageProps> = ({ vaycover, userPersona, onReturnToHub }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const latestUnlockedReward = [...vaycover.reward_tiers].reverse().find(t => t.unlocked)?.reward;

    const handleShareToX = () => {
        let shareText = `Who's joining the '${vaycover.title}' Vaycover?`;
        if (userPersona) {
            const score = calculateCompatibility(userPersona.weights, vaycover.ideal_weights);
            shareText = `I'm a ${score}% match for the '${vaycover.title}' Vaycover!`;
        }
        if (latestUnlockedReward) {
            shareText += ` We've already unlocked: ${latestUnlockedReward}!`;
        }
        shareText += " #FlightSnapp #Vaycover";

        const url = 'https://flightsnapp.com/vaycovers/' + vaycover.id; // Placeholder URL
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = () => {
        const url = 'https://flightsnapp.com/vaycovers/' + vaycover.id; // Placeholder URL
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    return (
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <button onClick={onReturnToHub} className="text-cyan-400 hover:text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Vaycover Hub
                </button>

                <div className="relative rounded-lg overflow-hidden mb-8">
                    <img src={vaycover.hero_image} alt={vaycover.title} className="w-full h-64 md:h-80 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <p className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-1">{vaycover.destination}</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold">{vaycover.title}</h1>
                        <p className="text-lg text-cyan-300/90 mt-2">{vaycover.dates} &bull; {vaycover.price_range}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-4">The Vibe</h2>
                            <p className="text-cyan-300/80 font-sans leading-relaxed">{vaycover.description}</p>
                        </div>

                         <div>
                            <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-4">Itinerary</h2>
                            <div className="space-y-4">
                                {vaycover.itinerary.map(day => (
                                    <div key={day.day} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-900/50 border-2 border-cyan-700 flex items-center justify-center font-bold text-cyan-300">{day.day}</div>
                                            {day.day < vaycover.itinerary.length && <div className="w-px h-full bg-cyan-800"></div>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{day.title}</h4>
                                            <p className="text-sm text-cyan-400/80 font-sans">{day.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-4">Group Lodging</h2>
                            <p className="text-cyan-300/80 font-sans leading-relaxed">{vaycover.lodging_info}</p>
                        </div>

                    </div>
                    <div className="lg:col-span-1 space-y-8">
                         {userPersona && (
                             <div>
                                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Group Vibe Matrix</h2>
                                <CompatibilityMatrix userPersona={userPersona} idealWeights={vaycover.ideal_weights} />
                             </div>
                         )}

                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Squad Rewards</h2>
                            <div className="space-y-3">
                                {vaycover.reward_tiers.map(tier => <RewardTier key={tier.member_count} tier={tier} />)}
                            </div>
                        </div>

                        <div>
                             <h2 className="text-2xl font-bold text-cyan-400 mb-4">Share The Vibe</h2>
                             <div className="flex items-center justify-center gap-4">
                                <button onClick={handleShareToX} className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-colors px-3 py-2 rounded-md bg-black/50 border border-cyan-700 hover:border-cyan-500">
                                    <XIcon />
                                    Share to X
                                </button>
                                <button onClick={handleCopyLink} className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-colors px-3 py-2 rounded-md bg-black/50 border border-cyan-700 hover:border-cyan-500 w-32 justify-center">
                                    <LinkIcon />
                                    {isCopied ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>

                         <button className="w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg py-4 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,229,0.6)]">
                            Join This Vaycover!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
