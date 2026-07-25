import React, { useState } from 'react';
import { DailyStreak } from '../components/patient/DailyStreak';
import { MoodCheckIn } from '../components/patient/MoodCheckIn';
import { EmpatheticResponder } from '../components/patient/EmpatheticResponder';
import { GroundingMenu } from '../components/patient/GroundingMenu';
import { AnchorWall } from '../components/patient/AnchorWall';
import { SOSButton } from '../components/patient/SOSButton';
import { PatientPairingBadge } from '../components/patient/PatientPairingBadge';
import { Breathing478 } from '../components/patient/exercises/Breathing478';
import { Sensory54321 } from '../components/patient/exercises/Sensory54321';
import { BilateralTracing } from '../components/patient/exercises/BilateralTracing';
import { ZenSandbox } from '../components/patient/exercises/ZenSandbox';
import { useAppContext } from '../context/AppContext';

export const PatientView: React.FC = () => {
  const { activeExercise, streakData } = useAppContext();
  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyLoggedToday = streakData.lastCheckInDate === todayStr;

  const [hasJustLoggedMood, setHasJustLoggedMood] = useState(false);

  const shouldShowAiQuote = isAlreadyLoggedToday || hasJustLoggedMood;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Grid Container: Single column on mobile, 2 columns on desktop (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Column (Left on Desktop): Mood Log, AI Quote, Anchor Wall */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {/* Desktop-only Daily Streak banner at top of main column */}
          <div className="hidden md:block">
            <DailyStreak />
          </div>

          {/* Mood Check-In Section */}
          <MoodCheckIn onMoodLogged={() => setHasJustLoggedMood(true)} />

          {/* AI Friend Quote: Displayed after user logs mood or if already logged today */}
          {shouldShowAiQuote && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <EmpatheticResponder />
            </div>
          )}

          {/* Anchor Wall Options */}
          <AnchorWall />
        </div>

        {/* Sidebar Column (Right on Desktop): Pairing Badge, Games Card, Reach Out Button */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          {/* Caregiver Pairing Code (Desktop Sidebar) */}
          <div className="hidden md:block">
            <PatientPairingBadge />
          </div>

          {/* Games Section: Renders stylized UI Card on desktop, FAB on mobile */}
          <GroundingMenu />

          {/* Support Connect / Reach Out Button (Desktop Sidebar) */}
          <div className="hidden md:block">
            <SOSButton />
          </div>
        </div>
      </div>

      {/* Active Grounding Exercise Full-Screen Overlays */}
      {activeExercise === 'breathing_478' && <Breathing478 />}
      {activeExercise === 'sensory_54321' && <Sensory54321 />}
      {activeExercise === 'bilateral_tracing' && <BilateralTracing />}
      {activeExercise === 'zen_sandbox' && <ZenSandbox />}
    </div>
  );
};

