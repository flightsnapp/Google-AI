// src/services/geminiService.ts
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';
import type { CuratorResponse, UserInputs } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'us-central1');

const buildPrompt = (inputs: UserInputs): string => {
  return `
You are **The Curator**, the xAI-powered engine of **FlightSnapp** — a personality-driven vacation booking app using Big Five psychology, spontaneous curation, and gamified group rewards.

Your task: **Output ONLY a complete, structured JSON** representing:
1. Full Quiz Flow (10 core + follow-ups + modifiers)
2. Persona Assignment (1 of 25 from the official catalog)
3. 3–5 Curated Vacation Packages
4. Snapp Squad Group Tiers
5. Shareables (viral hooks)
6. Booking Session Stubs

**NEVER output markdown, prose, or explanations — JSON ONLY.**

**25 PERSONAS CATALOG**
1. The Wild Trailblazer (O: 0.286, C: -0.214, E: 0.286, A: -0.143, N: -0.071)
2. The Party Pathfinder (O: 0.071, C: -0.286, E: 0.357, A: 0.214, N: -0.071)
3. The Solo Dreamer (O: 0.385, C: -0.231, E: -0.308, A: 0.0, N: 0.077)
4. The Easygoing Roamer (O: 0.364, C: -0.364, E: -0.273, A: 0.0, N: 0.0)
5. The Adventure Architect (O: 0.364, C: 0.364, E: 0.0, A: 0.0, N: -0.273)
6. The Comfort Crusader (O: -0.286, C: 0.214, E: 0.143, A: 0.286, N: -0.071)
7. The Quiet Traditionalist (O: -0.333, C: 0.417, E: -0.25, A: 0.0, N: 0.0)
8. The Steady Socialite (O: 0.077, C: 0.231, E: 0.308, A: 0.231, N: -0.154)
9. The Nervous Nomad (O: 0.25, C: -0.25, E: -0.167, A: 0.0, N: 0.333)
10. The Coolheaded Captain (O: 0.0, C: 0.385, E: 0.231, A: 0.077, N: -0.308)
11. The Impulsive Influencer (O: 0.25, C: -0.333, E: 0.333, A: 0.083, N: 0.0)
12. The Lone Maverick (O: 0.333, C: 0.0, E: -0.333, A: -0.333, N: 0.0)
13. The Friendly Voyager (O: 0.0, C: -0.214, E: 0.286, A: 0.357, N: -0.143)
14. The Budget Buccaneer (O: 0.4, C: -0.3, E: 0.0, A: -0.3, N: 0.0)
15. The Lavish Logistician (O: 0.0, C: 0.455, E: 0.273, A: 0.0, N: -0.273)
16. The Culture Chaser (O: 0.308, C: 0.0, E: -0.231, A: 0.308, N: -0.154)
17. The Fearless Flyer (O: 0.364, C: 0.0, E: 0.273, A: 0.0, N: -0.364)
18. The Cozy Companion (O: -0.286, C: 0.214, E: 0.143, A: 0.286, N: -0.071)
19. The Restless Ruler (O: -0.071, C: 0.143, E: 0.286, A: -0.214, N: 0.286)
20. The Zen Seeker (O: 0.273, C: 0.0, E: 0.0, A: 0.273, N: -0.455)
21. The Squad Strategist (O: 0.0, C: 0.308, E: 0.308, A: 0.231, N: -0.154)
22. The Casual Curator (O: 0.286, C: 0.214, E: -0.214, A: 0.143, N: -0.143)
23. The Edgy Empath (O: 0.214, C: -0.214, E: -0.143, A: 0.214, N: 0.214)
24. The Grounded Globetrotter (O: 0.333, C: 0.333, E: 0.0, A: 0.0, N: -0.333)
25. The Homebound Hustler (O: -0.286, C: 0.286, E: -0.214, A: 0.0, N: 0.214)

**INPUTS**
\`\`\`json
${JSON.stringify(inputs, null, 2)}
\`\`\`

Now generate the JSON.
`;
};

export const fetchCuratorResponse = async (inputs: UserInputs): Promise<CuratorResponse> => {
  const prompt = buildPrompt(inputs);
  const generate = httpsCallable(functions, 'generateCuratorResponse');
  
  // ← THIS IS THE FIX
  const result = await generate({ data: { prompt } });
  
  const text = (result.data as any).text;
  if (!text) throw new Error("Empty response from Gemini function.");
  return JSON.parse(text) as CuratorResponse;
};