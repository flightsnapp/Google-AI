import React, { useState, useEffect, useRef } from 'react';
import type { QuizAnswers, FollowupAnswers, Persona, QuizData } from '../types';
import { CORE_QUESTIONS, TEASERS, PERSONA_FOLLOWUP_QUESTIONS, MODIFIERS, PERSONA_DATA } from '../constants';

interface QuizProps {
  onQuizComplete: (quizData: QuizData) => void;
}

type QuizStage = 'core' | 'followup' | 'modifiers';

const Slider = ({ onChange, value }: { onChange: (value: number) => void, value: number }) => (
    <div className="flex justify-center items-center space-x-4 my-4">
      <span className="text-sm text-cyan-400/70 w-16 text-right">Disagree</span>
      <div className="relative w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="absolute top-4 left-0 w-full flex justify-between text-xs text-cyan-600">
              <span>|</span>
              <span>|</span>
              <span>|</span>
          </div>
      </div>
      <span className="text-sm text-cyan-400/70 w-16 text-left">Agree</span>
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #00E5E5;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 229, 229, 0.7);
        }
        .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #00E5E5;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(0, 229, 229, 0.7);
        }
      `}</style>
    </div>
);

const getScoreCategory = (value: number): '1-2' | '3' | '4-5' => {
    const score1to5 = 1 + Math.floor(value / 20.1);
    if (score1to5 <= 2) return '1-2';
    if (score1to5 === 3) return '3';
    return '4-5';
};

const calculateTopPersona = (answers: QuizAnswers): Persona => {
    const traitScores: { [key in 'O' | 'C' | 'E' | 'A' | 'N']: number[] } = { O: [], C: [], E: [], A: [], N: [] };
  
    CORE_QUESTIONS.forEach((q, index) => {
      let score = answers[index];
      if (q.direction === 'reverse') {
        score = 100 - score;
      }
      traitScores[q.trait].push(score);
    });

    const avgScores = {
      O: traitScores.O.reduce((a, b) => a + b, 0) / traitScores.O.length,
      C: traitScores.C.reduce((a, b) => a + b, 0) / traitScores.C.length,
      E: traitScores.E.reduce((a, b) => a + b, 0) / traitScores.E.length,
      A: traitScores.A.reduce((a, b) => a + b, 0) / traitScores.A.length,
      N: traitScores.N.reduce((a, b) => a + b, 0) / traitScores.N.length,
    };
    
    const normScores = {
      O: (avgScores.O - 50) / 50,
      C: (avgScores.C - 50) / 50,
      E: (avgScores.E - 50) / 50,
      A: (avgScores.A - 50) / 50,
      N: (avgScores.N - 50) / 50,
    };

    let topPersona: Persona = PERSONA_DATA[0] as Persona;
    let maxDotScore = -Infinity;

    PERSONA_DATA.forEach(persona => {
      const dotScore = 
          normScores.O * persona.weights.O +
          normScores.C * persona.weights.C +
          normScores.E * persona.weights.E +
          normScores.A * persona.weights.A +
          normScores.N * persona.weights.N;
      
      if (dotScore > maxDotScore) {
        maxDotScore = dotScore;
        topPersona = { ...persona, dot_score: dotScore, reasoning: '' };
      }
    });

    return topPersona;
};

export const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => {
  const [stage, setStage] = useState<QuizStage>('core');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFollowupIndex, setCurrentFollowupIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(Array(CORE_QUESTIONS.length).fill(50));
  const [followupAnswers, setFollowupAnswers] = useState<FollowupAnswers>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [topPersona, setTopPersona] = useState<Persona | null>(null);
  const [inlineFeedback, setInlineFeedback] = useState('');
  const [teaserMessage, setTeaserMessage] = useState('');

  const advanceTimeoutRef = useRef<number | null>(null);

  const clearAdvanceTimeout = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearAdvanceTimeout();
  }, []);

  const advanceCoreQuiz = () => {
    setInlineFeedback('');
    const nextIndex = currentQuestionIndex + 1;
    
    const teaserFunc = TEASERS[nextIndex as keyof typeof TEASERS];
    if (teaserFunc) {
      const traitScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      
      CORE_QUESTIONS.slice(0, nextIndex).forEach((q, i) => {
          let score = answers[i];
          if (q.direction === 'reverse') score = 100 - score;
          traitScores[q.trait] += score / 20; // scale to 0-5
          counts[q.trait]++;
      });
      
      const avgScores = {
          O: counts.O > 0 ? (traitScores.O / counts.O) * 2 : 0, // scale to 0-10
          C: counts.C > 0 ? (traitScores.C / counts.C) * 2 : 0,
          E: counts.E > 0 ? (traitScores.E / counts.E) * 2 : 0
      };

      setTeaserMessage(teaserFunc(avgScores as any));
    }

    if (nextIndex < CORE_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setTimeout(() => { // Add a small delay for better UX before calculating
        const persona = calculateTopPersona(answers);
        setTopPersona(persona);
        setFollowupAnswers(Array(PERSONA_FOLLOWUP_QUESTIONS[persona.name].length).fill(50));
        setStage('followup');
      }, 500);
    }
  };

  const handleCoreSliderChange = (value: number) => {
    clearAdvanceTimeout();
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
    
    const question = CORE_QUESTIONS[currentQuestionIndex];
    let score = value;
    if (question.direction === 'reverse') score = 100 - score;
    const category = getScoreCategory(score);
    setInlineFeedback(question.feedback[category]);

    advanceTimeoutRef.current = window.setTimeout(advanceCoreQuiz, 1500);
  };
  
  const advanceFollowupQuiz = () => {
      const nextFollowupIndex = currentFollowupIndex + 1;
      if (topPersona && nextFollowupIndex < PERSONA_FOLLOWUP_QUESTIONS[topPersona.name].length) {
          setCurrentFollowupIndex(nextFollowupIndex);
      } else {
          setStage('modifiers');
      }
  };

  const handleFollowupSliderChange = (value: number) => {
      clearAdvanceTimeout();
      const newFollowupAnswers = [...followupAnswers];
      newFollowupAnswers[currentFollowupIndex] = value;
      setFollowupAnswers(newFollowupAnswers);
      
      advanceTimeoutRef.current = window.setTimeout(advanceFollowupQuiz, 1500);
  };
  
  const handleModifierToggle = (modifier: string) => {
      setSelectedModifiers(prev => 
          prev.includes(modifier) ? prev.filter(m => m !== modifier) : [...prev, modifier]
      );
  };
  
  const submitQuiz = () => {
    if (!topPersona) return; // Should not happen

    const finalModifiers = [...selectedModifiers];
    const personaFollowups = PERSONA_FOLLOWUP_QUESTIONS[topPersona.name];
    followupAnswers.forEach((answer, index) => {
        const score1to5 = 1 + Math.floor(answer / 20.1);
        if (score1to5 !== 3) {
            const tag = personaFollowups[index].tag;
            if (!finalModifiers.includes(tag)) {
                finalModifiers.push(tag);
            }
        }
    });
    
    const quizData: QuizData = {
        quizAnswers: answers,
        followupAnswers: followupAnswers,
        selectedModifiers: finalModifiers,
        assignedPersonaName: topPersona.name
    };

    onQuizComplete(quizData);
  };

  const renderContent = () => {
    // Clear teaser message after it has been displayed once
    if (teaserMessage) {
        setTimeout(() => setTeaserMessage(''), 3000); 
    }

    switch(stage) {
      case 'core':
        const question = CORE_QUESTIONS[currentQuestionIndex];
        return (
          <div key={currentQuestionIndex} className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 animate-fade-in">
            {teaserMessage && (
                <div className="text-center mb-6 p-3 bg-cyan-900/50 border border-cyan-700 rounded-md">
                    <h3 className="text-sm font-bold text-cyan-300 mb-1 uppercase tracking-widest">Interim Analysis...</h3>
                    <p className="text-md text-white italic">"{teaserMessage}"</p>
                </div>
            )}
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">// Question {currentQuestionIndex + 1} / {CORE_QUESTIONS.length}</p>
            <p className="text-2xl text-white mb-6 min-h-[6rem]">"{question.text}"</p>
            <Slider onChange={handleCoreSliderChange} value={answers[currentQuestionIndex]} />
            <div className="min-h-[2rem] text-center mt-4">
                {inlineFeedback && <p className="text-cyan-300 italic animate-fade-in">_ {inlineFeedback}</p>}
            </div>
             <div className="w-full bg-cyan-900/50 rounded-full h-1 mt-6">
                <div className="bg-cyan-400 h-1 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / CORE_QUESTIONS.length) * 100}%` }}></div>
            </div>
          </div>
        );

      case 'followup':
          if (!topPersona) return <p>Calculating...</p>;
          const personaFollowups = PERSONA_FOLLOWUP_QUESTIONS[topPersona.name];
          const followupQuestion = personaFollowups[currentFollowupIndex];
          return (
              <div key={`followup-${currentFollowupIndex}`} className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">A question for The {topPersona.name}...</h3>
                  <p className="text-cyan-400/80 mb-6 text-sm">// Follow-up {currentFollowupIndex + 1} / {personaFollowups.length}</p>
                  
                  <div className="mb-6">
                      <p className="text-2xl text-white mb-2 min-h-[4rem]">"{followupQuestion.text}"</p>
                      <Slider onChange={handleFollowupSliderChange} value={followupAnswers[currentFollowupIndex]} />
                  </div>
                 <div className="w-full bg-cyan-900/50 rounded-full h-1 mt-6">
                    <div className="bg-cyan-400 h-1 rounded-full" style={{ width: `${((currentFollowupIndex + 1) / personaFollowups.length) * 100}%` }}></div>
                </div>
              </div>
          );

      case 'modifiers':
          return (
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8 animate-fade-in">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-2">Finalize Your Profile</h3>
                  <p className="text-cyan-400/80 mb-6">Add any of these vibe modifiers to help us narrow down the perfect trip.</p>
                  <div className="flex flex-wrap gap-3">
                      {MODIFIERS.map(modifier => (
                          <button
                              key={modifier}
                              onClick={() => handleModifierToggle(modifier)}
                              className={`px-4 py-2 text-sm rounded-md font-semibold transition-all duration-200 border ${selectedModifiers.includes(modifier) ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(0,229,229,0.5)]' : 'bg-black/50 text-cyan-300 border-cyan-700 hover:bg-cyan-900/50 hover:border-cyan-500'}`}
                          >
                              {modifier}
                          </button>
                      ))}
                  </div>
                  <div className="flex justify-between mt-8">
                      <button onClick={() => setStage('followup')} className="bg-black/50 hover:bg-cyan-900/50 text-cyan-400 font-bold py-2 px-6 rounded-md transition duration-300 border border-cyan-700">Back</button>
                      <button onClick={submitQuiz} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-md transition duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(0,229,229,0.5)]">Complete Profile</button>
                  </div>
              </div>
          );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {renderContent()}
    </div>
  );
};