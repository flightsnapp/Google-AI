import React from 'react';
import type { VacationPackage } from '../types';

interface PackageDetailModalProps {
    packageData: VacationPackage;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string, value: string | number, className?: string }> = ({ label, value, className = '' }) => (
    <div className={`py-2 ${className}`}>
        <p className="text-sm text-cyan-400">{label}</p>
        <p className="font-bold text-white">{value}</p>
    </div>
);

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ packageData, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-black/80 border border-cyan-500/50 rounded-lg shadow-2xl max-w-2xl w-full m-4 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <img src={packageData.image_url} alt={packageData.name} className="w-full h-64 object-cover rounded-t-lg" />
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent">
                    <h2 className="text-3xl font-extrabold text-white mb-2">{packageData.name}</h2>
                    <p className="text-cyan-300/80 mb-6 font-sans">{packageData.fit_notes}</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-2">Flight Details</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4">
                                <DetailRow label="Airline" value={packageData.flight.airline} />
                                <DetailRow label="Flight No." value={packageData.flight.flight_number} />
                                <DetailRow label="Duration" value={packageData.flight.duration} />
                                <DetailRow label="Departure" value={`${packageData.flight.departure_airport} @ ${packageData.flight.departure_time}`} />
                                <DetailRow label="Arrival" value={`${packageData.flight.arrival_airport} @ ${packageData.flight.arrival_time}`} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-2">Lodging Details</h3>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4">
                                <DetailRow label="Name" value={packageData.lodging.name} />
                                <DetailRow label="Type" value={packageData.lodging.type} />
                                <DetailRow label="Rating" value={`${packageData.lodging.rating} / 5`} />
                                <DetailRow label="Nights" value={packageData.lodging.nights} />
                                <DetailRow label="Price/Night" value={`$${packageData.lodging.price_per_night}`} />
                             </div>
                        </div>
                        
                         <div>
                            <h3 className="text-xl font-bold text-cyan-400 border-b border-cyan-800 pb-2 mb-2">Featured Activity</h3>
                            <p className="text-white font-bold">{packageData.activity}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-cyan-800 flex-shrink-0 bg-black/50 rounded-b-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-3xl font-extrabold text-white">${packageData.price_per_traveler.toLocaleString()}</p>
                            <p className="text-sm text-cyan-400">per traveler</p>
                        </div>
                        <div className="text-right">
                            <p className="text-md font-semibold text-cyan-300">Total: ${packageData.total_price.toLocaleString()}</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${packageData.availability === 'High' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{packageData.availability} Availability</span>
                        </div>
                    </div>
                     <a href={packageData.booking_link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]">
                        Engage & Book
                    </a>
                </div>
            </div>
        </div>
    );
};
