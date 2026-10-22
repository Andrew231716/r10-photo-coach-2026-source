import { NextRequest, NextResponse } from "next/server";
import { createCoachReply, type CoachMessage } from "@/lib/coach-reply";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "private, no-store, max-age=0" };

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: noStore });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    try {
      if (!requestHost || new URL(origin).host !== requestHost) {
        return badRequest("origin_not_allowed", 403);
      }
    } catch {
      return badRequest("origin_not_allowed", 403);
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  const question = typeof body === "object" && body && "question" in body && typeof (body as { question: unknown }).question === "string"
    ? (body as { question: string }).question.trim()
    : "";
  if (question.length < 3) return badRequest("question_too_short");
  if (question.length > 800) return badRequest("question_too_long");

  const historyRaw = typeof body === "object" && body && "history" in body ? (body as { history: unknown }).history : [];
  const history: CoachMessage[] = Array.isArray(historyRaw)
    ? historyRaw
      .filter((item): item is CoachMessage => {
        if (!item || typeof item !== "object") return false;
        const candidate = item as { role?: unknown; content?: unknown };
        return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string";
      })
      .slice(-6)
      .map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }))
    : [];

  try {
    const reply = await createCoachReply(question, history);
    return NextResponse.json(reply, { headers: noStore });
  } catch {
    return NextResponse.json({ error: "coach_unavailable" }, { status: 503, headers: noStore });
  }
}
