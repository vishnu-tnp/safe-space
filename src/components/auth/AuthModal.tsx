import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Shield, Heart, UserCheck, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import type { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const emailToUse = demoRole === 'patient' ? 'patient@safespace.app' : 'caregiver@safespace.app';
      await signIn(emailToUse, 'password123');
      if (onClose) onClose();
    } catch (err: any) {
      setError('Test login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent header */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            {isSignUp ? 'Create Safe-Space Account' : 'Welcome to Safe-Space'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isSignUp
              ? 'Connect securely for real-time recovery support and caregiver guidance'
              : 'Sign in to access your personal recovery hub'}
          </p>
        </div>

        {/* Demo & Test Accounts */}
        <div className="mb-6 p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Accounts for Testing</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal normal-case">Password: <code className="text-slate-200">password123</code></span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              disabled={loading}
              className="px-3 py-2.5 text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <Heart className="w-3.5 h-3.5" />
                <span>Patient Account</span>
              </div>
              <span className="text-[10px] text-slate-400 truncate w-full">patient@safespace.app</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              disabled={loading}
              className="px-3 py-2.5 text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Caregiver Account</span>
              </div>
              <span className="text-[10px] text-slate-400 truncate w-full">caregiver@safespace.app</span>
            </button>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <span>Fill credentials:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('patient@safespace.app');
                  setPassword('password123');
                }}
                className="text-emerald-400 hover:underline"
              >
                Fill Patient
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('caregiver@safespace.app');
                  setPassword('password123');
                }}
                className="text-cyan-400 hover:underline"
              >
                Fill Caregiver
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase tracking-wider font-medium">
            or sign in with email
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Account Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                      role === 'patient'
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Patient (Recovery)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('caregiver')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                      role === 'caregiver'
                        ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Caregiver (Support)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-semibold text-sm rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
