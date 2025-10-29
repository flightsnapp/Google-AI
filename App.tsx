import React, { useState, useCallback, useMemo } from 'react';
import { Quiz } from './components/Quiz';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchCuratorResponse } from './services/geminiService';
import type { CuratorResponse, TripSettings, UserProfile, Persona, Vaycover, QuizData } from './types';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import { MatrixBackground } from './components/MatrixBackground';
import { VisionSection } from './components/VisionSection';
import { Footer } from './components/Footer';
import { TermsModal } from './components/TermsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { LoginScreen } from './components/LoginScreen';
import { TripSetup } from './components/TripSetup';
import { SnappStarsModal } from './components/SnappStarsModal';
import { VaycoverHub } from './components/VaycoverHub';
import { VaycoverDetailPage } from './components/VaycoverDetailPage';
import { OnboardingModal } from './components/OnboardingModal';
import { UserProfile as UserProfilePage } from './components/UserProfile';
import { PERSONA_DATA } from './constants';
import { PersonaReveal } from './components/PersonaReveal';

type AppStage = 'login' | 'onboarding' | 'quiz' | 'welcome' | 'tripSetup' | 'loading' | 'results' | 'error' | 'vaycoverHub' | 'vaycoverDetail' | 'userProfile';
type AppMode = 'curator' | 'vaycover';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('login');
  const [appMode, setAppMode] = useState<AppMode>('curator');
  const [results, setResults] = useState<CuratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isSnappStarsModalOpen, setIsSnappStarsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [consents, setConsents] = useState<{ aiData: boolean, geolocation: boolean } | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userPersona, setUserPersona] = useState<Persona | null>(null);
  const [selectedVaycover, setSelectedVaycover] = useState<Vaycover | null>(null);

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setStage('onboarding');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setResults(null);
    setError(null);
    setUserPersona(null);
    setSelectedVaycover(null);
    setQuizData(null);
    setConsents(null);
    setStage('login');
  };
  
  const handleOnboardingComplete = (userConsents: { aiData: boolean, geolocation: boolean }) => {
    setConsents(userConsents);
    setStage('quiz');
  };
  
  const handleQuizComplete = useCallback((completedQuizData: QuizData) => {
      setQuizData(completedQuizData);
      const personaDetails = PERSONA_DATA.find(p => p.name === completedQuizData.assignedPersonaName);
      if(personaDetails) {
        const tempPersona = { ...personaDetails, dot_score: 0, reasoning: 'Your unique traits point towards this persona. A detailed analysis will be provided with your curated results.' };
        setUserPersona(tempPersona);
      }
      setStage('welcome');
  }, []);

  const handleProceedToTripSetup = () => {
    setAppMode('curator');
    setStage('tripSetup');
  };

  const handleExploreVaycovers = () => {
    setAppMode('vaycover');
    setStage('vaycoverHub');
  };
  
  const handleNavigateToProfile = () => {
    setStage('userProfile');
  };

  const handleSelectVaycover = (vaycover: Vaycover) => {
    setSelectedVaycover(vaycover);
    setStage('vaycoverDetail');
  };

  const handleTripSetupComplete = useCallback(async (settings: TripSettings) => {
    if (!quizData) {
      setError("Quiz data is missing. Please restart.");
      setStage('error');
      return;
    }
    
    setStage('loading');
    setError(null);

    try {
      const response = await fetchCuratorResponse({
        departure_city: settings.departureCity,
        earliest_departure: settings.departureDate,
        flex_days: 2,
        budget_min: settings.budgetMin,
        budget_max: settings.budgetMax,
        travelers: settings.travelers,
        group_interest: settings.travelers > 1,
        initial_group_size: settings.travelers,
        quiz_answers: quizData.quizAnswers,
        followup_answers: quizData.followupAnswers,
        selected_modifiers: quizData.selectedModifiers,
        assigned_persona_name: quizData.assignedPersonaName,
      });

      setResults(response);
      setUserPersona(response.persona_assignment);
      setStage('results');
    } catch (err) {
      console.error("Failed to fetch curator response:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
      setStage('error');
    }
  }, [quizData]);

  const handleRestart = useCallback(() => {
    setStage('welcome');
    setResults(null);
    setError(null);
  }, []);
  
  const handleFullRestart = useCallback(() => {
    setStage(userProfile ? 'welcome' : 'login');
    setResults(null);
    setError(null);
  }, [userProfile]);


  const currentView = useMemo(() => {
    switch (stage) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'onboarding':
        return <OnboardingModal 
                  onComplete={handleOnboardingComplete}
                  onViewTerms={() => setIsTermsModalOpen(true)}
                  onViewPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
               />
      case 'quiz':
        return <Quiz onQuizComplete={handleQuizComplete} />;
      case 'welcome':
        return (
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-8 space-y-16 animate-fade-in">
            <VisionSection onProceed={handleProceedToTripSetup} onExploreVaycovers={handleExploreVaycovers} userPersona={userPersona} />
            {userPersona && <PersonaReveal persona={userPersona} />}
          </div>
        );
      case 'userProfile':
        return (userProfile && userPersona) ? (
          <UserProfilePage 
            userProfile={userProfile} 
            persona={userPersona} 
            onReturnToHub={() => setStage('welcome')}
          />
        ) : <ErrorDisplay message="User profile or persona not found." onRestart={handleFullRestart} />;
      case 'tripSetup':
        return <TripSetup onSetupComplete={handleTripSetupComplete} geolocationConsent={consents?.geolocation ?? false} />;
      case 'vaycoverHub':
        return (
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-8 animate-fade-in">
            <VaycoverHub 
              onReturnToCurator={() => setStage('welcome')} 
              onSelectVaycover={handleSelectVaycover}
              userPersona={userPersona}
            />
          </div>
        );
      case 'vaycoverDetail':
        return selectedVaycover ? (
          <VaycoverDetailPage
            vaycover={selectedVaycover}
            userPersona={userPersona}
            onReturnToHub={() => setStage('vaycoverHub')}
          />
        ) : <ErrorDisplay message="No Vaycover selected." onRestart={() => setStage('vaycoverHub')} />;
      case 'loading':
        return (
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 animate-fade-in">
            <LoadingScreen />
          </div>
        );
      case 'results':
        return results ? <ResultsDisplay data={results} onRestart={handleRestart} /> : <ErrorDisplay message="No results found." onRestart={handleRestart} />;
      case 'error':
        return <ErrorDisplay message={error || "An unexpected error occurred."} onRestart={handleFullRestart} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  }, [stage, results, error, userPersona, selectedVaycover, consents, userProfile, handleQuizComplete, handleRestart, handleFullRestart, handleTripSetupComplete]);

  return (
    <div className="min-h-screen text-cyan-300 font-tech">
      <MatrixBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header userProfile={userProfile} onLogout={handleLogout} onNavigateToProfile={handleNavigateToProfile} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          {currentView}
        </main>
        {userProfile && stage !== 'login' && stage !== 'onboarding' && stage !== 'quiz' && (
          <Footer 
            onTermsClick={() => setIsTermsModalOpen(true)}
            onPrivacyClick={() => setIsPrivacyPolicyModalOpen(true)}
            onSnappStarsClick={() => setIsSnappStarsModalOpen(true)}
          />
        )}
      </div>

      {isTermsModalOpen && (
        <TermsModal onClose={() => setIsTermsModalOpen(false)} />
      )}
      {isPrivacyPolicyModalOpen && (
        <PrivacyPolicyModal onClose={() => setIsPrivacyPolicyModalOpen(false)} />
      )}
      {isSnappStarsModalOpen && (
        <SnappStarsModal onClose={() => setIsSnappStarsModalOpen(false)} />
      )}
    </div>
  );
};

export default App;