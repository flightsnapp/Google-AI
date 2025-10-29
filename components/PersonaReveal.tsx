import React from 'react';
import type { Persona } from '../types';

const ChartBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const normalizedValue = (value + 1) * 50; // Convert [-1, 1] to [0, 100]
  return (
    <div className="flex items-center space-x-2">
      <span className="w-4 font-mono text-sm text-cyan-400">{label}</span>
      <div className="w-full bg-cyan-900/50 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2.5 rounded-full" 
          style={{ width: `${normalizedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

interface PersonaRevealProps {
    persona: Persona;
}

export const PersonaReveal: React.FC<PersonaRevealProps> = ({ persona }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cyan-400">Your Calibrated Travel Persona</h2>
                <p className="text-cyan-300/80 max-w-2xl mx-auto font-sans">
                    This is your unique travel DNA, the core of your curation experience.
                </p>
            </div>
            <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1">
                         <img src={persona.image_url} alt={persona.name} className="w-full h-64 md:h-full object-cover" />
                    </div>
                    <div className="md:col-span-2 p-6 md:p-8">
                        <h3 className="text-3xl font-extrabold text-white mb-2">{persona.name}</h3>
                        <p className="text-md font-light text-cyan-300 italic mb-4">"{persona.vibe}"</p>
                        <p className="text-sm text-cyan-400/80 mb-6 font-sans leading-relaxed h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent">{persona.description}</p>
                        
                        <div>
                            <h4 className="font-semibold text-cyan-200 mb-2">Personality Matrix (O.C.E.A.N)</h4>
                            <div className="space-y-2">
                                <ChartBar label="O" value={persona.weights.O} />
                                <ChartBar label="C" value={persona.weights.C} />
                                <ChartBar label="E" value={persona.weights.E} />
                                <ChartBar label="A" value={persona.weights.A} />
                                <ChartBar label="N" value={persona.weights.N} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};