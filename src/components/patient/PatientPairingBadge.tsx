import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { KeyRound, Copy, Check } from 'lucide-react';

export const PatientPairingBadge: React.FC = () => {
  const { userProfile } = useAppContext();
  const [copied, setCopied] = useState(false);

  const pairingCode = userProfile?.pairingCode || 'SAFE-8912';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 mb-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">Caregiver Pairing Code</div>
          <div className="text-sm font-mono font-bold text-emerald-300 tracking-wider">
            {pairingCode}
          </div>
        </div>
      </div>

      <button
        onClick={copyToClipboard}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Code</span>
          </>
        )}
      </button>
    </div>
  );
};
