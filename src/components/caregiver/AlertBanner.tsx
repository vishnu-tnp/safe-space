import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export const AlertBanner: React.FC = () => {
  const { activeAlert, resolveSOS, moodState, checkInHistory } = useAppContext();

  // Check severe mood threshold (mood level 1-3 or specific crisis labels)
  const isSevereMood = moodState && moodState.moodLevel <= 3;

  // Check inactivity (if no check-ins in last 24 hours)
  const isInactive = React.useMemo(() => {
    if (!checkInHistory || checkInHistory.length === 0) return true;
    const latest = checkInHistory[0];
    const latestTime = new Date(latest.timestamp).getTime();
    const now = Date.now();
    const hoursDiff = (now - latestTime) / (1000 * 60 * 60);
    return hoursDiff >= 24;
  }, [checkInHistory]);

  if (!activeAlert && !isSevereMood && !isInactive) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Active SOS Critical Alert */}
      {activeAlert && (
        <div className="bg-rose-500/15 border border-rose-500/40 rounded-3xl p-5 text-rose-200 flex items-start justify-between shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-md">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-rose-500/20 rounded-2xl flex-shrink-0">
              <ShieldAlert className="w-7 h-7 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-rose-100">EMERGENCY SOS ALERT</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-300 uppercase tracking-wider">
                  Active Crisis
                </span>
              </div>
              <p className="text-sm text-rose-300/90 mt-1">
                Patient initiated an emergency support request.
                {activeAlert.note && <span className="block mt-0.5 italic">"{activeAlert.note}"</span>}
              </p>
              <span className="text-xs text-rose-400/70 mt-2 inline-block">
                Triggered at {new Date(activeAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <button
            onClick={resolveSOS}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-sm font-medium rounded-2xl border border-rose-500/30 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>Acknowledge</span>
          </button>
        </div>
      )}

      {/* Severe Mood Alert */}
      {!activeAlert && isSevereMood && (
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-3xl p-4 text-amber-200 flex items-center justify-between shadow-sm backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-2xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="font-semibold text-amber-100">High Distress Threshold Detected</span>
              <p className="text-xs text-amber-300/80">
                Patient reported mood level <strong className="text-amber-200">{moodState.moodLevel}/10</strong> ({moodState.statusLabel}). Check script co-pilot below for guidance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inactivity Warning */}
      {!activeAlert && isInactive && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 text-slate-300 flex items-center space-x-3 shadow-sm">
          <div className="p-2 bg-slate-700/50 rounded-2xl flex-shrink-0">
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <span className="font-medium text-slate-200">Patient Inactivity Notice</span>
            <p className="text-xs text-slate-400">
              No check-ins logged in over 24 hours. Consider sending a gentle non-intrusive message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
