// functions/src/index.ts
import { onCall } from "firebase-functions/v1/https";
import { HttpsError } from "firebase-functions/v1/https";
import * as functions from "firebase-functions/v1";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

export const generateCuratorResponse = onCall(async (request: any) => {
  const prompt = request.data.prompt;
  if (!prompt) {
    throw new HttpsError("invalid-argument", "Prompt is required.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return { text };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new HttpsError("internal", "Failed to generate response.");
  }
});