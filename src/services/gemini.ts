import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserMoodState, CaregiverGuidance, SeverityLevel } from '../types';

/**
 * Gemini AI Engine Service for Safe-Space.
 * Supports live Gemini 1.5 Flash API calls with structured JSON output,
 * trauma-informed prompt engineering, and graceful offline fallbacks.
 */

export interface EmpatheticResponse {
  message: string;
  affirmation: string;
  suggestedAction?: string;
  isAiGenerated: boolean;
  isFallback?: boolean;
}

const MOCK_RESPONSES: Record<string, EmpatheticResponse> = {
  Struggling: {
    message: "It takes tremendous courage to acknowledge when things feel hard. Remember, this feeling is a temporary wave — it will pass, and you don't have to carry it alone.",
    affirmation: "I am stronger than this moment, and I am worthy of support.",
    suggestedAction: "Try our 4-7-8 Breathing visualizer below to help settle your nervous system.",
    isAiGenerated: false,
    isFallback: true,
  },
  Overwhelmed: {
    message: "When everything feels like too much, bring your focus to just this one breath. You don't have to figure out all of tomorrow right now.",
    affirmation: "One step at a time, one breath at a time. I am safe right here.",
    suggestedAction: "Use the 5-4-3-2-1 Sensory Check to ground yourself in the present room.",
    isAiGenerated: false,
    isFallback: true,
  },
  Craving: {
    message: "A craving is like a wave in the ocean. It rises, peaks, and always subsides — usually within 15-20 minutes. You have surfed this wave before.",
    affirmation: "A craving is a sensation, not a command. I am in control of my actions.",
    suggestedAction: "Head over to the Zen Sandbox to pop some bubbles and distract your brain.",
    isAiGenerated: false,
    isFallback: true,
  },
  Okay: {
    message: "Steady and grounded is a great place to be. Take a moment to appreciate the quiet stability you've cultivated today.",
    affirmation: "I honor my progress and value each moment of balance.",
    suggestedAction: "Check out your Motivational Anchor Wall to reinforce your recovery goals.",
    isAiGenerated: false,
    isFallback: true,
  },
  Good: {
    message: "Celebrate this bright moment! Every good hour and calm day is proof of your resilience and commitment to your journey.",
    affirmation: "I celebrate my strength and welcome peace into my life.",
    suggestedAction: "Add a note or photo to your Anchor Wall to remember how this victory feels.",
    isAiGenerated: false,
    isFallback: true,
  },
};

const MOCK_CAREGIVER_GUIDANCE: Record<string, CaregiverGuidance> = {
  Struggling: {
    severity: 'high',
    script: `"I notice you're feeling overwhelmed right now. I'm here with you, and you don't need to explain anything right now unless you want to."`,
    dos: [
      'Offer a quiet, low-sensory environment',
      'Use a calm, low tone of voice and slow pacing',
      'Validate their feelings without trying to immediately fix the problem',
      'Offer a glass of water or gentle presence'
    ],
    donts: [
      "Don't minimize their pain ('It could be worse' or 'You'll get over it')",
      "Don't bombard them with rapid-fire questions about why they feel this way",
      "Don't express panic, frustration, or visible impatience",
      "Don't give unsolicited advice or force quick solutions"
    ],
    recommendedAction: 'Suggest trying the 4-7-8 Breathing or 5-4-3-2-1 Grounding exercise together.',
    isAiGenerated: false,
    isFallback: true
  },
  Overwhelmed: {
    severity: 'high',
    script: `"Things feel heavy right now, and that's okay. Let's take things one minute at a time together."`,
    dos: [
      'Reduce sensory clutter and lower ambient noise',
      'Speak slowly and concisely',
      'Encourage a single sensory grounding exercise'
    ],
    donts: [
      "Don't urge them to hurry or pull it together",
      "Don't bring up long-term commitments or responsibilities",
      "Don't argue or dismiss their emotional intensity"
    ],
    recommendedAction: 'Guide them through 5-4-3-2-1 Sensory Grounding.',
    isAiGenerated: false,
    isFallback: true
  },
  Craving: {
    severity: 'critical',
    script: `"Cravings can feel intense and overwhelming, but remember they are temporary waves that peak and pass within 15-20 minutes. I'm right here to help you surf this wave."`,
    dos: [
      'Remind them that a craving is a neurochemical reaction, not a failure of will',
      'Engage them in a tactile distraction (e.g., Zen Sandbox, walking, cold water on wrists)',
      'Stay physically present if comfortable, or check in every 5 minutes',
      'Acknowledge how hard they are fighting right now'
    ],
    donts: [
      "Don't bring up past relapses or bring up guilt/shame topics",
      "Don't leave them entirely alone without asking if they feel safe",
      "Don't interrogate them on what triggered the craving right now",
      "Don't argue or act suspicious"
    ],
    recommendedAction: 'Guide them to the Zen Sandbox mini-game or offer to take a short walk together.',
    isAiGenerated: false,
    isFallback: true
  },
  Good: {
    severity: 'low',
    script: `"I love seeing you feeling good today! I'm so proud of the steady effort and resilience you've been putting into your recovery."`,
    dos: [
      'Acknowledge and celebrate their micro-wins and positive momentum',
      'Encourage them to update their Motivational Anchor Wall',
      'Maintain normal, uplifting conversation and connection'
    ],
    donts: [
      "Don't assume recovery is 'done' or lower support awareness completely",
      "Don't bring up stressful future topics unnecessarily",
      "Don't dismiss their good mood as luck — attribute it to their effort"
    ],
    recommendedAction: 'Reinforce their daily streak and offer positive words of encouragement.',
    isAiGenerated: false,
    isFallback: true
  },
  Okay: {
    severity: 'medium',
    script: `"I'm glad to see you're feeling steady today. How are you holding up? I'm always here if you want to chat."`,
    dos: [
      'Maintain open, casual communication lines',
      'Ask open-ended, non-pressuring questions about their day',
      'Acknowledge their consistency and daily check-ins'
    ],
    donts: [
      "Don't press for deep emotional reveals if they prefer quiet calm",
      "Don't ignore subtle signs of hidden stress",
      "Don't compare their progress to others"
    ],
    recommendedAction: 'Keep a gentle eye on live status updates and support their routine.',
    isAiGenerated: false,
    isFallback: true
  }
};

