import React, { useState } from 'react';

interface OnboardingModalProps {
  onComplete: (consents: { aiData: boolean; geolocation: boolean }) => void;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onViewTerms, onViewPrivacy }) => {
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [aiConsent, setAiConsent] = useState(true); // Default to opt-in
  const [geoConsent, setGeoConsent] = useState(true); // Default to opt-in

  const handleSubmit = () => {
    if (termsAgreed) {
      onComplete({
        aiData: aiConsent,
        geolocation: geoConsent,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-2xl p-8 max-w-2xl w-full m-4 animate-fade-in">
            <h2 className="text-3xl font-bold text-cyan-300 mb-4">Welcome to FlightSnapp!</h2>
            <p className="text-cyan-300/80 mb-6 font-sans">We're thrilled to curate your dream YOLO escape—let's spin some personalized travel magic! First, a few things to get started.</p>

            <div className="space-y-4 text-sm font-sans text-cyan-400/90 mb-6">
                <p><strong>Purpose:</strong> Your Big 5 quiz responses power our hybrid AI curator to deliver hyper-personalized, one-of-a-kind recommendations tailored to your personality.</p>
                <p><strong>Privacy:</strong> We prioritize your data like a 5-star vault—responses are anonymized, encrypted, and stored securely.</p>
                <p><strong>Disclaimer:</strong> Our snaps are joyful suggestions only—FlightSnapp isn't responsible for trip outcomes or bookings. Always verify details with partners.</p>
            </div>
            
            <div className="space-y-4 mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={() => setTermsAgreed(!termsAgreed)}
                        className="mt-1 form-checkbox h-5 w-5 text-cyan-500 bg-cyan-900/50 border-cyan-700 rounded focus:ring-cyan-500"
                    />
                    <div>
                        <span className="text-white">I agree to the <button onClick={onViewTerms} className="underline text-cyan-400 hover:text-cyan-200">Terms of Service</button> and <button onClick={onViewPrivacy} className="underline text-cyan-400 hover:text-cyan-200">Privacy Policy</button> (required).</span>
                    </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={aiConsent}
                        onChange={() => setAiConsent(!aiConsent)}
                        className="mt-1 form-checkbox h-5 w-5 text-cyan-500 bg-cyan-900/50 border-cyan-700 rounded focus:ring-cyan-500"
                    />
                    <div>
                        <span className="text-white">I consent to my anonymized data being used to refine FlightSnapp's AI (optional).</span>
                        <p className="text-xs text-cyan-500">This helps us keep the vibes fresh for everyone!</p>
                    </div>
                </label>
            </div>

            <div className="p-4 border border-cyan-700/50 rounded-lg bg-black/30">
                 <h3 className="font-bold text-white mb-2">Location Consent</h3>
                 <p className="text-xs text-cyan-400/80 mb-3">Want spot-on recommendations? Grant us location access for precise, real-time curation!</p>
                 <div className="flex gap-4">
                    <button onClick={() => setGeoConsent(true)} className={`flex-1 text-sm py-2 px-4 rounded-md border transition-colors ${geoConsent ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black/50 border-cyan-700 text-cyan-300'}`}>
                        Yes, precise vibes!
                    </button>
                    <button onClick={() => setGeoConsent(false)} className={`flex-1 text-sm py-2 px-4 rounded-md border transition-colors ${!geoConsent ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black/50 border-cyan-700 text-cyan-300'}`}>
                        No thanks, keep it global.
                    </button>
                 </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={!termsAgreed}
                    className="px-8 py-3 rounded-md bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,229,229,0.5)] disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Continue to Quiz
                </button>
            </div>
        </div>
    </div>
  );
};