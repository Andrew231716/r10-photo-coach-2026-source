import type { GearItem, Lens } from "@/types/content";

export const defaultGear: GearItem[] = [
  { id: "eos-r10", name: "Canon EOS R10", kind: "Fotocamera", detail: "APS-C · 24,2 MP · Dual Pixel CMOS AF II", owned: true },
  { id: "rf-s-18-150", name: "RF-S 18-150mm F3.5-6.3 IS STM", kind: "Obiettivo", detail: "Zoom tuttofare · IS ottico 4,5 stop", owned: true },
  { id: "rf-50", name: "RF 50mm F1.8 STM", kind: "Obiettivo", detail: "Fisso luminoso · 80mm equivalente sulla R10", owned: true },
];

export const lenses: Lens[] = [
  {
    id: "rf-s-18-150", name: "RF-S 18-150mm F3.5-6.3 IS STM", tier: "Medio", owned: true,
    focalLength: "18–150mm", equivalent: "29–240mm", aperture: "f/3.5–6.3", stabilization: "IS ottico 4,5 stop",
    weight: "310 g", minFocus: "0,17 m AF a 35mm", maxMagnification: "0,44× AF · 0,59× MF", indicativePrice: "circa €550",
    advantages: ["Un solo obiettivo per quasi tutto", "Leggero rispetto alla sua escursione", "Stabilizzato e adatto anche a video"],
    disadvantages: ["Poco luminoso sul lato tele", "Non isola lo sfondo come un fisso f/1.8"],
    uses: ["Viaggi", "Paesaggio", "Eventi", "Sport vicino", "Dettagli"],
    ratings: [{ scenario: "Viaggi", rating: "Consigliato" }, { scenario: "Beach volley", rating: "Consigliato" }, { scenario: "Ritratto", rating: "Alternativa" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-s-18-150mm-f3-5-6-3-is-stm/",
  },
  {
    id: "rf-50", name: "RF 50mm F1.8 STM", tier: "Budget", owned: true,
    focalLength: "50mm", equivalent: "80mm", aperture: "f/1.8", stabilization: "No",
    weight: "160 g", minFocus: "0,30 m", maxMagnification: "0,25×", indicativePrice: "circa €240",
    advantages: ["Molto luminoso", "Bokeh evidente", "Piccolo e leggero"],
    disadvantages: ["Nessun IS ottico", "Su APS-C è stretto in ambienti piccoli"],
    uses: ["Ritratto", "Cibo", "Concerti", "Notte", "Dettagli"],
    ratings: [{ scenario: "Ritratto", rating: "Consigliato" }, { scenario: "Notte a mano libera", rating: "Consigliato" }, { scenario: "Street", rating: "Alternativa" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-50mm-f1-8-stm/",
  },
  {
    id: "rf-s-10-18", name: "RF-S 10-18mm F4.5-6.3 IS STM", tier: "Budget", owned: false,
    focalLength: "10–18mm", equivalent: "16–29mm", aperture: "f/4.5–6.3", stabilization: "IS ottico 4 stop",
    weight: "150 g", minFocus: "0,14 m AF", maxMagnification: "0,23× AF · 0,50× MF", indicativePrice: "circa €380",
    advantages: ["Campo molto ampio sulla R10", "Ultraleggero", "IS utile per interni e video"],
    disadvantages: ["Apertura modesta", "Richiede attenzione alle linee ai bordi"],
    uses: ["Architettura", "Paesaggio", "Interni", "Video", "Viaggi"],
    ratings: [{ scenario: "Architettura", rating: "Consigliato" }, { scenario: "Paesaggio", rating: "Consigliato" }, { scenario: "Astro", rating: "Economico" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-s-10-18mm-f4-5-6-3-is-stm/",
  },
  {
    id: "rf-s-55-210", name: "RF-S 55-210mm F5-7.1 IS STM", tier: "Budget", owned: false,
    focalLength: "55–210mm", equivalent: "88–336mm", aperture: "f/5–7.1", stabilization: "IS ottico 4,5 stop",
    weight: "270 g", minFocus: "0,73 m", maxMagnification: "0,28×", indicativePrice: "circa €430",
    advantages: ["Più portata con poco peso", "Prezzo accessibile", "IS ottico"],
    disadvantages: ["Poco luminoso", "AF e sfocato meno adatti a sport in luce scarsa"],
    uses: ["Animali", "Uccelli vicini", "Sport diurno", "Viaggi"],
    ratings: [{ scenario: "Animali", rating: "Economico" }, { scenario: "Sport diurno", rating: "Economico" }, { scenario: "Uccelli", rating: "Alternativa" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-s-55-210mm-f5-7-1-is-stm/",
  },
  {
    id: "rf-35", name: "RF 35mm F1.8 Macro IS STM", tier: "Medio", owned: false,
    focalLength: "35mm", equivalent: "56mm", aperture: "f/1.8", stabilization: "Hybrid IS 5 stop",
    weight: "305 g", minFocus: "0,17 m", maxMagnification: "0,50×", indicativePrice: "circa €560",
    advantages: ["Angolo naturale sulla R10", "Luminoso e stabilizzato", "Macro 0,5×"],
    disadvantages: ["Non è un vero 1:1", "AF STM non pensato per sport veloce"],
    uses: ["Street", "Cibo", "Viaggi", "Macro ambientata", "Video"],
    ratings: [{ scenario: "Street", rating: "Consigliato" }, { scenario: "Cibo", rating: "Consigliato" }, { scenario: "Video", rating: "Alternativa" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-35mm-f1-8-macro-is-stm/",
  },
  {
    id: "rf-85", name: "RF 85mm F2 Macro IS STM", tier: "Medio", owned: false,
    focalLength: "85mm", equivalent: "136mm", aperture: "f/2", stabilization: "Hybrid IS 5 stop",
    weight: "500 g", minFocus: "0,35 m", maxMagnification: "0,50×", indicativePrice: "circa €720",
    advantages: ["Ritratto molto pulito", "Ottima distanza di lavoro", "IS e macro 0,5×"],
    disadvantages: ["Inquadratura stretta sulla R10", "Più lento da ricomporre in spazi piccoli"],
    uses: ["Ritratto", "Macro", "Dettagli evento", "Cibo"],
    ratings: [{ scenario: "Ritratto", rating: "Consigliato" }, { scenario: "Macro", rating: "Alternativa" }, { scenario: "Eventi", rating: "Alternativa" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-85mm-f2-macro-is-stm/",
  },
  {
    id: "rf-24", name: "RF 24mm F1.8 Macro IS STM", tier: "Medio", owned: false,
    focalLength: "24mm", equivalent: "38mm", aperture: "f/1.8", stabilization: "IS ottico 5 stop",
    weight: "270 g", minFocus: "0,14 m", maxMagnification: "0,50×", indicativePrice: "circa €700",
    advantages: ["Luminoso per notte e astro", "Focale narrativa sulla R10", "Stabilizzato"],
    disadvantages: ["Non è ultragrandangolare su APS-C", "Prezzo superiore al 50mm"],
    uses: ["Via Lattea", "Street", "Viaggi", "Video", "Ambiente"],
    ratings: [{ scenario: "Via Lattea", rating: "Consigliato" }, { scenario: "Street", rating: "Consigliato" }, { scenario: "Video", rating: "Consigliato" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-24mm-f1-8-macro-is-stm/",
  },
  {
    id: "rf-100-400", name: "RF 100-400mm F5.6-8 IS USM", tier: "Premium", owned: false,
    focalLength: "100–400mm", equivalent: "160–640mm", aperture: "f/5.6–8", stabilization: "IS ottico 5,5 stop",
    weight: "635 g", minFocus: "0,88 m", maxMagnification: "0,41×", indicativePrice: "circa €780",
    advantages: ["Portata reale per fauna e sport", "Relativamente leggero", "AF Nano USM e IS"],
    disadvantages: ["Richiede buona luce", "f/8 a 400mm"],
    uses: ["Uccelli", "Animali", "Sport", "Luna", "Auto in pista"],
    ratings: [{ scenario: "Uccelli", rating: "Consigliato" }, { scenario: "Luna", rating: "Consigliato" }, { scenario: "Sport", rating: "Consigliato" }],
    sourceUrl: "https://www.canon-europe.com/lenses/rf-100-400mm-f5-6-8-is-usm/",
  },
];

export const allGearOptions: GearItem[] = lenses
  .filter((lens) => !lens.owned)
  .map((lens) => ({ id: lens.id, name: lens.name, kind: "Obiettivo", detail: `${lens.equivalent} eq. · ${lens.stabilization}`, owned: false }));
