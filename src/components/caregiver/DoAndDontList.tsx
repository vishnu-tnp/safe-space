import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getCaregiverGuidance } from '../../services/gemini';
import type { CaregiverGuidance } from '../../types';

export const DoAndDontList: React.FC = () => {
  const { moodState, guidance: initialGuidance } = useAppContext();
  const [guidance, setGuidance] = useState<CaregiverGuidance>(initialGuidance);

  useEffect(() => {
    let isMounted = true;
    const fetchGuidance = async () => {
      try {
        const result = await getCaregiverGuidance(moodState);
        if (isMounted) {
          setGuidance(result);
        }
      } catch (err) {
        console.error('Failed to update caregiver guardrails:', err);
      }
    };

    fetchGuidance();
    return () => {
      isMounted = false;
    };
  }, [moodState]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* What to Do */}
      <div className="bg-slate-900/90 p-5 rounded-3xl shadow-md border border-emerald-500/20 space-y-3.5 backdrop-blur-sm hover:border-emerald-500/35 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-50 font-semibold text-base">
            <div className="p-1.5 bg-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h2>Recommended Actions</h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            DO
          </span>
        </div>

        <ul className="space-y-3">
          {guidance.dos.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What NOT to Say / Avoid */}
      <div className="bg-slate-900/90 p-5 rounded-3xl shadow-md border border-rose-500/20 space-y-3.5 backdrop-blur-sm hover:border-rose-500/35 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-50 font-semibold text-base">
            <div className="p-1.5 bg-rose-500/20 rounded-xl">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <h2>AI Guardrails (What NOT to Say)</h2>
          </div>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center space-x-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>AVOID</span>
          </span>
        </div>

        <ul className="space-y-3">
          {guidance.donts.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-1 text-[11px] text-rose-300/80 flex items-center space-x-1.5 px-1">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span>Designed to prevent unintended shame or escalation during vulnerable moments.</span>
        </div>
      </div>
    </div>
  );
};
