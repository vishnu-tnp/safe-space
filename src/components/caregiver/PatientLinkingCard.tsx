import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link2, CheckCircle2, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const PatientLinkingCard: React.FC = () => {
  const { userProfile, linkPatientByCode } = useAppContext();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await linkPatientByCode(code.trim().toUpperCase());
      setSuccess('Successfully linked to Patient!');
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to link patient. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const isLinked = Boolean(userProfile?.linkedPatientId);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Patient Real-Time Pairing</h3>
            <p className="text-xs text-slate-400">
              {isLinked
                ? 'Connected to Patient Firestore snapshot feed'
                : 'Enter your patient’s 6-character Pairing Code to sync'}
            </p>
          </div>
        </div>

        {isLinked ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Sync</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <span>Unlinked</span>
          </span>
        )}
      </div>

      {isLinked ? (
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Linked Patient Account</div>
              <div className="text-sm font-semibold text-slate-200">
                {userProfile?.linkedPatientEmail || userProfile?.linkedPatientId || 'Patient Account'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCode('');
              setSuccess(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch Patient</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleLink} className="space-y-3">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SAFE-8912"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-cyan-300 uppercase tracking-wider placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-cyan-500/10"
            >
              {loading ? 'Linking...' : 'Connect'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
