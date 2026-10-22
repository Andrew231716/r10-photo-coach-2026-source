"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { LoaderCircle, MessageSquareText, SendHorizontal, Sparkles } from "lucide-react";
import { apiPath } from "@/lib/api";

type ChatItem = {
  role: "user" | "assistant";
  content: string;
  mode?: "local" | "openai";
  sources?: Array<{ id: string; kind: string; title: string; href: string }>;
};

const starters = [
  "Come imposto Eye Detection per un ritratto?",
  "Quali tempi uso per lo sport con la R10?",
  "Come fotografo di notte senza troppo rumore?",
  "Dove trovo il selettore AF/MF sul modello?",
];

export function AiCoachChat() {
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: "assistant",
      content: "Chiedimi impostazioni, procedure o scenari per la EOS R10. Rispondo subito usando Academy, guide e simulatore dell’app — gratis, senza caricare foto.",
      mode: "local",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const ask = async (question: string) => {
    const cleaned = question.trim();
    if (cleaned.length < 3 || busy) return;
    setError("");
    setBusy(true);
    setInput("");
    const history = messages.filter((item) => item.role === "user" || item.role === "assistant").slice(-6);
    setMessages((current) => [...current, { role: "user", content: cleaned }]);

    try {
      const response = await fetch(apiPath("/api/coach"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cleaned, history }),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) throw new Error("request_failed");
      const data = await response.json() as {
        answer?: string;
        mode?: "local" | "openai";
        sources?: ChatItem["sources"];
        error?: string;
      };
      if (!data.answer) throw new Error(data.error || "empty");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer!, mode: data.mode ?? "local", sources: data.sources ?? [] },
      ]);
      queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    } catch {
      setError("Il coach non ha risposto. Controlla la connessione e riprova.");
      setMessages((current) => current.slice(0, -1));
      setInput(cleaned);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <section className="premium-panel overflow-hidden">
      <div className="border-b border-[var(--line)] p-5 sm:p-7">
        <div className="flex items-center gap-2 text-[var(--cyan)]">
          <MessageSquareText size={18} aria-hidden="true" />
          <p className="font-mono text-xs uppercase tracking-[0.14em]">Coach conversazionale</p>
        </div>
        <h2 className="font-display mt-3 text-2xl font-semibold">Chiedi cosa impostare sulla R10</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Risposte basate su Academy, tutorial e comandi del simulatore. Nessuna foto viene inviata.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {starters.map((starter) => (
            <button
              key={starter}
              type="button"
              disabled={busy}
              onClick={() => void ask(starter)}
              className="border border-[var(--line)] px-3 py-2 text-left text-xs text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--paper)] disabled:opacity-50"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="max-h-[28rem] space-y-4 overflow-y-auto p-5 sm:p-7" aria-live="polite">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-sm border p-4 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto border-[var(--signal)]/40 bg-[var(--signal)]/10 text-[var(--paper)]"
                : "border-[var(--line)] bg-black/20 text-[var(--muted)]"
            }`}
          >
            <p className="whitespace-pre-wrap text-[var(--paper)]">{message.content}</p>
            {message.role === "assistant" && message.mode ? (
              <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--cyan)]">
                <Sparkles size={12} aria-hidden="true" />
                {message.mode === "openai" ? "OpenAI + knowledge base" : "Knowledge base locale"}
              </p>
            ) : null}
            {message.sources?.length ? (
              <ul className="mt-3 space-y-1">
                {message.sources.map((source) => (
                  <li key={source.id}>
                    <Link href={source.href} className="text-[var(--signal-strong)] underline-offset-2 hover:underline">
                      {source.title}
                    </Link>
                    <span className="text-[var(--muted)]"> · {source.kind}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[var(--line)] p-4 sm:p-5">
        <label htmlFor="coach-question" className="sr-only">Domanda al coach</label>
        <div className="flex gap-2">
          <input
            id="coach-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Es. Come imposto Servo AF per il beach volley?"
            maxLength={800}
            disabled={busy}
            className="min-h-12 flex-1 border border-[var(--line-strong)] bg-[var(--ink)] px-4"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length < 3}
            className="inline-flex min-h-12 min-w-12 items-center justify-center bg-[var(--signal)] px-4 font-semibold text-[var(--ink)] disabled:opacity-50"
            aria-label="Invia domanda"
          >
            {busy ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <SendHorizontal size={18} aria-hidden="true" />}
          </button>
        </div>
        {error ? <p role="alert" className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      </form>
    </section>
  );
}
