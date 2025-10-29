import React from 'react';
import type { Persona, Vaycover } from '../types';

interface CompatibilityMatrixProps {
    userPersona: Persona;
    idealWeights: Vaycover['ideal_weights'];
}

const LABELS = ['Openness', 'Consc.', 'Extraversion', 'Agreeable.', 'Neuroticism'];
const TRAITS = ['O', 'C', 'E', 'A', 'N'] as const;

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({ userPersona, idealWeights }) => {
    const size = 200;
    const center = size / 2;
    const radius = size * 0.4;

    const getPoint = (value: number, index: number): { x: number; y: number } => {
        // Normalize value from [-1, 1] to [0, 1] for radius scaling
        const scaledValue = (value + 1) / 2;
        const angle = (Math.PI / 2) - (2 * Math.PI * index / TRAITS.length);
        const x = center + radius * scaledValue * Math.cos(angle);
        const y = center - radius * scaledValue * Math.sin(angle);
        return { x, y };
    };

    const userPoints = TRAITS.map((trait, i) => getPoint(userPersona.weights[trait], i));
    const idealPoints = TRAITS.map((trait, i) => getPoint(idealWeights[trait], i));

    const userPath = userPoints.map(p => `${p.x},${p.y}`).join(' ');
    const idealPath = idealPoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className="bg-black/50 border border-cyan-700/50 rounded-lg p-4">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
                {/* Radar grid lines */}
                {[0.25, 0.5, 0.75, 1].map(r => (
                    <circle
                        key={r}
                        cx={center}
                        cy={center}
                        r={radius * r}
                        fill="none"
                        stroke="rgba(0, 229, 229, 0.1)"
                        strokeWidth="0.5"
                    />
                ))}
                {/* Radar spokes */}
                {TRAITS.map((_, i) => {
                    const endPoint = getPoint(1, i); // Get point at max radius
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={endPoint.x}
                            y2={endPoint.y}
                            stroke="rgba(0, 229, 229, 0.1)"
                            strokeWidth="0.5"
                        />
                    );
                })}

                {/* Data polygons */}
                <polygon points={idealPath} fill="rgba(139, 92, 246, 0.4)" stroke="#8B5CF6" strokeWidth="1" />
                <polygon points={userPath} fill="rgba(0, 229, 229, 0.4)" stroke="#00E5E5" strokeWidth="1" />

                {/* Labels */}
                {LABELS.map((label, i) => {
                    const angle = (Math.PI / 2) - (2 * Math.PI * i / TRAITS.length);
                    const labelRadius = radius * 1.15;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center - labelRadius * Math.sin(angle);
                    return (
                        <text
                            key={label}
                            x={x}
                            y={y}
                            fontSize="8"
                            fill="#00E5E5"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>
            <div className="mt-4 flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-cyan-500/50 border border-cyan-500"></div>
                    <span>Your Vibe</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500/50 border border-purple-500"></div>
                    <span>Group's Ideal Vibe</span>
                </div>
            </div>
        </div>
    );
};
