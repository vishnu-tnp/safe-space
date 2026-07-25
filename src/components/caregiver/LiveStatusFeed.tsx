import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Activity, Wind, Eye, Compass, Sparkles, Tag, Clock, HeartHandshake } from 'lucide-react';
import type { GroundingExerciseType } from '../../types';

interface TimelineEvent {
  id: string;
  type: 'check_in' | 'grounding';
  timestamp: string;
  title: string;
  subtitle?: string;
  moodLevel?: number;
  tags?: string[];
  durationSeconds?: number;
  exerciseType?: GroundingExerciseType;
}

export const LiveStatusFeed: React.FC = () => {
  const { checkInHistory, groundingHistory } = useAppContext();

  const events: TimelineEvent[] = React.useMemo(() => {
    const checkInEvents: TimelineEvent[] = (checkInHistory || []).map((item) => ({
      id: item.id,
      type: 'check_in',
      timestamp: item.timestamp,
      title: `Mood Check-in: ${item.statusLabel}`,
      subtitle: item.note ? `"${item.note}"` : undefined,
      moodLevel: item.moodLevel,
      tags: item.triggers,
    }));

    const exerciseNames: Record<GroundingExerciseType, string> = {
      breathing_478: '4-7-8 Breathing Exercise',
      sensory_54321: '5-4-3-2-1 Sensory Grounding',
      bilateral_tracing: 'EMDR Bilateral Pattern Tracing',
      zen_sandbox: 'Zen Sandbox Tactile Pop',
    };

    const groundingEvents: TimelineEvent[] = (groundingHistory || []).map((item) => ({
      id: item.id,
      type: 'grounding',
      timestamp: item.completedAt,
      title: `Completed ${exerciseNames[item.type] || 'Grounding Session'}`,
      durationSeconds: item.durationSeconds,
      exerciseType: item.type,
    }));

    return [...checkInEvents, ...groundingEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [checkInHistory, groundingHistory]);

  const getExerciseIcon = (type?: GroundingExerciseType) => {
    switch (type) {
      case 'breathing_478':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'sensory_54321':
        return <Eye className="w-4 h-4 text-emerald-400" />;
      case 'bilateral_tracing':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'zen_sandbox':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-emerald-400" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/50 rounded-3xl p-6 shadow-sm backdrop-blur-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-50 tracking-tight">Live Activity Feed</h2>
            <p className="text-xs text-slate-400">Real-time check-in and exercise log</p>
          </div>
        </div>
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Syncing Live</span>
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 text-slate-500 space-y-2">
          <Clock className="w-8 h-8 mx-auto opacity-40" />
          <p className="text-sm">No activity recorded yet today.</p>
        </div>
      ) : (
        <div className="max-h-[460px] overflow-y-auto pr-2 space-y-5 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700/60">
          {events.map((event) => (
            <div key={event.id} className="relative group animate-in fade-in slide-in-from-left-2 duration-300">
              {/* Event Marker */}
              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-slate-800 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                event.type === 'check_in'
                  ? (event.moodLevel && event.moodLevel <= 3 ? 'border-amber-400 text-amber-400' : 'border-emerald-400 text-emerald-400')
                  : 'border-cyan-400 text-cyan-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'check_in'
                    ? (event.moodLevel && event.moodLevel <= 3 ? 'bg-amber-400' : 'bg-emerald-400')
                    : 'bg-cyan-400'
                }`} />
              </div>

              {/* Event Body */}
              <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900/80">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {event.type === 'grounding' && getExerciseIcon(event.exerciseType)}
                    <span className="font-medium text-slate-200 text-sm">{event.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>

                {event.subtitle && (
                  <p className="text-xs text-slate-400 italic mt-1.5 pl-1 border-l-2 border-slate-700">
                    {event.subtitle}
                  </p>
                )}

                {/* Mood Level Badge */}
                {event.moodLevel !== undefined && (
                  <div className="mt-2.5 flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Rating:</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      event.moodLevel >= 7
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : event.moodLevel >= 4
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {event.moodLevel} / 10
                    </span>
                  </div>
                )}

                {/* Grounding Duration */}
                {event.durationSeconds !== undefined && (
                  <div className="mt-2 text-xs text-slate-400">
                    Duration: <span className="text-slate-300 font-medium">{event.durationSeconds}s</span>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
