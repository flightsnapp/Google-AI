// functions/index.ts
import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

export const generateCuratorResponse = functions.https.onCall(async (data, context) => {
  const prompt = data.prompt;
  if (!prompt) throw new functions.https.HttpsError('invalid-argument', 'Prompt is required.');

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return { text };
});