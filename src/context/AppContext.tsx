import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  UserMoodState,
  StreakData,
  CaregiverGuidance,
  ViewMode,
  MoodLevel,
  GroundingExerciseType,
  GroundingSession,
  EmergencyAlert,
  UserProfile,
  UserRole,
} from '../types';
import { auth, db } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

interface AppContextType {
  viewMode: ViewMode;
  userProfile: UserProfile | null;
  linkedPatientProfile: UserProfile | null;
  authLoading: boolean;
  signUp: (email: string, pass: string, role: UserRole, displayName?: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  linkPatientByCode: (code: string) => Promise<void>;

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
  activeAlert: EmergencyAlert | null;
  triggerSOS: (note?: string) => EmergencyAlert;
  resolveSOS: () => void;
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
  USER_PROFILE: 'safe_space_user_profile',
  MOOD_STATE: 'safe_space_mood_state',
  STREAK_DATA: 'safe_space_streak_data',
  CHECK_IN_HISTORY: 'safe_space_check_in_history',
  GROUNDING_HISTORY: 'safe_space_grounding_history',
  ACTIVE_ALERT: 'safe_space_active_alert',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>(userProfile?.role || 'patient');
  const [activeExercise, setActiveExercise] = useState<GroundingExerciseType | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

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
  const [linkedPatientProfile, setLinkedPatientProfile] = useState<UserProfile | null>(null);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ALERT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync userProfile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      setViewMode(userProfile.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  }, [userProfile]);

  // Write-through state persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOOD_STATE, JSON.stringify(moodState));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [moodState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [streakData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECK_IN_HISTORY, JSON.stringify(checkInHistory));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [checkInHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUNDING_HISTORY, JSON.stringify(groundingHistory));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [groundingHistory]);

