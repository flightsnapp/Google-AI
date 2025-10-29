import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

const LoadingSpinner = () => (
  <div className="w-16 h-16 border-4 border-t-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"></div>
);

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
            <LoadingSpinner />
            <h1 className="text-3xl font-bold text-cyan-300 mt-8">Curation in Progress</h1>
            <p className="text-cyan-400/80 text-lg mt-2 transition-opacity duration-500">{LOADING_MESSAGES[messageIndex]}</p>
        </div>
    );
};