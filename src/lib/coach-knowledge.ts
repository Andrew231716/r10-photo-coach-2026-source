import { academyLevels } from "@/data/academy";
import { academyLessons } from "@/data/academy-lessons";
import { cameraControls, coachGuides } from "@/data/camera-controls";
import { tutorials } from "@/data/tutorials";

export type CoachSource = {
  id: string;
  kind: "tutorial" | "academy" | "control" | "guide";
  title: string;
  href: string;
  text: string;
  keywords: string[];
};

function tokenize(value: string) {
  return value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9àèéìòù]+/i)
    .filter((token) => token.length > 2);
}

export function buildCoachSources(): CoachSource[] {
  const tutorialSources = tutorials.map((tutorial) => ({
    id: `tutorial:${tutorial.slug}`,
    kind: "tutorial" as const,
    title: tutorial.title,
    href: `/tutorials/${tutorial.slug}/`,
    text: [
      tutorial.summary,
      tutorial.outcome,
      tutorial.why,
      tutorial.steps.join(" "),
      tutorial.errors.join(" "),
      tutorial.exercise,
      Object.values(tutorial.settings).join(" "),
    ].join(" "),
    keywords: tokenize(
      `${tutorial.title} ${tutorial.category} ${tutorial.summary} ${tutorial.settings.mode} ${tutorial.settings.autofocus} ${tutorial.settings.eyeDetection}`,
    ),
  }));

  const academySources = academyLevels.flatMap((level) =>
    level.modules.map((module) => {
      const lesson = academyLessons[module.id];
      return {
        id: `academy:${module.id}`,
        kind: "academy" as const,
        title: module.title,
        href: `/academy/${module.id}/`,
        text: [module.description, lesson?.concept, lesson?.setup, lesson?.exercise, lesson?.explanation]
          .filter(Boolean)
          .join(" "),
        keywords: tokenize(`${module.title} ${module.description} ${level.title} ${lesson?.concept ?? ""}`),
      };
    }),
  );

  const controlSources = cameraControls.map((control) => ({
    id: `control:${control.id}`,
    kind: "control" as const,
    title: control.name,
    href: "/simulator/",
    text: `${control.function} ${control.when} ${control.example}`,
    keywords: tokenize(`${control.name} ${control.label} ${control.function} ${control.when} ${control.example}`),
  }));

  const guideSources = coachGuides.map((guide) => ({
    id: `guide:${guide.id}`,
    kind: "guide" as const,
    title: guide.title,
    href: "/simulator/",
    text: `${guide.prompt} ${guide.steps.map((step) => `${step.title} ${step.instruction} ${step.check}`).join(" ")}`,
    keywords: tokenize(`${guide.title} ${guide.prompt}`),
  }));

  return [...tutorialSources, ...academySources, ...controlSources, ...guideSources];
}

export function rankCoachSources(query: string, limit = 4) {
  const tokens = tokenize(query);
  if (!tokens.length) return [] as Array<CoachSource & { score: number }>;

  const scored = buildCoachSources()
    .map((source) => {
      const haystack = `${source.title} ${source.text}`.toLocaleLowerCase("it");
      let score = 0;
      for (const token of tokens) {
        if (source.keywords.includes(token)) score += 3;
        if (haystack.includes(token)) score += 1;
        if (source.title.toLocaleLowerCase("it").includes(token)) score += 2;
      }
      if (/servo|sport|atleta|movimento/.test(query) && /servo|sport/.test(haystack)) score += 4;
      if (/occhi|eye|ritratt/.test(query) && /eye|occhi|ritratt/.test(haystack)) score += 4;
      if (/notte|iso|buio/.test(query) && /notte|iso|buio/.test(haystack)) score += 3;
      if (/paesagg|paesaggio|paesaggi/.test(query) && /paesagg/.test(haystack)) score += 3;
      return { ...source, score };
    })
    .filter((source) => source.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
