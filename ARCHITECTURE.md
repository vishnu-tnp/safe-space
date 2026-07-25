# Application Architecture: Safe-Space (GenAI Recovery & Caregiver Support Hub)

## Executive Summary
**Safe-Space** is a low-cognitive-load, multi-modal web application designed to support individuals in recovery (Patients) and their Caregivers. Emphasizing zero-typing check-ins, interactive tactile grounding exercises, positive GenAI reinforcement, and real-time actionable caregiver guidance, the platform aims to reduce distress during vulnerable moments and foster supportive communication.

---

## Design Principles & UI Aesthetics
- **Calm, High-Contrast Dark Interface:** Uses dark slate (`#0f172a`, `#1e293b`), vibrant emerald/cyan glow accents, and smooth spring transitions (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
- **Zero-Typing Accessibility:** Oversized touch/tap targets, visual sliders, tag clouds, and gesture controls to eliminate typing friction during high-anxiety or craving states.
- **Real-Time Synchronicity:** Instantaneous sync between Patient check-ins/exercises and the Caregiver dashboard.

---

## Tech Stack
- **Frontend Core:** React 19, Vite, TypeScript
- **Styling & Motion:** Tailwind CSS v4, Lucide React Icons, CSS custom spring transitions
- **State Management:** React Context API (`AppContext.tsx`) with local persistence fallbacks
- **AI Engine:** Google Gemini API (`Gemini 1.5 Flash` / `Gemini 3.1 Flash`) via `src/services/gemini.ts`
- **Backend & Realtime Sync:** Firebase Firestore (Realtime snapshot listeners) & Firebase Auth (optional/anonymous)
- **Deployment:** Firebase Hosting / Vercel

---

## Comprehensive System Architecture & Modules

### 1. Patient Role Modules
```
+-----------------------------------------------------------------------------------+
|                                  PATIENT MODULES                                  |
+-----------------------------------------------------------------------------------+
|  1. Zero-Typing Mood & Status Check-in                                            |
|     - Emoji & Level Picker (Struggling, Okay, Good, Craving, Overwhelmed)         |
|     - Contextual Triggers (Quick-tap tags: Stress, Sleep, Loneliness, Conflict)   |
|     - Streak Tracker & Daily Micro-Wins                                           |
|                                                                                   |
|  2. Interactive Grounding Suite                                                   |
|     - 4-7-8 Breathing Visualizer (Interactive pulsing circle, rhythmic timers)    |
|     - 5-4-3-2-1 Sensory Check (Step-by-step game + GenAI feedback per step)       |
|     - Bilateral Pattern Tracing (EMDR-style figure-8 finger tracing)              |
|     - Zen Sandbox (Tactile bubble-pop & fluid particle craving distraction)       |
|                                                                                   |
|  3. GenAI Positive Reinforcement & Anchors                                        |
|     - Empathetic AI Responder (Personalized, non-judgmental feedback)             |
|     - Motivational Anchor Wall (Personal recovery goals, photos, affirmations)    |
|                                                                                   |
|  4. Emergency & SOS                                                               |
|     - One-Tap SOS Alerting (Instant caregiver alert + crisis hotline links)       |
+-----------------------------------------------------------------------------------+
```

### 2. Caregiver Role Modules
```
+-----------------------------------------------------------------------------------+
|                                 CAREGIVER MODULES                                 |
+-----------------------------------------------------------------------------------+
|  1. Real-time Status Feed & Analytics                                             |
|     - Live Mood & Activity Feed (Real-time Firestore listener)                    |
|     - Historical Mood Trend Chart & Calendar View                                 |
|     - Inactivity & High-Risk Alert Notifications                                  |
|                                                                                   |
|  2. Actionable GenAI Co-Pilot                                                     |
|     - Context-Aware Conversation Scripts (AI-generated empathetic responses)     |
|     - "What NOT to Say" Guardrails (Prevention of triggering/judgmental phrases)  |
|                                                                                   |
|  3. Resource Hub & Education                                                      |
|     - Psychoeducation Library (Bite-sized addiction neuroscience & self-care)     |
|     - Family & Support Group Directory (Al-Anon, Nar-Anon, Hotlines)              |
+-----------------------------------------------------------------------------------+
```

---

## Data Models (`src/types/index.ts`)

```typescript
export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ViewMode = 'patient' | 'caregiver';

export interface UserMoodState {
  id: string;
  moodLevel: MoodLevel;
  statusLabel: string; // e.g., 'Anxious', 'Craving', 'Calm', 'Overwhelmed'
  triggers: string[];
  note?: string;
  timestamp: string;
}

export interface GroundingSession {
  id: string;
  type: 'breathing_478' | 'sensory_54321' | 'bilateral_tracing' | 'zen_sandbox';
  durationSeconds: number;
  completedAt: string;
  feedbackMoodLevel?: MoodLevel;
}

export interface CaregiverGuidance {
  severity: SeverityLevel;
  dos: string[];
  donts: string[];
  script: string;
  recommendedAction: string;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  patientLocation?: string;
}
```

---

## System Directory Structure

```
safe-space/
├── ARCHITECTURE.md
├── FUNCTIONALITIES.md
├── PROGRESS.md
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── services/
│   │   ├── gemini.ts
│   │   └── firebase.ts
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── patient/
│   │   │   ├── MoodCheckIn.tsx
│   │   │   ├── BreathingExercise.tsx
│   │   │   ├── SensoryCheck54321.tsx
│   │   │   ├── BilateralTracing.tsx
│   │   │   ├── ZenSandbox.tsx
│   │   │   ├── PositiveAffirmationCard.tsx
│   │   │   └── SOSButton.tsx
│   │   └── caregiver/
│   │       ├── LiveStatusFeed.tsx
│   │       ├── MoodTrendChart.tsx
│   │       ├── GenAIScriptCoPilot.tsx
│   │       ├── DoAndDontList.tsx
│   │       └── PsychoeducationHub.tsx
│   └── pages/
│       ├── PatientView.tsx
│       └── CaregiverView.tsx
```