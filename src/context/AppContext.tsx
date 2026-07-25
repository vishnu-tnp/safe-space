import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserMoodState, StreakData, CaregiverGuidance, ViewMode, MoodLevel, GroundingExerciseType, GroundingSession } from '../types';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  moodState: UserMoodState;
  setMoodState: (state: UserMoodState) => void;
  streakData: StreakData;
  checkInHistory: UserMoodState[];
  guidance: CaregiverGuidance;
  setGuidance: (guidance: CaregiverGuidance) => void;
  logCheckIn: (moodLevel: MoodLevel, statusLabel: string, triggers: string[], note?: string) => UserMoodState;
  activeExercise: GroundingExerciseType | null;
  setActiveExercise: (exercise: GroundingExerciseType | null) => void;
  groundingHistory: GroundingSession[];
  logGroundingSession: (type: GroundingExerciseType, durationSeconds: number) => GroundingSession;
}

const defaultMood: UserMoodState = {
  id: 'default-1',
  moodLevel: 7,
  statusLabel: 'Okay',
  triggers: [],
  timestamp: new Date().toISOString(),
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  lastCheckInDate: null,
  totalCheckIns: 0,
};

const defaultGuidance: CaregiverGuidance = {
  severity: 'low',
  dos: ['Listen actively', 'Offer a glass of water'],
  donts: ['Do not argue', 'Avoid sudden movements'],
  script: 'I am here for you. You are safe.',
};

const STORAGE_KEYS = {
  MOOD_STATE: 'safe_space_mood_state',
  STREAK_DATA: 'safe_space_streak_data',
  CHECK_IN_HISTORY: 'safe_space_check_in_history',
  GROUNDING_HISTORY: 'safe_space_grounding_history',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('patient');
  const [activeExercise, setActiveExercise] = useState<GroundingExerciseType | null>(null);

  const [moodState, setMoodState] = useState<UserMoodState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOOD_STATE);
      return saved ? JSON.parse(saved) : defaultMood;
    } catch {
      return defaultMood;
    }
  });

  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
      return saved ? JSON.parse(saved) : defaultStreak;
    } catch {
      return defaultStreak;
    }
  });

  const [checkInHistory, setCheckInHistory] = useState<UserMoodState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECK_IN_HISTORY);
      return saved ? JSON.parse(saved) : [defaultMood];
    } catch {
      return [defaultMood];
    }
  });

  const [groundingHistory, setGroundingHistory] = useState<GroundingSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUNDING_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [guidance, setGuidance] = useState<CaregiverGuidance>(defaultGuidance);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOOD_STATE, JSON.stringify(moodState));
    } catch (e) {
      console.error('Failed to save mood state', e);
    }
  }, [moodState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
    } catch (e) {
      console.error('Failed to save streak data', e);
    }
  }, [streakData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECK_IN_HISTORY, JSON.stringify(checkInHistory));
    } catch (e) {
      console.error('Failed to save check-in history', e);
    }
  }, [checkInHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUNDING_HISTORY, JSON.stringify(groundingHistory));
    } catch (e) {
      console.error('Failed to save grounding history', e);
    }
  }, [groundingHistory]);

  const logCheckIn = (
    moodLevel: MoodLevel,
    statusLabel: string,
    triggers: string[],
    note?: string
  ): UserMoodState => {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const newCheckIn: UserMoodState = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      moodLevel,
      statusLabel,
      triggers,
      note,
      timestamp: new Date().toISOString(),
    };

    setMoodState(newCheckIn);
    setCheckInHistory((prev) => [newCheckIn, ...prev]);

    setStreakData((prev) => {
      let newStreak = prev.currentStreak;
      if (prev.lastCheckInDate === todayStr) {
        // Already checked in today
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prev.lastCheckInDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        currentStreak: newStreak,
        lastCheckInDate: todayStr,
        totalCheckIns: prev.totalCheckIns + 1,
      };
    });

    return newCheckIn;
  };

  const logGroundingSession = (type: GroundingExerciseType, durationSeconds: number): GroundingSession => {
    const newSession: GroundingSession = {
      id: `grounding-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      durationSeconds,
      completedAt: new Date().toISOString(),
    };
    setGroundingHistory((prev) => [newSession, ...prev]);
    return newSession;
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        moodState,
        setMoodState,
        streakData,
        checkInHistory,
        guidance,
        setGuidance,
        logCheckIn,
        activeExercise,
        setActiveExercise,
        groundingHistory,
        logGroundingSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

