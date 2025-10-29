import React from 'react';
import { SNAPPSTARS_TERMS_CONTENT } from '../constants';

interface ModalProps {
    onClose: () => void;
}

export const SnappStarsModal: React.FC<ModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-black/80 border border-cyan-500/50 rounded-lg shadow-2xl p-8 max-w-3xl w-full m-4 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0">
                    <h2 className="text-3xl font-bold text-cyan-300 mb-4">SnappStars Program</h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-4"></div>
                </div>
                <div className="overflow-y-auto pr-4 text-cyan-400/80 font-sans scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent">
                     <div dangerouslySetInnerHTML={{ __html: SNAPPSTARS_TERMS_CONTENT }} />
                </div>
                <div className="flex justify-end mt-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-md bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,229,229,0.5)]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
