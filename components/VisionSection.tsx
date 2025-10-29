import React from 'react';
import { VISION_CONTENT } from '../constants';
import type { Persona } from '../types';

interface VisionSectionProps {
    onProceed: () => void;
    onExploreVaycovers: () => void;
    userPersona: Persona | null;
}

export const VisionSection: React.FC<VisionSectionProps> = ({ onProceed, onExploreVaycovers, userPersona }) => {
    return (
        <div className="text-center py-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 mb-4">
                {userPersona ? `Welcome, ${userPersona.name}` : VISION_CONTENT.title}
            </h1>
            <p className="text-lg md:text-xl text-cyan-300/80 max-w-3xl mx-auto mb-10 font-sans">
                {userPersona ? `Your travel persona has been calibrated. Now, choose your path.` : VISION_CONTENT.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={onProceed}
                    className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(0,229,229,0.6)]"
                >
                    Personalized Curation
                </button>
                 <button
                    onClick={onExploreVaycovers}
                    className="w-full sm:w-auto bg-black/50 hover:bg-cyan-900/50 text-cyan-400 font-bold text-lg py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 border border-cyan-700"
                >
                    Explore Vaycovers
                </button>
            </div>
        </div>
    );
};