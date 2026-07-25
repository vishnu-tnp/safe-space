import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flame, Award, CheckCircle2 } from 'lucide-react';

export const DailyStreak: React.FC = () => {
  const { streakData } = useAppContext();
  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedInToday = streakData.lastCheckInDate === todayStr;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isCheckedInToday 
            ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse' 
            : 'bg-slate-700/50 text-slate-400'
        }`}>
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-slate-100">{streakData.currentStreak} Day Streak</span>
            {isCheckedInToday && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Today Completed</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isCheckedInToday 
              ? 'Awesome job staying committed to your recovery today!' 
              : 'Log your mood today to keep your streak going strong.'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-700/40">
        <Award className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-medium text-slate-300">{streakData.totalCheckIns} Total Logs</span>
      </div>
    </div>
  );
};
