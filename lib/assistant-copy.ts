import { business } from "@/lib/site";

export function assistantOfflineMessage() {
  return `The showroom assistant needs a free Google AI Studio key. Add GOOGLE_GENERATIVE_AI_API_KEY in .env.local from https://aistudio.google.com/apikey, then restart the server. Meanwhile, call ${business.phoneDisplay} or email ${business.email}. The showroom is open Monday through Saturday, 10:00 AM to 5:00 PM, and closed Sunday.`;
}

export function bookingNotConfiguredMessage() {
  return `Appointment booking is not connected yet. Call ${business.phoneDisplay} or email ${business.email}. The showroom is open Monday through Saturday, 10:00 AM to 5:00 PM, and closed Sunday.`;
}

export function assistantProviderErrorMessage(error: unknown) {
  const text = errorText(error).toLowerCase();
  if (text.includes("api key") || text.includes("authentication") || text.includes("401") || text.includes("403")) {
    return `The Google AI key was rejected. Check GOOGLE_GENERATIVE_AI_API_KEY in .env.local, restart the server, then try again. Or call ${business.phoneDisplay}.`;
  }
  return `I could not reach the AI service just now. Call ${business.phoneDisplay} or email ${business.email}. The showroom is open Monday through Saturday, 10:00 AM to 5:00 PM, and closed Sunday.`;
}

function errorText(error: unknown) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const cause =
      "cause" in error && error.cause instanceof Error ? error.cause.message : "";
    return `${error.message} ${cause}`;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
