import React, { useState, useRef, useEffect } from 'react';
import { Wind, Eye, Activity, Sparkles, Gamepad2, ChevronUp, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { GroundingExerciseType } from '../../types';

interface ExerciseOption {
  id: GroundingExerciseType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  gradient: string;
  borderGlow: string;
}

const exercises: ExerciseOption[] = [
  {
    id: 'breathing_478',
    title: '4-7-8 Breathing',
    subtitle: 'Rhythmic Calming',
    description: 'Guided 4s inhale, 7s hold, and 8s exhale to slow heart rate and lower stress.',
    icon: Wind,
    badge: '2 Min',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-slate-900',
    borderGlow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
  },
  {
    id: 'sensory_54321',
    title: '5-4-3-2-1 Sensory',
    subtitle: 'Panic Circuit Breaker',
    description: 'Step-by-step sensory grounding to re-anchor your awareness in the present moment.',
    icon: Eye,
    badge: '3 Min',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-slate-900',
    borderGlow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
  },
  {
    id: 'bilateral_tracing',
    title: 'Bilateral Tracing',
    subtitle: 'EMDR Infinity Loop',
    description: 'Trace slow figure-8 patterns with your finger to stimulate bilateral focus.',
    icon: Activity,
    badge: 'Tactile',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-slate-900',
    borderGlow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
  },
  {
    id: 'zen_sandbox',
    title: 'Zen Sandbox',
    subtitle: 'Craving Distraction',
    description: 'Tactile bubble popping wrap to help ride out high-intensity craving spikes.',
    icon: Sparkles,
    badge: 'Distraction',
    gradient: 'from-amber-500/20 via-orange-500/10 to-slate-900',
    borderGlow: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
  },
];

export const GroundingMenu: React.FC = () => {
  const { setActiveExercise } = useAppContext();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setIsFabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectGame = (id: GroundingExerciseType) => {
    setActiveExercise(id);
    setIsFabOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Action Button (FAB) - Visible on small screens */}
      <div ref={fabRef} className="fixed bottom-6 right-6 z-40 md:hidden">
        {/* Dropdown Menu Popup */}
        {isFabOpen && (
          <div className="absolute bottom-16 right-0 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 px-1">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Grounding Games</span>
              </div>
              <button 
                onClick={() => setIsFabOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {exercises.map((ex) => {
                const Icon = ex.icon;
                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectGame(ex.id)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {ex.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{ex.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {ex.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FAB Trigger Button */}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="flex items-center space-x-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-300/40"
        >
          <Gamepad2 className="w-5 h-5 stroke-[2.5]" />
          <span>Games</span>
          <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${isFabOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Desktop Stylized UI Card - Visible on medium+ screens */}
      <div className="hidden md:block bg-slate-850/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Interactive Grounding Suite
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Zero-typing, low-cognitive-load exercises to calm anxiety and ride out cravings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {exercises.map((ex) => {
            const Icon = ex.icon;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExercise(ex.id)}
                className={`group text-left p-4 rounded-2xl bg-gradient-to-br ${ex.gradient} border border-slate-800/80 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lg ${ex.borderGlow} active:scale-[0.98] relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-emerald-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                    {ex.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  {ex.title}
                </h3>
                <p className="text-xs font-medium text-emerald-400/90 mb-1">{ex.subtitle}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{ex.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

