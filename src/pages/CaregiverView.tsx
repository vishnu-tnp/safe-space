import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';

export const CaregiverView: React.FC = () => {
  const { moodState, guidance } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end border-b border-slate-700/50 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 mb-1 tracking-tight">Caregiver Dashboard</h1>
          <p className="text-emerald-400">Real-time status and AI-assisted guidance.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-emerald-400 font-medium">Patient Current Mood</div>
          <div className="text-2xl font-bold text-emerald-300">{moodState.moodLevel} / 10</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-700/50 space-y-4 transition-all duration-300 ease-spring hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center space-x-2 text-slate-50 font-semibold text-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h2>What to Do</h2>
          </div>
          <ul className="space-y-3">
            {guidance.dos.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-700/50 space-y-4 transition-all duration-300 ease-spring hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center space-x-2 text-slate-50 font-semibold text-lg">
            <XCircle className="w-6 h-6 text-rose-400" />
            <h2>What to Avoid</h2>
          </div>
          <ul className="space-y-3">
            {guidance.donts.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 flex items-start space-x-4 transition-all duration-300 ease-spring hover:shadow-lg hover:-translate-y-1">
        <div className="bg-emerald-500/20 p-3 rounded-2xl flex-shrink-0">
          <MessageCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-50 text-lg mb-2">Suggested Script (GenAI Generated)</h3>
          <p className="text-emerald-300 italic bg-slate-900/50 border border-emerald-500/10 p-4 rounded-xl shadow-sm">
            "{guidance.script}"
          </p>
          <div className="mt-3 text-sm text-emerald-400 flex items-center space-x-1">
            <ShieldAlert className="w-4 h-4" />
            <span>This script is personalized based on current triggers and mood level.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
