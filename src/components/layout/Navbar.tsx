import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Heart, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode } = useAppContext();

  return (
    <nav className="bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center rounded-b-2xl mb-6 shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-2 group cursor-pointer">
        <Heart className="text-emerald-400 w-8 h-8 group-hover:scale-110 group-hover:text-emerald-300 transition-transform duration-300 ease-spring" />
        <span className="text-xl font-semibold text-slate-50 tracking-tight">Safe Space</span>
      </div>
      
      <div className="flex bg-slate-900 rounded-full p-1 border border-slate-700/50">
        <button
          onClick={() => setViewMode('patient')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-spring active:scale-95 ${
            viewMode === 'patient'
              ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
          }`}
        >
          Patient View
        </button>
        <button
          onClick={() => setViewMode('caregiver')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-spring active:scale-95 flex items-center space-x-1 ${
            viewMode === 'caregiver'
              ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 mr-1" />
          <span>Caregiver</span>
        </button>
      </div>
    </nav>
  );
};
