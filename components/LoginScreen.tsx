import React from 'react';
import type { UserProfile } from '../types';

interface LoginScreenProps {
    onLogin: (profile: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {

    const handleMockLogin = () => {
        onLogin({
            name: 'Dev User',
            email: 'dev.user@flightsnapp.com',
            picture: `https://i.pravatar.cc/150?u=devuser`
        });
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-sm bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-cyan-500/30">
                <h2 className="text-3xl font-bold text-center text-cyan-300 mb-2">Connect to The Curator</h2>
                <p className="text-center text-cyan-400/80 mb-8">Sign in to begin your personalized journey.</p>
                
                <button
                    onClick={handleMockLogin}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]"
                >
                   Mock Sign In
                </button>

                <div className="text-center mt-4">
                    <p className="text-xs text-cyan-600">
                        (This is a mock sign-in for development purposes)
                    </p>
                </div>
            </div>
        </div>
    );
};
