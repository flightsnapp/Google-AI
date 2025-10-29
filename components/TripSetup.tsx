import React, { useState, useEffect } from 'react';
import type { TripSettings } from '../types';

interface TripSetupProps {
    onSetupComplete: (settings: TripSettings) => void;
    geolocationConsent: boolean;
}

const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const TripSetup: React.FC<TripSetupProps> = ({ onSetupComplete, geolocationConsent }) => {
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    const [departureCity, setDepartureCity] = useState('');
    const [budgetMin, setBudgetMin] = useState(800);
    const [budgetMax, setBudgetMax] = useState(1200);
    const [departureDate, setDepartureDate] = useState(getFormattedDate(today));
    const [travelers, setTravelers] = useState(2);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    
    const handleUseLocation = () => {
        setIsLocating(true);
        setLocationError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, you'd use a reverse geocoding service.
                // For this demo, we'll just use a placeholder.
                setDepartureCity('My Current Location');
                setIsLocating(false);
            },
            (error) => {
                setLocationError('Could not get location. Please enter manually.');
                setIsLocating(false);
                console.error("Geolocation error:", error);
            },
            { timeout: 10000 }
        );
    };
    
    useEffect(() => {
        if(geolocationConsent) {
            handleUseLocation();
        }
    }, [geolocationConsent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSetupComplete({
            departureCity,
            budgetMin,
            budgetMax,
            departureDate,
            travelers
        });
    };

    return (
        <div className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-10 border border-cyan-500/30">
            <h2 className="text-3xl font-bold text-center text-cyan-300 mb-2">Initialize Trip Parameters</h2>
            <p className="text-center text-cyan-400/80 mb-8">Configure your mission details.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="departureCity">
                        Departure City
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="departureCity"
                            type="text"
                            value={departureCity}
                            onChange={e => setDepartureCity(e.target.value)}
                            placeholder="e.g., Edmonton"
                            required
                            className="flex-grow bg-cyan-900/50 border border-cyan-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button type="button" onClick={handleUseLocation} disabled={isLocating} className="px-4 py-2 text-sm rounded-md text-black bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 font-bold transition-colors">
                            {isLocating ? 'Locating...' : 'Use My Location'}
                        </button>
                    </div>
                    {locationError && <p className="text-red-400 text-xs mt-1">{locationError}</p>}
                </div>

                <div>
                    <label className="block text-cyan-400 text-sm font-bold mb-2">
                        Budget Per Traveler (${budgetMin} - ${budgetMax})
                    </label>
                    <div className="flex items-center gap-4">
                        <input type="range" min="500" max="2000" value={budgetMin} onChange={e => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 100))} className="w-full"/>
                        <input type="range" min="500" max="2000" value={budgetMax} onChange={e => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 100))} className="w-full"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="departureDate">
                           Departure Date (within 1 week)
                        </label>
                        <input
                            id="departureDate"
                            type="date"
                            value={departureDate}
                            min={getFormattedDate(today)}
                            max={getFormattedDate(oneWeekFromNow)}
                            onChange={e => setDepartureDate(e.target.value)}
                            required
                            className="w-full bg-cyan-900/50 border border-cyan-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                     <div>
                        <label className="block text-cyan-400 text-sm font-bold mb-2" htmlFor="travelers">
                            Travelers
                        </label>
                        <input
                            id="travelers"
                            type="number"
                            min="1"
                            max="25"
                            value={travelers}
                            onChange={e => setTravelers(Number(e.target.value))}
                            required
                            className="w-full bg-cyan-900/50 border border-cyan-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                </div>
                
                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]">
                    Generate My Trip!
                </button>
            </form>
        </div>
    );
};