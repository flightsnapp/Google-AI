import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRestart: () => void;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[50vh] bg-black/70 backdrop-blur-sm rounded-lg border border-red-500/50">
        <ErrorIcon />
        <h1 className="text-3xl font-bold text-white mt-6">Error: Simulation Failed</h1>
        <p className="text-slate-300 text-lg mt-2 max-w-md">{message}</p>
        <button 
            onClick={onRestart}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 shadow-lg"
        >
            Re-run
        </button>
    </div>
  );
};