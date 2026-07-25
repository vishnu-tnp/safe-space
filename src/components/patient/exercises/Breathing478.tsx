import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const PHASE_DURATIONS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

export const Breathing478: React.FC = () => {
  const { setActiveExercise, logGroundingSession } = useAppContext();
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // NOTE: Audio/haptics cues (e.g. Web Audio API soft chimes or navigator.vibrate)
  // are currently on hold and will be implemented in a future polish phase.

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase !== 'idle') {

      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle') return;

    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      // Transition phase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(PHASE_DURATIONS.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(PHASE_DURATIONS.exhale);
      } else if (phase === 'exhale') {
        setCyclesCompleted((prev) => prev + 1);
        setPhase('inhale');
        setTimeLeft(PHASE_DURATIONS.inhale);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft]);

  const startExercise = () => {
    setPhase('inhale');
    setTimeLeft(PHASE_DURATIONS.inhale);
  };

  const resetExercise = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setTimeLeft(0);
  };

  const handleComplete = () => {
    logGroundingSession('breathing_478', totalSeconds);
    setActiveExercise(null);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale deeply through your nose...';
      case 'hold':
        return 'Hold your breath softly...';
      case 'exhale':
        return 'Exhale completely through your mouth...';
      default:
        return 'Press Start to begin guided 4-7-8 breathing';
    }
  };

  const getCircleScaleClass = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125 duration-[4000ms] bg-emerald-500/30 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)]';
      case 'hold':
        return 'scale-125 duration-[7000ms] bg-cyan-500/30 border-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.6)] animate-pulse';
      case 'exhale':
        return 'scale-75 duration-[8000ms] bg-indigo-500/20 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]';
      default:
        return 'scale-100 duration-500 bg-slate-800 border-slate-700 shadow-none';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">4-7-8 Breathing Visualizer</h2>
          <p className="text-xs text-slate-400">Cycles completed: {cyclesCompleted}</p>
        </div>
        <button
          onClick={handleComplete}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          title="Exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Breathing Circle */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Animated Glow Rings */}
        <div
          className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 flex flex-col items-center justify-center transition-all ease-linear ${getCircleScaleClass()}`}
        >
          <span className="text-4xl font-extrabold text-slate-100 tracking-wider">
            {phase === 'idle' ? '4-7-8' : `${timeLeft}s`}
          </span>
          <span className="text-xs uppercase font-semibold text-emerald-300/80 tracking-widest mt-1">
            {phase === 'idle' ? 'Ready' : phase}
          </span>
        </div>

        {/* Dynamic Phase Text */}
        <p className="mt-12 text-center text-lg font-medium text-slate-200 h-8 transition-opacity duration-300">
          {getPhaseInstruction()}
        </p>
      </div>

      {/* Controls Footer */}
      <div className="w-full max-w-md flex items-center justify-center gap-4 mb-4">
        {phase === 'idle' ? (
          <button
            onClick={startExercise}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 ease-spring hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            <Play className="w-5 h-5 fill-current" /> Start Breathing
          </button>
        ) : (
          <>
            <button
              onClick={resetExercise}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-6 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Done & Return
            </button>
          </>
        )}
      </div>
    </div>
  );
};
