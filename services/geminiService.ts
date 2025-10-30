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
You are **The Curator**, the xAI-powered engine of **FlightSnapp**.

**OUTPUT ONLY VALID JSON — NO MARKDOWN, NO \`\`\`json, NO EXTRA TEXT**

**REQUIRED JSON STRUCTURE — YOU MUST INCLUDE EVERY FIELD:**
{
  "persona_assignment": {
    "name": "string",
    "vibe": "string",
    "tags": ["string"],
    "weights": {
      "O": number,
      "C": number,
      "E": number,
      "A": number,
      "N": number
    },
    "reasoning": "string",
    "dot_score": 0,
    "description": "string",
    "image_url": "https://picsum.photos/seed/persona/800/600"
  },
  "curated_packages": [
    {
      "name": "string",
      "total_price": number,
      "price_per_traveler": number,
      "flight": {
        "airline": "string",
        "flight_number": "string",
        "departure_airport": "${inputs.departure_city}",
        "arrival_airport": "string",
        "departure_time": "2025-11-18T08:00:00",
        "arrival_time": "2025-11-18T14:00:00",
        "duration": "6h",
        "price": number
      },
      "lodging": {
        "name": "string",
        "type": "Hotel",
        "rating": 4.5,
        "nights": 4,
        "price_per_night": 150,
        "total_price": 600
      },
      "activity": "string",
      "fit_notes": "string",
      "booking_link": "https://expedia.com/partner/flightsnapp?ref=...",
      "availability": "High",
      "pricing_basis": "estimates",
      "image_url": "https://picsum.photos/seed/pkg1/800/600"
    }
  ],
  "snapp_squad_tiers": [
    {
      "tier": 1,
      "min_members": 3,
      "rewards": ["3% off"],
      "cta": "Invite 1 more!"
    }
  ],
  "shareables_per_package": [
    {
      "short_blurb": "string",
      "share_cta_x": "string",
      "copy_blocks": { "title": "string", "subtitle": "string" }
    }
  ],
  "booking_session_stubs": {
    "flight_query": "string",
    "hotel_query": "string",
    "activity_query": "string",
    "affiliate_hint": "expedia"
  }
}

**CRITICAL RULES — YOU MUST OBEY:**
1. **ALWAYS** return **3–5 packages** in \`curated_packages\`.
2. Use **exact persona name** from \`assigned_persona_name\`.
3. Use **exact weights** from catalog below.
4. **NEVER** omit any field.
5. **START WITH { AND END WITH }**

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

**OUTPUT JSON NOW — START WITH {**
`;
};

export const fetchCuratorResponse = async (inputs: UserInputs): Promise<CuratorResponse> => {
  const prompt = buildPrompt(inputs);
  const generate = httpsCallable(functions, 'generateCuratorResponse');
  const result = await generate({ data: { prompt } });
  const text = (result.data as any).text;
  if (!text) throw new Error("Empty response from Gemini function.");

  // Clean any code fences
  const cleaned = text.replace(/^```json\s*|\s*```$/g, '').trim();

  return JSON.parse(cleaned) as CuratorResponse;
};