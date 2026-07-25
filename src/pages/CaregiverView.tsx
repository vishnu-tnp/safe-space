import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Flame, HeartPulse } from 'lucide-react';
import { AlertBanner } from '../components/caregiver/AlertBanner';
import { LiveStatusFeed } from '../components/caregiver/LiveStatusFeed';
import { MoodTrendChart } from '../components/caregiver/MoodTrendChart';
import { GenAIScriptCoPilot } from '../components/caregiver/GenAIScriptCoPilot';
import { DoAndDontList } from '../components/caregiver/DoAndDontList';
import { PsychoeducationHub } from '../components/caregiver/PsychoeducationHub';

export const CaregiverView: React.FC = () => {
  const { moodState, streakData, userProfile, linkedPatientProfile } = useAppContext();

  const patientName =
    linkedPatientProfile?.displayName ||
    userProfile?.linkedPatientName ||
    (userProfile?.linkedPatientEmail
      ? userProfile.linkedPatientEmail.split('@')[0].charAt(0).toUpperCase() + userProfile.linkedPatientEmail.split('@')[0].slice(1)
      : 'Jordan Miller');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Alert Banners for Emergency SOS, Severe Mood, or Inactivity */}
      <AlertBanner />

      {/* Caregiver Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-700/50 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Caregiver Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Monitoring
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Real-time status feed, mood analytics, actionable GenAI guidance & resources for {patientName}.</p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 shadow-sm">
          {/* Current Streak */}
          <div className="flex items-center space-x-2 pr-4 border-r border-slate-700">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{patientName}'s Streak</span>
              <span className="text-sm font-bold text-amber-300">{streakData.currentStreak} Days</span>
            </div>
          </div>

          {/* Current Mood */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">{patientName}'s Current State</span>
              <span className="text-sm font-bold text-slate-100">
                {moodState.statusLabel} ({moodState.moodLevel}/10)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Section 1: Real-time Activity Feed & Historical Mood Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Live Status Feed (6 Cols) */}
        <div className="lg:col-span-6">
          <LiveStatusFeed />
        </div>

        {/* 7-Day Trend Chart & Analytics (6 Cols) */}
        <div className="lg:col-span-6">
          <MoodTrendChart />
        </div>
      </div>

      {/* Section 2: GenAI Conversation Script (Full Width) & Actionable Guardrails (2 Columns) */}
      <div className="space-y-6">
        {/* GenAI Context-Aware Script Co-pilot (Full Width) */}
        <GenAIScriptCoPilot />

        {/* Recommended Actions (DO) & AI Guardrails (DONT) in a 2-column grid */}
        <DoAndDontList />
      </div>

      {/* Section 3: Psychoeducation & Community Support Hub */}
      <div className="pt-2">
        <PsychoeducationHub />
      </div>
    </div>
  );
};

