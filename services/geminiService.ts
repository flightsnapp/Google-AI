import { GoogleGenAI, Type } from "@google/genai";
import type { CuratorResponse, UserInputs } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

**CRUCIAL JSON FORMATTING RULE: Every string value inside the final JSON output MUST be valid. Any double quotes (") within a string MUST be escaped with a backslash (\\"). For example, a description like "A "cool" place" must be formatted as "A \\"cool\\" place" in the JSON.**

---

**CORE LOGIC**

1.  **Quiz Flow**
    -   This section is for reference only. The main generation logic is below.

2.  **Persona Assignment**
    -   **SINGLE SOURCE OF TRUTH:** The user's persona has already been calculated by the client-side application. The result is provided in the \`assigned_persona_name\` field of the JSON input.
    -   **YOUR TASK:** You MUST use this persona name as the definitive assignment. Do NOT perform your own calculation.
    -   Generate the \`persona_assignment\` object in your response based on this provided name.
    -   Look up the persona's details (vibe, tags, weights, description, image_url) from the official catalog provided below.
    -   Write a compelling \`reasoning\` for why the user's quiz answers (provided in the input) led to this specific persona assignment.
    -   The final \`dot_score\` is not needed, you can return a placeholder value of 0.

3.  **Curated Packages**
    -   Generate 3–5 packages based on the user's assigned persona and the trip parameters provided in the JSON input.
    -   Departure must be within a week of the current date.
    -   Target a price per traveler within the user's specified budget range.
    -   Generate realistic flight and lodging data.
    -   Each package: \`name\`, \`total_price\`, \`price_per_traveler\`, \`flight{}\`, \`lodging{}\`, \`activity\`, \`fit_notes\`, \`booking_link\`, \`availability\`, \`pricing_basis\`, and an \`image_url\`. The \`image_url\` MUST be a valid and visually appealing photo URL; use a service like \`https://picsum.photos/seed/your-seed/800/600\` to generate reliable placeholder images.
    -   Links: Real or \`https://expedia.com/partner/flightsnapp?ref=<slug>\`.
    -   Lodging type can be one of: 'Hotel', 'Resort', 'Hostel', 'Vacation Rental', 'Boutique Hotel', 'Eco-Lodge'.

4.  **Snapp Squad Tiers, Shareables, Booking Stubs**
    -   Generate these sections as previously defined.

---
**25 PERSONAS CATALOG (FOR REFERENCE)**
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

---

**INPUTS (Injected at runtime)**
\`\`\`json
${JSON.stringify(inputs, null, 2)}
\`\`\`

---
Now, generate the complete JSON response based on the provided inputs and your core logic. The JSON output must conform to the schema provided.
`;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        quiz_flow: {
            type: Type.OBJECT,
            properties: {
                core_questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.INTEGER}, trait: {type: Type.STRING}, text: {type: Type.STRING} }}},
                feedback_moments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { after_question: {type: Type.INTEGER}, feedback: {type: Type.STRING}, teaser: {type: Type.STRING} }}},
                follow_up_questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.INTEGER}, text: {type: Type.STRING}, tag_if_not_3: {type: Type.STRING} }}},
                modifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        },
        persona_assignment: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                vibe: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                weights: { type: Type.OBJECT, properties: { O: {type: Type.NUMBER}, C: {type: Type.NUMBER}, E: {type: Type.NUMBER}, A: {type: Type.NUMBER}, N: {type: Type.NUMBER} }},
                reasoning: { type: Type.STRING },
                dot_score: { type: Type.NUMBER },
                description: { type: Type.STRING },
                image_url: { type: Type.STRING },
            }
        },
        curated_packages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    total_price: { type: Type.NUMBER },
                    price_per_traveler: { type: Type.NUMBER },
                    flight: { type: Type.OBJECT, properties: { airline: {type: Type.STRING}, flight_number: {type: Type.STRING}, departure_airport: {type: Type.STRING}, arrival_airport: {type: Type.STRING}, departure_time: {type: Type.STRING}, arrival_time: {type: Type.STRING}, duration: {type: Type.STRING}, price: {type: Type.NUMBER} } },
                    lodging: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, type: {type: Type.STRING}, rating: {type: Type.NUMBER}, nights: {type: Type.INTEGER}, price_per_night: {type: Type.NUMBER}, total_price: {type: Type.NUMBER} } },
                    activity: { type: Type.STRING },
                    fit_notes: { type: Type.STRING },
                    booking_link: { type: Type.STRING },
                    availability: { type: Type.STRING },
                    pricing_basis: { type: Type.STRING },
                    image_url: { type: Type.STRING },
                }
            }
        },
        snapp_squad_tiers: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    tier: { type: Type.INTEGER },
                    min_members: { type: Type.INTEGER },
                    rewards: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cta: { type: Type.STRING },
                }
            }
        },
        shareables_per_package: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    short_blurb: { type: Type.STRING },
                    share_cta_x: { type: Type.STRING },
                    copy_blocks: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, subtitle: {type: Type.STRING} } },
                }
            }
        },
        booking_session_stubs: {
            type: Type.OBJECT,
            properties: {
                flight_query: { type: Type.STRING },
                hotel_query: { type: Type.STRING },
                activity_query: { type: Type.STRING },
                affiliate_hint: { type: Type.STRING },
            }
        }
    }
};

export const fetchCuratorResponse = async (inputs: UserInputs): Promise<CuratorResponse> => {
  const prompt = buildPrompt(inputs);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          // Set a safer token limit for the large JSON response to prevent truncation.
          maxOutputTokens: 8192,
          // Reserve a small budget for thinking, as required when setting maxOutputTokens.
          thinkingConfig: { thinkingBudget: 100 },
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from API.");
    }
    
    // The response text should already be a clean JSON string due to responseMimeType
    return JSON.parse(text) as CuratorResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Attempt to provide a more specific message for JSON parsing errors
        if (error.message.includes('JSON')) {
             throw new Error(`API Error: Failed to parse the AI's response. It may have been incomplete. Details: ${error.message}`);
        }
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};