/**
 * Initialize Gemini AI client dynamically from VITE_GEMINI_API_KEY
 */
const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-flash-latest',
];

/**
 * Helper to call generateContent with automatic model fallback across candidate model names.
 */
async function generateContentWithModelFallback(genAI: GoogleGenerativeAI, prompt: string) {
  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err: any) {
      lastError = err;
      // If it's a 404 model not found error, try the next model candidate
      if (err?.message?.includes('404') || err?.message?.includes('not found')) {
        continue;
      }
      // If it's another error (e.g. 401 unauthorized key), throw immediately
      throw err;
    }
  }

  throw lastError || new Error('No compatible Gemini model found.');
}

function getGenAIClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini AI Engine] Client initialization failed:', err);
    return null;
  }
}

/**
 * Generate an empathetic, trauma-informed response based on patient mood state.
 * Uses Gemini API if configured, otherwise falls back gracefully to cached responses.
 */
export async function getEmpatheticResponse(moodState: UserMoodState): Promise<EmpatheticResponse> {
  const genAI = getGenAIClient();

  if (!genAI) {
    // Return cached fallback response
    const statusKey = moodState.statusLabel || 'Okay';
    const fallback = MOCK_RESPONSES[statusKey] || MOCK_RESPONSES['Okay'];
    let customMessage = fallback.message;
    if (moodState.triggers && moodState.triggers.length > 0) {
      customMessage += ` It's completely valid that ${moodState.triggers.join(', ').toLowerCase()} is weighing on you.`;
    }
    return {
      ...fallback,
      message: customMessage,
      isAiGenerated: false,
      isFallback: true,
    };
  }

  try {
    const prompt = `
You are a trauma-informed, empathetic recovery assistant for a mental health & addiction support app called Safe-Space.
The user is checking in with their current mood status.

User Context:
- Mood Rating (1-10): ${moodState.moodLevel}
- Mood Category: "${moodState.statusLabel}"
- Active Triggers: ${moodState.triggers.length > 0 ? moodState.triggers.join(', ') : 'None specified'}
- Additional Note: ${moodState.note ? `"${moodState.note}"` : 'None'}

Instructions:
1. Provide a warm, empathetic, non-judgmental response (2-3 sentences max).
2. Provide a short positive affirmation (1 sentence).
3. Suggest one relevant grounding exercise action based on their state (choose one: "Try our 4-7-8 Breathing visualizer below", "Use the 5-4-3-2-1 Sensory Check to ground yourself", "Head over to the Zen Sandbox", "Check out your Motivational Anchor Wall").

Return ONLY valid JSON matching this structure:
{
  "message": "string",
  "affirmation": "string",
  "suggestedAction": "string"
}
`;

    const result = await generateContentWithModelFallback(genAI, prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      message: parsed.message || 'We are here with you in this moment.',
      affirmation: parsed.affirmation || 'I am safe and supported.',
      suggestedAction: parsed.suggestedAction || 'Try our 4-7-8 Breathing visualizer below',
      isAiGenerated: true,
      isFallback: false,
    };
  } catch (error) {
    console.error('[Gemini AI Engine] API request failed. Falling back to offline cache. Error details:', error);
    const statusKey = moodState.statusLabel || 'Okay';
    const fallback = MOCK_RESPONSES[statusKey] || MOCK_RESPONSES['Okay'];
    return {
      ...fallback,
      isAiGenerated: false,
      isFallback: true,
    };
  }
}

