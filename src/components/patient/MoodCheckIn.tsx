import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { MoodLevel } from '../../types';
import { Frown, Meh, Smile, AlertTriangle, Zap, Check, CheckCircle2, MessageSquare } from 'lucide-react';

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

interface MoodCheckInProps {
  onMoodLogged?: () => void;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onMoodLogged }) => {
  const { logCheckIn } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastLoggedMessage, setLastLoggedMessage] = useState<string | null>(null);

  const handleMoodSelect = (option: MoodOption) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore
      }
    }
    setSelectedMood(option);
  };

  const toggleTrigger = (tag: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    logCheckIn(selectedMood.level, selectedMood.label, selectedTriggers, note.trim() || undefined);
    setSubmitted(true);
    setLastLoggedMessage(`${selectedMood.label} (${selectedMood.level}/10)`);

    if (onMoodLogged) {
      onMoodLogged();
    }

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-700/60 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300 tracking-wide">
          How do you feel right now?
        </span>
        {lastLoggedMessage && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium animate-in fade-in zoom-in-95 duration-300">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Recorded</span>
          </span>
        )}
      </div>

      {/* Prominent Visual Feedback Banner when Logged */}
      {lastLoggedMessage && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <span>Check-in Logged: <strong>{lastLoggedMessage}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            Synced Live
          </span>
        </div>
      )}

      {/* Mood Selector - 3 Columns with Touch Optimization */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MOOD_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood?.label === option.label;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleMoodSelect(option)}
              className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-95 touch-manipulation ${
                isSelected
                  ? `${option.bgColor} ${option.borderColor} ring-2 ring-emerald-400/60 scale-102 shadow-lg shadow-emerald-500/10`
                  : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className={`p-2.5 sm:p-3 rounded-2xl ${option.bgColor} ${option.textColor} transition-transform duration-200 relative`}>
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <span className={`mt-2 text-xs sm:text-sm font-bold tracking-tight ${isSelected ? option.textColor : 'text-slate-200'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirm Button: Shown immediately after any tile is selected */}
      {selectedMood && (
        <div className="pt-3 border-t border-slate-700/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

          {/* Primary Submit Button - always visible right below tiles */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitted}
            className={`w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer ${
              submitted
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 active:scale-[0.98] shadow-emerald-500/30'
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Check-in Recorded!</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Confirm Check-in — {selectedMood.label}</span>
              </>
            )}
          </button>

          {/* Optional Tags & Note Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Add context (optional)
              </span>
              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{showNoteInput ? 'Hide Note' : '+ Add Note'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isActive = selectedTriggers.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTrigger(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 touch-manipulation active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 inline mr-1" />}
                    {tag}
                  </button>
                );
              })}
            </div>

            {showNoteInput && (
              <input
                type="text"
                placeholder="Add a personal note for your caregiver..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all animate-in fade-in duration-200"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
