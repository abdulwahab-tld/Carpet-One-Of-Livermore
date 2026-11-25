import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

/** Free Google AI Studio key — required for local chat without Vercel billing. */
export function hasGoogleAiKey() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim());
}

export function getShowroomModel(): LanguageModel {
  if (!hasGoogleAiKey()) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY is missing. Add a free key from https://aistudio.google.com/apikey",
    );
  }
  // Free-tier Gemini Flash-Lite alias; verified against Google AI Studio for this key.
  return google("gemini-flash-lite-latest");
}
