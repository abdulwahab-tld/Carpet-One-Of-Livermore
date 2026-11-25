"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ShowroomUIMessage } from "@/lib/ai/assistant";
import { business } from "@/lib/site";

const suggestions = [
  "What are your hours?",
  "What flooring do you offer?",
  "I'd like to book a showroom visit.",
];

export function ChatWidget() {
  const titleId = useId();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, stop } = useChat<ShowroomUIMessage>({
    transport,
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages, busy, open]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <>
      {open ? (
        <section
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed right-4 bottom-20 z-[60] flex max-h-[min(32rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col border border-ink/10 bg-cream shadow-xl"
        >
          <header className="flex items-start justify-between gap-3 border-b border-ink/10 px-4 py-3">
            <div>
              <p className="font-display text-2xl leading-none text-ink" id={titleId}>
                {business.name}
              </p>
              <p className="mt-1 text-xs tracking-wide text-stone uppercase">
                Showroom assistant
              </p>
            </div>
            <button
              type="button"
              className="px-2 py-1 text-sm text-stone transition hover:text-ink"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </header>

          <div ref={logRef} className="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-stone">
                  Ask about Bioplanks, carpet tile, showroom hours, or a visit.
                </p>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="border border-ink/10 bg-plaster px-3 py-2 text-left text-sm text-ink transition hover:border-walnut"
                    onClick={() => submit(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-8 bg-walnut px-3 py-2 text-sm text-plaster"
                      : "mr-6 text-sm text-ink"
                  }
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p key={index} className="whitespace-pre-wrap">
                          {part.text}
                        </p>
                      );
                    }
                    if (
                      part.type !== "tool-getShowroomInfo" &&
                      part.type !== "tool-listOpenSlots" &&
                      part.type !== "tool-bookVisit"
                    ) {
                      return null;
                    }
                    if (part.state === "output-error") {
                      return (
                        <p key={index} className="text-stone">
                          That lookup did not finish. Call {business.phoneDisplay}.
                        </p>
                      );
                    }
                    if (part.state === "output-available") return null;
                    return (
                      <p key={index} className="text-stone">
                        Checking the showroom schedule…
                      </p>
                    );
                  })}
                </div>
              ))
            )}
            {busy ? <p className="text-xs text-stone">One moment…</p> : null}
            {error ? (
              <p role="alert" className="text-sm text-ink">
                {error.message?.includes("GOOGLE_GENERATIVE_AI_API_KEY") ||
                error.message?.includes("Google AI")
                  ? error.message
                  : `Something went wrong. Call ${business.phoneDisplay} or email ${business.email}.`}
              </p>
            ) : null}
          </div>

          <form
            className="border-t border-ink/10 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
          >
            <label className="sr-only" htmlFor={`${panelId}-input`}>
              Message the showroom assistant
            </label>
            <textarea
              id={`${panelId}-input`}
              ref={inputRef}
              rows={2}
              value={input}
              maxLength={2000}
              placeholder="Ask about flooring or a visit"
              className="w-full resize-none border border-ink/15 bg-plaster px-3 py-2 text-sm outline-none focus:border-walnut"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              {busy ? (
                <button type="button" className="text-sm text-stone" onClick={() => stop()}>
                  Stop
                </button>
              ) : (
                <span className="text-xs text-stone">Mon–Sat, 10–5</span>
              )}
              <button
                type="submit"
                disabled={busy || input.trim().length === 0}
                className="bg-walnut px-4 py-2 text-sm text-plaster disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        className="fixed right-4 bottom-4 z-[60] bg-walnut px-4 py-3 text-sm text-plaster shadow-lg"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close chat" : "Chat with us"}
      </button>
    </>
  );
}
