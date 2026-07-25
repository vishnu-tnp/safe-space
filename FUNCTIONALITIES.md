# Safe-Space: Modules & Functionalities Specification

This document details the feature breakdown, user roles, and interactive grounding exercises for the Safe-Space (Anchor) application.

---

## 1. Patient Role

The patient view must remain minimal, non-distracting, and highly accessible, emphasizing large tap targets and zero-typing interfaces to reduce stress and cognitive load during vulnerable moments.

### Module: Mood & Status Check-in
* **Zero-typing Interface:** Use universally understood emojis, colors, or sliders to let the user express their current state (e.g., "Anxious", "Craving", "Calm", "Overwhelmed") without typing a single word.
* **Contextual Triggers:** Optional quick-tap tags to indicate *why* they feel that way (e.g., "Stress at work", "Trouble sleeping", "Lonely").
* **Daily Streaks & Micro-wins:** Subtle, non-intrusive celebrations for consecutive check-ins or completing exercises to build positive habits.

### Module: Interactive Grounding Games & Exercises
Grounding techniques help pull individuals out of panic attacks, severe anxiety, or intense cravings by refocusing them on the present moment.

* **4-7-8 Breathing Visualizer:** An interactive, slowly expanding and contracting circle. The user follows the visual (and optional gentle audio/haptic cues) to Inhale for 4 seconds, Hold for 7, and Exhale for 8.
* **5-4-3-2-1 Sensory Check:** An interactive, step-by-step game where the app asks the user to identify:
  * 5 things they can see
  * 4 things they can touch
  * 3 things they can hear
  * 2 things they can smell
  * 1 thing they can taste
  The UI provides reassuring, GenAI-powered affirmations as they complete each step.
* **Pattern Tracing (Bilateral Stimulation):** A screen displaying gentle, glowing, slow-moving infinite loops (like a figure-eight). The user traces the pattern with their finger. This mimics EMDR-style grounding, forcing focus and slowing heart rate.
* **Zen Sandbox (Distraction Game):** A low-stakes, no-lose interactive environment, such as popping soft bubbles, raking virtual sand, or interacting with fluid/particle simulations. It serves as a tactile distraction to ride out a craving (which typically lasts 15-20 minutes).

### Module: GenAI Positive Reinforcement
* **Empathetic Responders:** When a user logs a negative mood or a craving, the Gemini API generates a personalized, empathetic, and non-judgmental short message.
* **Motivational Anchor:** A personalized dashboard featuring positive affirmations, reasons for recovery, or uploaded photos/notes from loved ones (their "Anchors").

### Module: Crisis & Support
* **One-Tap SOS:** A highly visible, but hard-to-accidentally-press button that immediately alerts the caregiver and provides quick access to crisis hotlines.

---

## 2. Caregiver Role

The caregiver view acts as a real-time monitoring and guidance hub. It should provide actionable insights without overwhelming the caregiver.

### Module: Real-time Status Feed
* **Live Mood Sync:** Real-time updates (via Firebase) of the patient's mood check-ins and completed grounding exercises.
* **Historical Trends:** A simple calendar or graph showing mood stability over the past week/month to identify potential trigger days or patterns.

### Module: Actionable GenAI Guidance (The "Co-Pilot")
* **Context-Aware "What to Say" Scripts:** When the patient logs a specific mood (e.g., "Craving" + "Lonely"), the Gemini API generates tailored, evidence-based scripts for the caregiver on how to approach the conversation.
* **"What NOT to Say" Warnings:** Crucial guardrails provided by the AI to prevent the caregiver from accidentally using triggering, judgmental, or guilt-inducing language.

### Module: Alerts & Escalation
* **Smart Notifications:** Push notifications triggered when the patient logs a severe mood, uses the SOS button, or completes a grounding exercise (so the caregiver can send positive reinforcement).
* **Inactivity Alerts:** Gentle reminders if the patient hasn't checked in for an unusual amount of time.

### Module: Resource Hub
* **Psychoeducation:** Bite-sized, easily digestible information about addiction, the neuroscience of cravings, and caregiver self-care.
* **Community Links:** Quick access to support groups for families and friends (e.g., Al-Anon, Nar-Anon).
