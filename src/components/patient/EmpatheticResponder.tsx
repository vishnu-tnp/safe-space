import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, ArrowRight, RefreshCw, Quote } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getEmpatheticResponse, type EmpatheticResponse } from '../../services/gemini';

export const EmpatheticResponder: React.FC = () => {
  const { moodState, setActiveExercise } = useAppContext();
  const [response, setResponse] = useState<EmpatheticResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchResponse = async () => {
      setLoading(true);
      try {
        const res = await getEmpatheticResponse(moodState);
        if (isMounted) {
          setResponse(res);
        }
      } catch (err) {
        console.error('Failed to load empathetic response', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResponse();
    return () => {
      isMounted = false;
    };
  }, [moodState]);

  const handleStartExercise = () => {
    if (response?.suggestedAction) {
      if (response.suggestedAction.includes('4-7-8 Breathing')) {
        setActiveExercise('breathing_478');
      } else if (response.suggestedAction.includes('5-4-3-2-1')) {
        setActiveExercise('sensory_54321');
      } else if (response.suggestedAction.includes('Zen Sandbox')) {
        setActiveExercise('zen_sandbox');
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-850/60 border border-emerald-500/20 backdrop-blur-md p-6 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      {/* Soft ambient background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Quote Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Quote className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              A Thought From Your Friend
            </span>
            <span className="text-[10px] text-slate-400">Here for you always</span>
          </div>
        </div>
        {loading && <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />}
      </div>

      {/* Body Content */}
      {loading ? (
        <div className="py-4 space-y-2 animate-pulse">
          <div className="h-4 bg-slate-800/80 rounded w-5/6" />
          <div className="h-4 bg-slate-800/60 rounded w-2/3" />
        </div>
      ) : response ? (
        <div className="space-y-4">
          <div className="relative pl-4 border-l-2 border-emerald-400/80">
            <p className="text-sm md:text-base text-slate-100 italic leading-relaxed font-sans font-medium">
              "{response.message}"
            </p>
          </div>

          {/* Affirmation Note */}
          {response.affirmation && (
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/40 flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-300">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-xs md:text-sm text-cyan-200/90 font-medium">
                {response.affirmation}
              </p>
            </div>
          )}

          {/* Suggested Exercise Button */}
          {response.suggestedAction && (
            <button
              onClick={handleStartExercise}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-200 text-xs md:text-sm font-semibold transition-all group active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Try this now: {response.suggestedAction}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