/**
 * Generate context-aware caregiver guidance scripts and guardrails.
 * Uses Gemini API if configured, otherwise falls back gracefully to cached responses.
 */
export async function getCaregiverGuidance(moodState: UserMoodState): Promise<CaregiverGuidance> {
  const genAI = getGenAIClient();

  const createDynamicFallback = (mood: UserMoodState): CaregiverGuidance => {
    const statusKey = mood.statusLabel || 'Okay';
    const base = MOCK_CAREGIVER_GUIDANCE[statusKey] || MOCK_CAREGIVER_GUIDANCE['Okay'];

    let script = base.script;
    if (mood.note && mood.note.trim()) {
      script = `"I hear that you're feeling ${mood.statusLabel.toLowerCase()} and '${mood.note.trim()}'. I'm right here with you."`;
    } else if (mood.triggers && mood.triggers.length > 0) {
      script = `"I see that ${mood.triggers.join(' & ').toLowerCase()} is weighing on you right now. You don't have to carry this alone."`;
    }

    const dos = [...base.dos];
    if (mood.note && mood.note.trim()) {
      dos.unshift(`Acknowledge their personal note: "${mood.note.trim()}"`);
    }

    return {
      ...base,
      script,
      dos: dos.slice(0, 4),
      isAiGenerated: false,
      isFallback: true,
    };
  };

  if (!genAI) {
    return createDynamicFallback(moodState);
  }

  try {
    const prompt = `
You are an expert clinical co-pilot assisting a caregiver (family member, partner, or sponsor) supporting a person in recovery.
The patient has logged a mood check-in.

Patient Context:
- Mood Rating (1-10): ${moodState.moodLevel}
- Mood Category: "${moodState.statusLabel}"
- Triggers: ${moodState.triggers.length > 0 ? moodState.triggers.join(', ') : 'None specified'}
- Patient Note: ${moodState.note ? `"${moodState.note}"` : 'None'}

Instructions:
1. Determine appropriate severity level ("low", "medium", "high", or "critical").
2. Provide a 1-2 sentence direct, empathetic script for the caregiver to say to the patient in quotes.
3. List 3-4 recommended "dos" (supportive actions).
4. List 3-4 "donts" (what to avoid saying/doing to prevent guilt, shame, or escalation).
5. Suggest a recommended action for the caregiver to take with the patient.

Return ONLY valid JSON matching this structure:
{
  "severity": "low" | "medium" | "high" | "critical",
  "script": "string",
  "dos": ["string", "string", "string"],
  "donts": ["string", "string", "string"],
  "recommendedAction": "string"
}
`;

    const result = await generateContentWithModelFallback(genAI, prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    const validSeverities: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
    const severity: SeverityLevel = validSeverities.includes(parsed.severity) ? parsed.severity : 'medium';

    return {
      severity,
      script: parsed.script || `"I'm right here with you. Take all the time you need."`,
      dos: Array.isArray(parsed.dos) && parsed.dos.length > 0 ? parsed.dos : ['Listen without judging', 'Keep a calm tone'],
      donts: Array.isArray(parsed.donts) && parsed.donts.length > 0 ? parsed.donts : ["Don't criticize", "Don't force solutions"],
      recommendedAction: parsed.recommendedAction || 'Offer a calm, quiet space and a glass of water.',
      isAiGenerated: true,
      isFallback: false,
    };
  } catch (error) {
    console.error('[Gemini AI Engine] Caregiver guidance API failed. Falling back to dynamic offline cache. Error details:', error);
    return createDynamicFallback(moodState);
  }
}


