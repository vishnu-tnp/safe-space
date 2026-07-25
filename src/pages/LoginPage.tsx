import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, Lock, Mail, AlertCircle, Heart, UserCheck } from 'lucide-react';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, role, displayName || email.split('@')[0]);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Shield className="w-8 h-8 fill-slate-950" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Safe Space</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {isSignUp
              ? 'Create a recovery user or caregiver account'
              : 'Sign in to access your secure recovery dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      role === 'patient'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Patient (Recovery)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('caregiver')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      role === 'caregiver'
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Caregiver (Support)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            {isSignUp ? 'Already registered? Return to Sign In' : "Need an account? Register Here"}
          </button>
        </div>
      </div>
    </div>
  );
};
