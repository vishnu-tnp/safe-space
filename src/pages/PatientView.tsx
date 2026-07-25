import React from 'react';
import { DailyStreak } from '../components/patient/DailyStreak';
import { MoodCheckIn } from '../components/patient/MoodCheckIn';
import { GroundingMenu } from '../components/patient/GroundingMenu';
import { Breathing478 } from '../components/patient/exercises/Breathing478';
import { Sensory54321 } from '../components/patient/exercises/Sensory54321';
import { BilateralTracing } from '../components/patient/exercises/BilateralTracing';
import { ZenSandbox } from '../components/patient/exercises/ZenSandbox';
import { useAppContext } from '../context/AppContext';

export const PatientView: React.FC = () => {
  const { activeExercise } = useAppContext();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Daily Streak & Micro-wins Banner */}
      <DailyStreak />

      {/* Zero-Typing Mood & Trigger Check-in */}
      <MoodCheckIn />

      {/* Interactive Grounding Suite Options */}
      <GroundingMenu />

      {/* Active Grounding Exercise Full-Screen Overlays */}
      {activeExercise === 'breathing_478' && <Breathing478 />}
      {activeExercise === 'sensory_54321' && <Sensory54321 />}
      {activeExercise === 'bilateral_tracing' && <BilateralTracing />}
      {activeExercise === 'zen_sandbox' && <ZenSandbox />}
    </div>
  );
};


