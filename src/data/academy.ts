import type { AcademyLevel } from "@/types/content";

export const academyLevels: AcademyLevel[] = [
  {
    level: 1,
    title: "Controlla la luce",
    eyebrow: "Fondamenti",
    description: "Smetti di affidarti al caso: capisci come tempo, diaframma e ISO costruiscono insieme l'esposizione.",
    xp: 600,
    modules: [
      { id: "tempo", title: "Il tempo ferma o racconta", description: "Congela un gesto oppure trasformalo in movimento visibile.", duration: 14, lessonCount: 4, status: "Disponibile" },
      { id: "diaframma", title: "Diaframma e profondità", description: "Decidi quanto spazio deve apparire nitido e quanto separare il soggetto.", duration: 16, lessonCount: 5, status: "Disponibile" },
      { id: "iso", title: "ISO senza paura", description: "Alza la sensibilità quando serve e riconosci il compromesso con il rumore.", duration: 12, lessonCount: 4, status: "Disponibile" },
      { id: "esposizione", title: "Il triangolo in pratica", description: "Tre parametri, una scelta creativa: esercizi guidati sulla EOS R10.", duration: 22, lessonCount: 6, status: "Disponibile" },
    ],
  },
  {
    level: 2,
    title: "Metti a fuoco l'azione",
    eyebrow: "Autofocus EOS R10",
    description: "Impara a scegliere One-Shot, Servo AF, area AF e rilevamento del soggetto invece di lasciare tutto su automatico.",
    xp: 750,
    modules: [
      { id: "servo-af", title: "One-Shot o Servo AF", description: "Fermo o movimento: scegli l'operazione AF corretta prima di scattare.", duration: 15, lessonCount: 4, status: "Da sbloccare" },
      { id: "eye-detection", title: "Eye Detection", description: "Persone e animali: aggancia l'occhio e controlla quale soggetto seguire.", duration: 18, lessonCount: 5, status: "Da sbloccare" },
      { id: "tracking", title: "Tracking del soggetto", description: "Mantieni la priorità sul soggetto anche quando cambia posizione nell'inquadratura.", duration: 20, lessonCount: 5, status: "Da sbloccare" },
      { id: "aree-af", title: "Le aree AF", description: "Dal punto singolo all'intera area: quando la precisione conta più della velocità.", duration: 18, lessonCount: 5, status: "Da sbloccare" },
    ],
  },
  {
    level: 3,
    title: "Costruisci l'inquadratura",
    eyebrow: "Composizione",
    description: "Sposta il punto di vista, pulisci lo sfondo e guida l'occhio con linee, livelli e prospettiva.",
    xp: 800,
    modules: [
      { id: "terzi", title: "Regola dei terzi", description: "Una griglia utile, non una gabbia.", duration: 12, lessonCount: 4, status: "Da sbloccare" },
      { id: "prospettiva", title: "Prospettiva", description: "La distanza cambia i rapporti; la focale cambia l'inquadratura.", duration: 17, lessonCount: 5, status: "Da sbloccare" },
      { id: "linee", title: "Linee e ritmo", description: "Crea direzione, ordine e tensione visiva.", duration: 16, lessonCount: 4, status: "Da sbloccare" },
      { id: "sfondo", title: "Controlla lo sfondo", description: "Prima dei parametri: elimina ciò che indebolisce il soggetto.", duration: 15, lessonCount: 4, status: "Da sbloccare" },
    ],
  },
  {
    level: 4,
    title: "Leggi la luce",
    eyebrow: "Luce",
    description: "Riconosci direzione, durezza, colore e contrasto prima ancora di portare la fotocamera all'occhio.",
    xp: 850,
    modules: [
      { id: "golden-hour", title: "Golden hour", description: "Usa luce radente, toni caldi e controluce senza perdere il soggetto.", duration: 18, lessonCount: 5, status: "Da sbloccare" },
      { id: "controluce", title: "Controluce", description: "Proteggi le alte luci e scegli tra dettaglio, silhouette o luce di riempimento.", duration: 20, lessonCount: 5, status: "Da sbloccare" },
      { id: "notte", title: "La notte", description: "Treppiede o mano libera: due strategie completamente diverse.", duration: 22, lessonCount: 6, status: "Da sbloccare" },
    ],
  },
  {
    level: 5,
    title: "Sviluppa uno stile",
    eyebrow: "Tecniche avanzate",
    description: "Combina controllo tecnico, previsualizzazione e metodo di lavoro per affrontare scene difficili.",
    xp: 1000,
    modules: [
      { id: "lunga-esposizione", title: "Lunga esposizione", description: "Acqua, nuvole e scie luminose con controllo e filtri ND.", duration: 26, lessonCount: 6, status: "Da sbloccare" },
      { id: "astro", title: "Astrofotografia", description: "Fuoco manuale, tempi limite, rumore e stacking.", duration: 32, lessonCount: 7, status: "Da sbloccare" },
      { id: "sport", title: "Sport", description: "Anticipa il gesto, configura Servo AF e gestisci la raffica.", duration: 28, lessonCount: 7, status: "Da sbloccare" },
      { id: "professionale", title: "Metodo professionale", description: "Brief, checklist, backup e selezione coerente delle immagini.", duration: 30, lessonCount: 7, status: "Da sbloccare" },
    ],
  },
];

export const totalAcademyLessons = academyLevels.reduce(
  (total, level) => total + level.modules.reduce((sum, module) => sum + module.lessonCount, 0),
  0,
);
