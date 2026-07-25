import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface Bubble {
  id: number;
  popped: boolean;
  color: string;
}

const COLOR_PALETTE = [
  'from-emerald-400 to-teal-600',
  'from-cyan-400 to-blue-600',
  'from-indigo-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-pink-400 to-rose-600',
];

export const ZenSandbox: React.FC = () => {
  const { setActiveExercise, logGroundingSession } = useAppContext();
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [secondsSpent, setSecondsSpent] = useState<number>(0);

  // NOTE: Audio pop sounds (Web Audio API synthesis) and Haptics (navigator.vibrate(15))
  // will be integrated in a later polish phase.

  const createBubbles = (): Bubble[] => {
    return Array.from({ length: 30 }, (_, index) => ({
      id: index,
      popped: false,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }));
  };

  const [bubbles, setBubbles] = useState<Bubble[]>(createBubbles);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.popped) {
          setPoppedCount((count) => count + 1);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  const handleReset = () => {
    setBubbles(createBubbles());
  };

  const handleComplete = () => {
    logGroundingSession('zen_sandbox', secondsSpent);
    setActiveExercise(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Zen Sandbox
          </h2>
          <p className="text-xs text-slate-400">Tactile Craving Distraction Wrap</p>
        </div>
        <button
          onClick={handleComplete}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          title="Exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 items-center bg-slate-900/80 px-6 py-2.5 rounded-full border border-slate-800 text-xs font-semibold text-slate-300 my-2">
        <span>Popped: <strong className="text-amber-400">{poppedCount}</strong></span>
        <span className="text-slate-600">•</span>
        <span>Time Riding Craving: <strong className="text-emerald-400">{secondsSpent}s</strong></span>
      </div>

      {/* Bubble Wrap Grid */}
      <div className="w-full max-w-sm grid grid-cols-5 gap-3.5 my-auto p-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-inner">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => popBubble(b.id)}
            disabled={b.popped}
            className={`w-full aspect-square rounded-full transition-all duration-200 ease-spring flex items-center justify-center relative ${
              b.popped
                ? 'bg-slate-950 border border-slate-800/80 shadow-inner scale-90 opacity-40'
                : `bg-gradient-to-br ${b.color} shadow-lg hover:scale-105 active:scale-75 cursor-pointer border border-white/20 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]`
            }`}
          >
            {/* Pop highlight ring */}
            {!b.popped && (
              <span className="absolute top-1.5 left-2 w-3 h-1.5 rounded-full bg-white/40 rotate-[-30deg]" />
            )}
            {b.popped && (
              <span className="w-2 h-2 rounded-full bg-slate-800/80" />
            )}
          </button>
        ))}
      </div>

      {/* Controls Footer */}
      <div className="w-full max-w-md flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3.5 rounded-full font-semibold text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reset Wrap
        </button>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 className="w-5 h-5" /> Finish & Return
        </button>
      </div>
    </div>
  );
};
