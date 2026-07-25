export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ViewMode = 'patient' | 'caregiver';
export type UserRole = 'patient' | 'caregiver';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  pairingCode?: string;
  linkedPatientId?: string;
  linkedPatientEmail?: string;
  linkedPatientName?: string;
  createdAt?: string;
}


export interface UserMoodState {
  id: string;
  moodLevel: MoodLevel;
  statusLabel: string; // e.g., 'Struggling', 'Overwhelmed', 'Craving', 'Okay', 'Good'
  triggers: string[];
  note?: string;
  timestamp: string;
}

export interface StreakData {
  currentStreak: number;
  lastCheckInDate: string | null; // ISO date string 'YYYY-MM-DD'
  totalCheckIns: number;
}

export interface CaregiverGuidance {
  severity: SeverityLevel;
  dos: string[];
  donts: string[];
  script: string;
  recommendedAction?: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
}

export type GroundingExerciseType = 'breathing_478' | 'sensory_54321' | 'bilateral_tracing' | 'zen_sandbox';

export interface GroundingSession {
  id: string;
  type: GroundingExerciseType;
  durationSeconds: number;
  completedAt: string;
  feedbackMoodLevel?: MoodLevel;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  patientLocation?: string;
  note?: string;
}


