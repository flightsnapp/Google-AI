import React from 'react';

interface FooterProps {
    onTermsClick: () => void;
    onPrivacyClick: () => void;
    onSnappStarsClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTermsClick, onPrivacyClick, onSnappStarsClick }) => {
    return (
        <footer className="w-full text-center p-4 mt-8 border-t border-cyan-500/20">
            <div className="container mx-auto text-sm text-cyan-500">
                <p>&copy; {new Date().getFullYear()} FlightSnapp. All rights reserved.</p>
                <div className="mt-2 flex justify-center items-center flex-wrap">
                    <button onClick={onTermsClick} className="hover:text-cyan-300 transition-colors mx-2">Terms of Service</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={onPrivacyClick} className="hover:text-cyan-300 transition-colors mx-2">Privacy Policy</button>
                    <span className="hidden sm:inline">|</span>
                    <button onClick={onSnappStarsClick} className="hover:text-cyan-300 transition-colors mx-2">SnappStars Program</button>
                </div>
            </div>
        </footer>
    );
};
