import React from 'react';
import type { Persona } from '../types';

interface PersonaCardProps {
  persona: Persona;
}

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

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,229,0.4)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">// Your Persona</h3>
          <h2 className="text-4xl font-extrabold text-white mb-2">{persona.name}</h2>
          <p className="text-lg font-light text-cyan-300 italic mb-4">"{persona.vibe}"</p>
          <div className="flex flex-wrap gap-2">
            {(persona.tags || []).map(tag => (
              <span key={tag} className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
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
          <div>
            <h4 className="font-semibold text-cyan-200 mb-2">Curator's Analysis</h4>
            <p className="text-cyan-400/80 text-sm leading-relaxed font-sans">{persona.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  );
};