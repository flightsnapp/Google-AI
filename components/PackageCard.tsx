import React, { useState } from 'react';
import type { VacationPackage, Shareable } from '../types';

interface PackageCardProps {
  packageData: VacationPackage;
  shareable: Shareable;
  onExplore: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactElement, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 text-sm">
        <div className="text-cyan-400 mt-0.5">{icon}</div>
        <div>
            <p className="font-semibold text-cyan-300">{label}</p>
            <p className="text-cyan-400/80">{value}</p>
        </div>
    </div>
);

const PlaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;


export const PackageCard: React.FC<PackageCardProps> = ({ packageData, shareable, onExplore }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareToX = () => {
    const tweetText = encodeURIComponent(`${shareable.short_blurb} ${shareable.share_cta_x}`);
    const url = encodeURIComponent(packageData.booking_link);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(packageData.booking_link).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,229,229,0.5)]">
      <img src={packageData.image_url} alt={packageData.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-white mb-2">{packageData.name}</h3>
        <p className="text-sm text-cyan-400/80 mb-4 font-sans h-10 overflow-hidden">{packageData.fit_notes}</p>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
            <InfoRow icon={<BuildingIcon/>} label="Lodging" value={`${packageData.lodging.name} (${packageData.lodging.nights} nights)`} />
            <InfoRow icon={<StarIcon/>} label="Key Activity" value={packageData.activity} />
        </div>

        <div className="mb-6 flex items-center justify-center gap-4">
            <button onClick={handleShareToX} className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-colors px-3 py-1 rounded-md bg-black/50 border border-cyan-700 hover:border-cyan-500">
                <XIcon />
                Share
            </button>
            <button onClick={handleCopyLink} className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100 transition-colors px-3 py-1 rounded-md bg-black/50 border border-cyan-700 hover:border-cyan-500 w-28 justify-center">
                <LinkIcon />
                {isCopied ? 'Copied!' : 'Copy Link'}
            </button>
        </div>

        <div className="mt-auto pt-6 border-t border-cyan-800">
             <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-2xl font-extrabold text-white">${packageData.price_per_traveler.toLocaleString()}</p>
                    <p className="text-sm text-cyan-400">per traveler</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-300">Total: ${packageData.total_price.toLocaleString()}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${packageData.availability === 'High' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{packageData.availability} Availability</span>
                </div>
            </div>
            <button onClick={onExplore} className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]">
                Explore
            </button>
        </div>
      </div>
    </div>
  );
};