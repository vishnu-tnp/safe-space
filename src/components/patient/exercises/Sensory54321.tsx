import React, { useState } from 'react';
import { X, CheckCircle2, Eye, Hand, Volume2, Sparkles, Smile, ArrowRight, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface SensoryStep {
  count: number;
  sense: string;
  action: string;
  icon: React.ElementType;
  color: string;
  affirmation: string;
  examples: string[];
}

const SENSORY_STEPS: SensoryStep[] = [
  {
    count: 5,
    sense: 'SEE',
    action: 'Look around and notice 5 distinct objects in your immediate space.',
    icon: Eye,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    affirmation: 'Wonderful focus. Your vision grounds you in the physical present.',
    examples: ['A shadow on the wall', 'A pattern on your shoes', 'A plant', 'Light passing through glass', 'A tiny speck of dust'],
  },
  {
    count: 4,
    sense: 'TOUCH',
    action: 'Feel 4 physical textures around you right now.',
    icon: Hand,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    affirmation: 'You are safe and grounded right where your body touches the world.',
    examples: ['The fabric of your shirt', 'The cool metal of your desk', 'Your feet flat on the floor', 'The texture of your blanket'],
  },
  {
    count: 3,
    sense: 'HEAR',
    action: 'Listen closely for 3 background sounds around you.',
    icon: Volume2,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    affirmation: 'Sound anchors your mind. Notice how each noise comes and goes.',
    examples: ['Humming of an AC or fan', 'Birds outside', 'Your soft breathing', 'Distant traffic'],
  },
  {
    count: 2,
    sense: 'SMELL',
    action: 'Identify 2 distinct scents or take 2 deep breaths focusing on aroma.',
    icon: Sparkles,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    affirmation: 'Breathing in presence, letting go of tension.',
    examples: ['Fresh morning air', 'Coffee or tea', 'Soap on your hands', 'Essential oils or clothing'],
  },
  {
    count: 1,
    sense: 'TASTE',
    action: 'Focus on 1 taste in your mouth right now or take a small sip of water.',
    icon: Smile,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    affirmation: 'Complete! You have successfully re-centered all five senses.',
    examples: ['A lingering taste of mint or coffee', 'Fresh cool water', 'The natural slate of your mouth'],
  },
];

export const Sensory54321: React.FC = () => {
  const { setActiveExercise, logGroundingSession } = useAppContext();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentStep = SENSORY_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNextStep = () => {
    if (currentStepIndex < SENSORY_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      logGroundingSession('sensory_54321', durationSeconds);
    }
  };

  const handleFinish = () => {
    setActiveExercise(null);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">5-4-3-2-1 Sensory Grounding</h2>
          <p className="text-xs text-slate-400">Step {currentStepIndex + 1} of 5</p>
        </div>
        <button
          onClick={handleFinish}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          title="Exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 my-2">
        {SENSORY_STEPS.map((step, idx) => (
          <div
            key={step.count}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentStepIndex
                ? 'w-8 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                : idx < currentStepIndex
                ? 'w-2.5 bg-emerald-600'
                : 'w-2.5 bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg my-auto space-y-6">
        {!isCompleted ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-in slide-in-from-bottom-4 duration-300">
            <div className="inline-flex p-4 rounded-2xl bg-slate-800/80 border border-slate-700 justify-center">
              <StepIcon className={`w-10 h-10 ${currentStep.color.split(' ')[0]}`} />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Step {5 - currentStepIndex}: Find {currentStep.count}
              </span>
              <h3 className="text-2xl font-black text-slate-50 mt-3">
                {currentStep.count} Things You Can <span className={currentStep.color.split(' ')[0]}>{currentStep.sense}</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2">{currentStep.action}</p>
            </div>

            {/* Example Ideas */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/60 text-left">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">Examples / Inspiration:</p>
              <div className="flex flex-wrap gap-2">
                {currentStep.examples.map((example, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>

            {/* Pre-GenAI Affirmation */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              ✨ {currentStep.affirmation}
            </div>

            {/* Big Action Tap Target */}
            <button
              onClick={handleNextStep}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-2xl font-bold text-base transition-all duration-300 ease-spring active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              I Identified All {currentStep.count} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Completion State */
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="inline-flex p-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-50">Grounding Complete</h3>
              <p className="text-sm text-slate-300 mt-2">
                You have brought your awareness back to the present through all 5 senses. Notice how your body feels right now.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Repeat
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
