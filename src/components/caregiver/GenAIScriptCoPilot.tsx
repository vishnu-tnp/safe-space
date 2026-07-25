import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getCaregiverGuidance } from '../../services/gemini';
import type { CaregiverGuidance } from '../../types';

export const GenAIScriptCoPilot: React.FC = () => {
  const { moodState, guidance: initialGuidance } = useAppContext();
  const [guidance, setGuidance] = useState<CaregiverGuidance>(initialGuidance);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Re-generate guidance whenever patient mood state changes
  useEffect(() => {
    let isMounted = true;
    const fetchGuidance = async () => {
      setIsGenerating(true);
      try {
        const result = await getCaregiverGuidance(moodState);
        if (isMounted) {
          setGuidance(result);
        }
      } catch (err) {
        console.error('Failed to update caregiver guidance:', err);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    fetchGuidance();
    return () => {
      isMounted = false;
    };
  }, [moodState]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await getCaregiverGuidance(moodState);
      setGuidance(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (guidance.script) {
      navigator.clipboard.writeText(guidance.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900 to-emerald-950/20 p-6 rounded-3xl border border-emerald-500/20 shadow-lg backdrop-blur-md space-y-4 relative transition-all duration-300">
      {/* Action controls (Copy & Refresh) */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={handleCopy}
          disabled={isGenerating}
          title="Copy Script"
          className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          title="Regenerate script"
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-400 hover:text-emerald-300 transition-all duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Main Big Quote Section */}
      <div className="space-y-3">
        {isGenerating ? (
          <div className="flex items-center justify-center py-6 space-x-2 text-emerald-400/80 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">Generating guidance...</span>
          </div>
        ) : (
          <blockquote className="relative text-emerald-100 font-medium text-base sm:text-lg md:text-xl leading-relaxed italic px-2">
            <span className="text-emerald-400/60 font-serif mr-1">“</span>
            {guidance.script}
            <span className="text-emerald-400/60 font-serif ml-1">”</span>
          </blockquote>
        )}

        {/* Action item as small subtext */}
        {guidance.recommendedAction && !isGenerating && (
          <p className="text-xs text-slate-400 px-2 pt-3 border-t border-slate-800/60">
            <span className="text-emerald-400 font-semibold">Action: </span>
            {guidance.recommendedAction}
          </p>
        )}
      </div>
    </div>
  );
};
