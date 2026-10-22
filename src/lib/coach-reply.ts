import { rankCoachSources, type CoachSource } from "@/lib/coach-knowledge";

export type CoachMessage = { role: "user" | "assistant"; content: string };

export type CoachReply = {
  answer: string;
  mode: "local" | "openai";
  sources: Array<Pick<CoachSource, "id" | "kind" | "title" | "href">>;
};

function localAnswer(question: string, matches: Array<CoachSource & { score: number }>): string {
  if (!matches.length) {
    return [
      "Non ho trovato una guida precisa per questa richiesta.",
      "Prova a chiedere qualcosa di concreto sulla EOS R10: ritratto, sport, notte, Eye Detection, Servo AF, diaframma o un comando della fotocamera.",
      "Puoi anche aprire le Guide di scatto o il simulatore e descrivere lo scenario che hai davanti.",
    ].join("\n\n");
  }

  const top = matches[0];
  const extras = matches.slice(1, 3);
  const lines = [
    `Per «${question.trim()}» il percorso più utile è **${top.title}**.`,
    top.text.split(/(?<=[.!?])\s+/).slice(0, 3).join(" "),
  ];

  if (top.kind === "tutorial") {
    lines.push(`Apri la guida completa qui: ${top.href}`);
  } else if (top.kind === "academy") {
    lines.push(`Continua con la lezione Academy: ${top.href}`);
  } else {
    lines.push(`Nel simulatore puoi vedere dove premere: ${top.href}`);
  }

  if (extras.length) {
    lines.push(`Altre risorse collegate: ${extras.map((item) => `${item.title} (${item.href})`).join("; ")}.`);
  }

  lines.push("Queste risposte usano solo i contenuti didattici dell’app. Se configuri OPENAI_API_KEY, il coach può riformulare la stessa base con un tono più conversazionale.");
  return lines.join("\n\n");
}

async function openAiAnswer(question: string, history: CoachMessage[], matches: Array<CoachSource & { score: number }>, apiKey: string) {
  const context = matches
    .map((match, index) => `#${index + 1} [${match.kind}] ${match.title}\nURL: ${match.href}\n${match.text.slice(0, 1200)}`)
    .join("\n\n");

  const payload = {
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: [
          "Sei il coach fotografico dell’app R10 Photo Coach, dedicato alla Canon EOS R10.",
          "Rispondi in italiano, in modo pratico e conciso (massimo 180 parole).",
          "Usa solo il contesto fornito e le conoscenze generali di fotografia. Non inventare menu o pulsanti non presenti nel contesto.",
          "Quando utile, cita i titoli delle risorse e invita a aprire guide o simulatore.",
          "Se la domanda esce dal perimetro EOS R10 / fotografia, dillo e riporta l’utente sul percorso didattico.",
          `Contesto:\n${context || "Nessuna risorsa specifica trovata."}`,
        ].join("\n"),
      },
      ...history.slice(-6).map((message) => ({ role: message.role, content: message.content })),
      { role: "user", content: question },
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`openai_${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("openai_empty");
  return content;
}

export async function createCoachReply(question: string, history: CoachMessage[] = []): Promise<CoachReply> {
  const cleaned = question.trim().slice(0, 800);
  const matches = rankCoachSources(cleaned);
  const sources = matches.map(({ id, kind, title, href }) => ({ id, kind, title, href }));
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (apiKey) {
    try {
      const answer = await openAiAnswer(cleaned, history, matches, apiKey);
      return { answer, mode: "openai", sources };
    } catch {
      return { answer: localAnswer(cleaned, matches), mode: "local", sources };
    }
  }

  return { answer: localAnswer(cleaned, matches), mode: "local", sources };
}
