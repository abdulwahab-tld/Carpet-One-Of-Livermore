import { createAgentUIStreamResponse, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { hasGoogleAiKey } from "@/lib/ai/model";
import { createShowroomAgent } from "@/lib/ai/assistant";
import {
  assistantOfflineMessage,
  assistantProviderErrorMessage,
} from "@/lib/assistant-copy";

export const maxDuration = 30;

const MAX_MESSAGES = 24;
const MAX_PARTS = 40;
const MAX_TEXT = 2000;
const MAX_TEXT_TOTAL = 12000;

function messageProblem(messages: unknown) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "The message could not be read.";
  }
  if (messages.length > MAX_MESSAGES) return "Send a shorter conversation.";

  let textTotal = 0;
  for (const message of messages) {
    if (!message || typeof message !== "object") return "The message could not be read.";
    const record = message as { role?: unknown; parts?: unknown };
    if (record.role !== "user" && record.role !== "assistant" && record.role !== "system") {
      return "The message could not be read.";
    }
    if (!Array.isArray(record.parts) || record.parts.length > MAX_PARTS) {
      return "The message could not be read.";
    }
    for (const part of record.parts) {
      if (!part || typeof part !== "object") return "The message could not be read.";
      const typed = part as { type?: unknown; text?: unknown };
      if (typed.type !== "text") continue;
      if (typeof typed.text !== "string" || typed.text.length > MAX_TEXT) {
        return "Please keep each message under 2,000 characters.";
      }
      textTotal += typed.text.length;
    }
  }

  if (textTotal > MAX_TEXT_TOTAL) return "This conversation is too long. Please call the showroom.";
  return null;
}

function textResponse(text: string) {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = "notice";
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: text });
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The message could not be read." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown }).messages;
  const problem = messageProblem(messages);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  if (!hasGoogleAiKey()) return textResponse(assistantOfflineMessage());

  try {
    return await createAgentUIStreamResponse({
      agent: createShowroomAgent(),
      uiMessages: messages as unknown[],
      onError: (error) => {
        console.error("Showroom assistant stream error");
        return assistantProviderErrorMessage(error);
      },
    });
  } catch (error) {
    console.error("Showroom assistant request failed");
    return textResponse(assistantProviderErrorMessage(error));
  }
}