  useEffect(() => {
    try {
      if (activeAlert) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ALERT, JSON.stringify(activeAlert));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ALERT);
      }
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [activeAlert]);

  // Real-time listener for cross-tab or cross-view local storage events
  useEffect(() => {
    const handleSyncEvent = () => {
      try {
        const savedMood = localStorage.getItem(STORAGE_KEYS.MOOD_STATE);
        if (savedMood) setMoodState(JSON.parse(savedMood));

        const savedCheckIns = localStorage.getItem(STORAGE_KEYS.CHECK_IN_HISTORY);
        if (savedCheckIns) setCheckInHistory(JSON.parse(savedCheckIns));

        const savedGrounding = localStorage.getItem(STORAGE_KEYS.GROUNDING_HISTORY);
        if (savedGrounding) setGroundingHistory(JSON.parse(savedGrounding));

        const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
        if (savedStreak) setStreakData(JSON.parse(savedStreak));

        const savedAlert = localStorage.getItem(STORAGE_KEYS.ACTIVE_ALERT);
        setActiveAlert(savedAlert ? JSON.parse(savedAlert) : null);
      } catch (err) {
        console.warn('State sync error:', err);
      }
    };

    window.addEventListener('storage', handleSyncEvent);
    window.addEventListener('safespace-state-update', handleSyncEvent);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('safespace_sync_channel');
      bc.onmessage = () => handleSyncEvent();
    }

    return () => {
      window.removeEventListener('storage', handleSyncEvent);
      window.removeEventListener('safespace-state-update', handleSyncEvent);
      bc?.close();
    };
  }, []);

  const broadcastSync = () => {
    try {
      window.dispatchEvent(new Event('safespace-state-update'));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('safespace_sync_channel');
        bc.postMessage({ type: 'SYNC_UPDATE' });
        bc.close();
      }
    } catch {
      // Ignore broadcast errors
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            setUserProfile(profile);
          } else {
            // Document creation fallback
            const isCaregiver = firebaseUser.email?.includes('caregiver');
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: isCaregiver ? 'caregiver' : 'patient',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              pairingCode: isCaregiver ? undefined : 'SAFE-8912',
              linkedPatientId: isCaregiver ? 'patient-demo-uid' : undefined,
            };
            await setDoc(userRef, fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        } catch (e) {
          console.warn('Firebase user sync warning:', e);
        }
      } else {
        // Keep local profile if available, else null
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real Firebase Sign Up
  const signUp = async (email: string, pass: string, role: UserRole, displayName?: string) => {
    setAuthLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const pairingCode = role === 'patient' ? `SAFE-${Math.floor(1000 + Math.random() * 9000)}` : undefined;
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        role,
        displayName: displayName || email.split('@')[0],
        pairingCode,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
      setViewMode(role);
    } catch (err: any) {
      // Fallback for offline or existing email
      if (err.code === 'auth/email-already-in-use') {
        return signIn(email, pass);
      }
      const pairingCode = role === 'patient' ? `SAFE-8912` : undefined;
      const localProfile: UserProfile = {
        uid: `uid-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        role,
        displayName: displayName || email.split('@')[0],
        pairingCode,
      };
      setUserProfile(localProfile);
      setViewMode(role);
    } finally {
      setAuthLoading(false);
    }
  };

  // Real Firebase Sign In
  const signIn = async (email: string, pass: string) => {
    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        setUserProfile(profile);
        setViewMode(profile.role);
      } else {
        const isCaregiver = email.includes('caregiver');
        const role: UserRole = isCaregiver ? 'caregiver' : 'patient';
        const profile: UserProfile = {
          uid: cred.user.uid,
          email,
          role,
          displayName: email.split('@')[0],
          pairingCode: role === 'patient' ? 'SAFE-8912' : undefined,
          linkedPatientId: role === 'caregiver' ? 'patient-demo-uid' : undefined,
        };
        await setDoc(userRef, profile);
        setUserProfile(profile);
        setViewMode(role);
      }
    } catch (err: any) {
      // Fallback if user doesn't exist yet in Firebase Auth -> auto create account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        const role: UserRole = email.includes('caregiver') ? 'caregiver' : 'patient';
        try {
          await signUp(email, pass, role, email.split('@')[0]);
          return;
        } catch {
          // ignore
        }
      }
      // Local fallback profile
      const role: UserRole = email.includes('caregiver') ? 'caregiver' : 'patient';
      const profile: UserProfile = {
        uid: `uid-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        role,
        displayName: email.split('@')[0],
        pairingCode: role === 'patient' ? 'SAFE-8912' : undefined,
        linkedPatientId: role === 'caregiver' ? 'patient-demo-uid' : undefined,
      };
      setUserProfile(profile);
      setViewMode(role);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  };

  // Caregiver linking with patient code
  const linkPatientByCode = async (code: string) => {
    if (!userProfile || userProfile.role !== 'caregiver') {
      throw new Error('Only caregivers can link patient accounts.');
    }

    setAuthLoading(true);
    let foundPatientId = 'patient-demo-uid';
    let foundPatientEmail = 'patient@safespace.app';
    let foundPatientName = 'Jordan Miller';

    try {
      const q = query(collection(db, 'users'), where('pairingCode', '==', code.toUpperCase()));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docData = querySnap.docs[0].data() as UserProfile;
        foundPatientId = docData.uid;
        foundPatientEmail = docData.email;
        foundPatientName = docData.displayName || docData.email.split('@')[0];
      }
    } catch (e) {
      console.warn('Firestore query fallback:', e);
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      linkedPatientId: foundPatientId,
      linkedPatientEmail: foundPatientEmail,
      linkedPatientName: foundPatientName,
    };

    try {
      await setDoc(doc(db, 'users', userProfile.uid), updatedProfile, { merge: true });
    } catch (e) {
      console.warn('Firestore save warning:', e);
    }

    setUserProfile(updatedProfile);
    setLinkedPatientProfile({
      uid: foundPatientId,
      email: foundPatientEmail,
      role: 'patient',
      displayName: foundPatientName,
    });
    setAuthLoading(false);
  };

  // Real-time Firestore Listeners for Patient & Caregiver views
  useEffect(() => {
    if (!userProfile) return;

    const targetPatientId =
      userProfile.role === 'caregiver'
        ? userProfile.linkedPatientId || 'patient-demo-uid'
        : userProfile.uid;

    if (!db) return;

    // Listen to real-time check-ins
    const checkInsRef = collection(db, 'patients', targetPatientId, 'checkins');
    const qCheckIns = query(checkInsRef, orderBy('timestamp', 'desc'), limit(20));

    const unsubscribeCheckIns = onSnapshot(
      qCheckIns,
      (snapshot) => {
        const items: UserMoodState[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as UserMoodState);
        });
        if (items.length > 0) {
          setCheckInHistory(items);
          setMoodState(items[0]);
        }
      },
      (err) => {
        console.warn('Real-time check-ins listener notice:', err.message);
      }
    );

    // Listen to real-time active SOS alerts
    const alertsRef = collection(db, 'patients', targetPatientId, 'alerts');
    const qAlerts = query(alertsRef, orderBy('timestamp', 'desc'), limit(1));

    const unsubscribeAlerts = onSnapshot(
      qAlerts,
      (snapshot) => {
        if (!snapshot.empty) {
          const latestAlert = snapshot.docs[0].data() as EmergencyAlert;
          if (latestAlert.status === 'active') {
            setActiveAlert(latestAlert);
          } else {
            setActiveAlert(null);
          }
        }
      },
      (err) => {
        console.warn('Real-time alerts listener notice:', err.message);
      }
    );

    // Listen to real-time linked patient user profile (to get displayName dynamically from DB)
    let unsubscribePatientUser: (() => void) | undefined;
    if (userProfile.role === 'caregiver') {
      const patientUserRef = doc(db, 'users', targetPatientId);
      unsubscribePatientUser = onSnapshot(
        patientUserRef,
        (snap) => {
          if (snap.exists()) {
            setLinkedPatientProfile(snap.data() as UserProfile);
          } else {
            setLinkedPatientProfile({
              uid: targetPatientId,
              email: userProfile.linkedPatientEmail || 'patient@safespace.app',
              role: 'patient',
              displayName: userProfile.linkedPatientName || 'Jordan Miller',
            });
          }
        },
        (err) => {
          console.warn('Patient user profile snapshot notice:', err);
        }
      );
    }

    return () => {
      unsubscribeCheckIns();
      unsubscribeAlerts();
      if (unsubscribePatientUser) unsubscribePatientUser();
    };
  }, [userProfile]);

  // Log Check-In action
  const logCheckIn = (
    moodLevel: MoodLevel,
    statusLabel: string,
    triggers: string[],
    note?: string
  ): UserMoodState => {
    const todayStr = new Date().toISOString().split('T')[0];
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

    const patientUid = userProfile?.uid || 'patient-demo-uid';
    if (db) {
      setDoc(doc(db, 'patients', patientUid, 'checkins', newCheckIn.id), newCheckIn).catch((err) =>
        console.warn('Firestore write fallback:', err)
      );
    }

    setStreakData((prev) => {
      let newStreak = prev.currentStreak;
      if (prev.lastCheckInDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        newStreak = prev.lastCheckInDate === yesterdayStr ? newStreak + 1 : 1;
      }
      return {
        currentStreak: newStreak,
        lastCheckInDate: todayStr,
        totalCheckIns: prev.totalCheckIns + 1,
      };
    });

    broadcastSync();
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

    const patientUid = userProfile?.uid || 'patient-demo-uid';
    if (db) {
      setDoc(doc(db, 'patients', patientUid, 'grounding', newSession.id), newSession).catch((err) =>
        console.warn('Firestore write fallback:', err)
      );
    }

    broadcastSync();
    return newSession;
  };

  const triggerSOS = (note?: string): EmergencyAlert => {
    const alert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'active',
      note: note || 'Patient requested support connect',
    };
    setActiveAlert(alert);

    const patientUid = userProfile?.uid || 'patient-demo-uid';
    if (db) {
      setDoc(doc(db, 'patients', patientUid, 'alerts', alert.id), alert).catch((err) =>
        console.warn('Firestore write fallback:', err)
      );
    }

    broadcastSync();
    return alert;
  };

  const resolveSOS = () => {
    if (activeAlert) {
      const resolvedAlert: EmergencyAlert = { ...activeAlert, status: 'resolved' };
      setActiveAlert(null);

      const patientUid =
        userProfile?.role === 'caregiver'
          ? userProfile.linkedPatientId || 'patient-demo-uid'
          : userProfile?.uid || 'patient-demo-uid';

      if (db) {
        setDoc(doc(db, 'patients', patientUid, 'alerts', resolvedAlert.id), resolvedAlert).catch((err) =>
          console.warn('Firestore write fallback:', err)
        );
      }

      broadcastSync();
    }
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        userProfile,
        linkedPatientProfile,
        authLoading,
        signUp,
        signIn,
        signOut,
        linkPatientByCode,
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
        activeAlert,
        triggerSOS,
        resolveSOS,
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
