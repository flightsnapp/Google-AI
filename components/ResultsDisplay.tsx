import React, { useState } from 'react';
import type { CuratorResponse, VacationPackage } from '../types';
import { PersonaCard } from './PersonaCard';
import { PackageCard } from './PackageCard';
import { SquadTiers } from './SquadTiers';
import { PackageDetailModal } from './PackageDetailModal';

interface ResultsDisplayProps {
  data: CuratorResponse;
  onRestart: () => void;
}

const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, onRestart }) => {
  const [selectedPackage, setSelectedPackage] = useState<VacationPackage | null>(null);

  const {
    persona_assignment,
    curated_packages = [],
    snapp_squad_tiers = [],
    shareables_per_package = [],
  } = data;

  const handlePrev = () => {
    // This logic is for a carousel that is not implemented in the desktop view
  };

  const handleNext = () => {
    // This logic is for a carousel that is not implemented in the desktop view
  };

  return (
    <>
      <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-8 space-y-12 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 mb-4">
            Curation Complete: Your Profile
          </h1>
          <p className="text-lg text-cyan-300/80 max-w-3xl mx-auto">
            Analysis of your persona is complete. We have identified these optimal travel packages.
          </p>
        </div>

        {persona_assignment && <PersonaCard persona={persona_assignment} />}

        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">Curated Vacation Packages</h2>
          <div className="relative max-w-md mx-auto lg:max-w-none">
            {curated_packages.length > 1 && (
                <button onClick={handlePrev} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-cyan-900/50 border border-cyan-700 text-cyan-300 hidden lg:block">
                    <ChevronLeft />
                </button>
            )}
            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                 {curated_packages.map((pkg, index) => (
                    <div key={index} className="flex-shrink-0 w-full snap-center px-2">
                         <PackageCard 
                            packageData={pkg} 
                            shareable={shareables_per_package[index]} 
                            onExplore={() => setSelectedPackage(pkg)}
                        />
                    </div>
                ))}
            </div>
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {curated_packages.map((pkg, index) => (
                    <PackageCard 
                        key={index} 
                        packageData={pkg} 
                        shareable={shareables_per_package[index]} 
                        onExplore={() => setSelectedPackage(pkg)}
                    />
                ))}
            </div>
             {curated_packages.length > 1 && (
                <button onClick={handleNext} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-cyan-900/50 border border-cyan-700 text-cyan-300 hidden lg:block">
                    <ChevronRight />
                </button>
            )}
          </div>
        </div>

        {snapp_squad_tiers.length > 0 && <SquadTiers tiers={snapp_squad_tiers} />}
        
        <div className="text-center pt-8">
          <button 
              onClick={onRestart}
              className="bg-black/50 hover:bg-cyan-900/50 text-cyan-400 font-bold py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 border border-cyan-700"
          >
              Restart Simulation
          </button>
        </div>
      </div>
      {selectedPackage && (
        <PackageDetailModal 
            packageData={selectedPackage} 
            onClose={() => setSelectedPackage(null)} 
        />
      )}
    </>
  );
};