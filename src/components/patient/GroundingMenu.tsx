import React from 'react';
import { Wind, Eye, Activity, Sparkles } from 'lucide-react';
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

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex) => {
          const Icon = ex.icon;
          return (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex.id)}
              className={`group text-left p-5 rounded-2xl bg-gradient-to-br ${ex.gradient} border border-slate-800/80 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-lg ${ex.borderGlow} active:scale-[0.98] relative overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-emerald-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  {ex.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                {ex.title}
              </h3>
              <p className="text-xs font-medium text-emerald-400/90 mb-2">{ex.subtitle}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{ex.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
