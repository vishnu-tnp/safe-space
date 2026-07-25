import React, { useState } from 'react';
import { PhoneCall, Heart, X, Check, ShieldAlert, Phone } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SOSButton: React.FC = () => {
  const { triggerSOS, activeAlert, resolveSOS } = useAppContext();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAlertSent, setIsAlertSent] = useState(false);

  const handleOpenConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSupport = () => {
    triggerSOS('Patient requested support connect');
    setIsAlertSent(true);
  };

  const handleClose = () => {
    setShowConfirmModal(false);
    setIsAlertSent(false);
  };

  return (
    <>
      {/* Non-intimidating "Reach Out & Talk" Button Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/20 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Need to Talk to Someone?</h3>
              <p className="text-xs text-slate-400">Connect with your caregiver or a crisis support line immediately.</p>
            </div>
          </div>

          <button
            onClick={handleOpenConfirm}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs md:text-sm shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 active:scale-95 flex items-center space-x-1.5 flex-shrink-0"
          >
            <Heart className="w-4 h-4 text-indigo-200" />
            <span>Reach Out</span>
          </button>
        </div>
      </div>

      {/* Confirmation & Crisis Support Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-100">Support Connect</h3>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAlertSent && !activeAlert ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Would you like to send a discreet alert to your caregiver and access 24/7 confidential support hotlines?
                </p>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSupport}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    Yes, Connect Me
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-xs md:text-sm">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Caregiver notified! Assistance is on the way.</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">24/7 Toll-Free Hotlines</span>
                  
                  <a
                    href="tel:988"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium">988 Suicide & Crisis Lifeline</div>
                      <div className="text-xs text-slate-400">Call or Text 988 (Free, 24/7, Confidential)</div>
                    </div>
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>

                  <a
                    href="tel:18006624357"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium">SAMHSA National Helpline</div>
                      <div className="text-xs text-slate-400">1-800-662-4357 (Substance Support)</div>
                    </div>
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    resolveSOS();
                    handleClose();
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
