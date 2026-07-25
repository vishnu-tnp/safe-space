import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Heart, User, LogOut, KeyRound, ChevronDown, Copy, Check, Menu, X, PhoneCall, ShieldAlert } from 'lucide-react';
import { PatientPairingBadge } from '../patient/PatientPairingBadge';
import { DailyStreak } from '../patient/DailyStreak';

export const Navbar: React.FC = () => {
  const { userProfile, signOut, triggerSOS, activeAlert, resolveSOS } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!userProfile) return null;

  const copyKey = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = userProfile.displayName || (userProfile.email ? userProfile.email.split('@')[0] : 'User');

  const handleReachOutClick = () => {
    setShowSosModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleConfirmReachOut = () => {
    triggerSOS('Patient requested support connect via menu');
    setSosSent(true);
  };

  return (
    <>
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex justify-between items-center rounded-b-2xl mb-6 shadow-lg relative z-50">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Heart className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-50 tracking-tight block leading-none">Safe Space</span>
            <span className="text-[10px] font-medium text-emerald-400 tracking-wider uppercase block mt-0.5">
              Recovery Hub
            </span>
          </div>
        </div>

        {/* Desktop User Menu (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-full px-3 py-1.5 text-xs transition-colors cursor-pointer text-slate-200"
            >
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium max-w-[160px] truncate">{displayName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-slate-400 text-[11px] font-medium">Logged in as</p>
                  <p className="text-slate-200 font-semibold truncate">{displayName}</p>
                </div>

                {userProfile.pairingCode && (
                  <div className="px-3 py-2 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pairing Key</p>
                        <p className="font-mono text-emerald-300 font-bold">{userProfile.pairingCode}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyKey(userProfile.pairingCode!)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                      title="Copy Key"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button (Visible only on mobile) */}
        <div className="md:hidden flex items-center" ref={mobileMenuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-200 hover:bg-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
          </button>

          {/* Mobile Hamburger Dropdown Menu Drawer */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 right-4 w-[calc(100vw-2rem)] max-w-sm bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* User Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{displayName}</h3>
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">Patient Account</span>
                  </div>
                </div>
              </div>

              {/* 1. Daily Streak Widget */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Progress</span>
                <DailyStreak />
              </div>

              {/* 2. Pairing Code Badge */}
              {userProfile.pairingCode && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Caregiver Link</span>
                  <PatientPairingBadge />
                </div>
              )}

              {/* 3. Prominent Reach Out to Someone Button */}
              <button
                onClick={handleReachOutClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>Reach Out to Someone</span>
              </button>

              {/* 4. Logout Option */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* SOS / Support Connect Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Support Connect</h3>
              </div>
              <button onClick={() => setShowSosModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!sosSent && !activeAlert ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Would you like to send a discreet alert to your caregiver and access 24/7 confidential support hotlines?
                </p>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowSosModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReachOut}
                    className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    Yes, Connect Me
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center space-x-2.5 text-emerald-300 text-xs md:text-sm">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Caregiver notified! Support is on the way.</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">24/7 Support Lines</span>
                  <a
                    href="tel:988"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors text-xs"
                  >
                    <div>
                      <div className="font-medium">988 Suicide & Crisis Lifeline</div>
                      <div className="text-[10px] text-slate-400">Call or Text 988 (24/7 Free)</div>
                    </div>
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    resolveSOS();
                    setShowSosModal(false);
                    setSosSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium transition-colors"
                >
                  Close & Clear Alert
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

