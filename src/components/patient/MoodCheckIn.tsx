import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { MoodLevel } from '../../types';
import { Frown, Meh, Smile, AlertTriangle, Zap, Check, Sparkles } from 'lucide-react';

interface MoodOption {
  level: MoodLevel;
  label: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { level: 2, label: 'Struggling', icon: Frown, bgColor: 'bg-rose-500/20', textColor: 'text-rose-400', borderColor: 'border-rose-500/50' },
  { level: 4, label: 'Overwhelmed', icon: AlertTriangle, bgColor: 'bg-amber-500/20', textColor: 'text-amber-400', borderColor: 'border-amber-500/50' },
  { level: 5, label: 'Craving', icon: Zap, bgColor: 'bg-purple-500/20', textColor: 'text-purple-400', borderColor: 'border-purple-500/50' },
  { level: 6, label: 'Okay', icon: Meh, bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', borderColor: 'border-blue-500/50' },
  { level: 8, label: 'Good', icon: Smile, bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/50' },
];

const QUICK_TAGS = ['Stress', 'Sleep', 'Loneliness', 'Conflict', 'Craving'];

export const MoodCheckIn: React.FC = () => {
  const { logCheckIn } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTrigger = (tag: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    logCheckIn(selectedMood.level, selectedMood.label, selectedTriggers);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setSelectedTriggers([]);
    }, 2500);
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-3xl border border-slate-700/60 shadow-lg space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Zero-Typing Check-in</h2>
        <p className="text-sm text-slate-400">Select how you feel & tap contextual triggers</p>
      </div>

      {/* Mood Selector */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {MOOD_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood?.label === option.label;
          return (
            <button
              key={option.label}
              onClick={() => setSelectedMood(option)}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ease-spring ${
                isSelected
                  ? `${option.bgColor} ${option.borderColor} ring-2 ring-emerald-400/50 scale-105 shadow-md`
                  : 'bg-slate-900/40 border-slate-700/40 hover:bg-slate-700/40 hover:scale-102'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${option.bgColor} ${option.textColor}`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className={`mt-2 text-xs font-semibold ${isSelected ? option.textColor : 'text-slate-300'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trigger Tags & Submit */}
      {selectedMood && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-slate-700/50">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block text-center">
            What is contributing to this feeling? (Quick-Tap Tags)
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_TAGS.map((tag) => {
              const isActive = selectedTriggers.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTrigger(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)] scale-105'
                      : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {isActive && <Check className="w-3 h-3 inline mr-1" />}
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ease-spring shadow-lg flex items-center justify-center space-x-2 ${
                submitted
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 active:scale-95 shadow-emerald-500/20'
              }`}
            >
              {submitted ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Check-in Logged!</span>
                </>
              ) : (
                <span>Confirm Check-in</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
