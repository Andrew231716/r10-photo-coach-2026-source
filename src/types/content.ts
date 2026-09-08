export type Difficulty = "Base" | "Intermedio" | "Avanzato";
export type LensTier = "Budget" | "Medio" | "Premium";

export type CameraSettings = {
  mode: string;
  aperture: string;
  shutter: string;
  iso: string;
  autofocus: string;
  afArea: string;
  subjectDetection: string;
  eyeDetection: string;
  whiteBalance: string;
  fileFormat: string;
  stabilization: string;
  drive: string;
};

export type CostOption = {
  level: "Con ciò che hai" | "Upgrade utile" | "Setup premium";
  price: string;
  item: string;
  reason: string;
};

export type Tutorial = {
  slug: string;
  title: string;
  category: string;
  symbol: string;
  summary: string;
  outcome: string;
  difficulty: Difficulty;
  minutes: number;
  featured?: boolean;
  ownedLens: string;
  settings: CameraSettings;
  why: string;
  steps: string[];
  composition: string[];
  position: string[];
  errors: string[];
  exercise: string;
  costs: CostOption[];
  canonSources: { label: string; url: string }[];
};

export type AcademyModule = {
  id: string;
  title: string;
  description: string;
  duration: number;
  lessonCount: number;
  status: "Disponibile" | "Da sbloccare";
};

export type AcademyLevel = {
  level: number;
  title: string;
  eyebrow: string;
  description: string;
  xp: number;
  modules: AcademyModule[];
};

export type Lens = {
  id: string;
  name: string;
  tier: LensTier;
  owned: boolean;
  focalLength: string;
  equivalent: string;
  aperture: string;
  stabilization: string;
  weight: string;
  minFocus: string;
  maxMagnification: string;
  indicativePrice: string;
  advantages: string[];
  disadvantages: string[];
  uses: string[];
  ratings: { scenario: string; rating: "Consigliato" | "Alternativa" | "Economico" }[];
  sourceUrl: string;
};

export type GearItem = {
  id: string;
  name: string;
  kind: "Fotocamera" | "Obiettivo" | "Accessorio";
  detail: string;
  owned: boolean;
};
