export type CameraView = "perspective" | "front" | "rear" | "left" | "right" | "top";

export type CameraControlId =
  | "mode-dial"
  | "main-dial"
  | "shutter"
  | "af-start"
  | "quick-control"
  | "menu"
  | "info"
  | "multi-controller"
  | "focus-switch";

export type CameraControl = {
  id: CameraControlId;
  name: string;
  label: string;
  view: CameraView;
  position: [number, number, number];
  function: string;
  when: string;
  example: string;
};

export const cameraControls: CameraControl[] = [
  {
    id: "mode-dial",
    name: "Ghiera modalità",
    label: "MODE",
    view: "top",
    position: [-1.25, 1.36, -0.12],
    function: "Seleziona le modalità Base, Creative, C1/C2 e registrazione video.",
    when: "Prima di impostare esposizione e autofocus: decide quali parametri controlli tu.",
    example: "Scegli Av per controllare il diaframma mentre la R10 calcola il tempo.",
  },
  {
    id: "main-dial",
    name: "Ghiera principale",
    label: "MAIN",
    view: "top",
    position: [0.82, 1.34, 0.46],
    function: "Modifica il parametro principale della modalità attiva.",
    when: "In Av regola il diaframma; in Tv regola il tempo; nei menu cambia scheda o valore.",
    example: "Con RF 50mm in Av, ruotala fino a f/2.8 per un ritratto con sfondo morbido.",
  },
  {
    id: "shutter",
    name: "Pulsante di scatto",
    label: "SCATTO",
    view: "top",
    position: [1.57, 1.19, 0.69],
    function: "A metà corsa attiva messa a fuoco e misurazione; a fondo registra la foto.",
    when: "Ogni volta che vuoi preparare il fuoco prima di catturare l'istante.",
    example: "Premi a metà sull'occhio, controlla il riquadro AF, poi completa la pressione.",
  },
  {
    id: "af-start",
    name: "Pulsante AF-ON",
    label: "AF-ON",
    view: "rear",
    position: [1.18, 0.78, -0.84],
    function: "Avvia l'autofocus; può essere personalizzato per separare fuoco e scatto.",
    when: "Sport, animali e tracking, soprattutto con messa a fuoco sul pulsante posteriore.",
    example: "Tienilo premuto in Servo AF mentre segui un atleta, poi scatta al momento giusto.",
  },
  {
    id: "quick-control",
    name: "Quick Control / SET",
    label: "Q / SET",
    view: "rear",
    position: [0.34, -0.33, -0.87],
    function: "Apre il pannello rapido e conferma le impostazioni selezionate.",
    when: "Per cambiare ISO, AF, bilanciamento e scatto senza entrare nel menu completo.",
    example: "Premi Q, seleziona Operazione AF con il joystick e scegli Servo AF.",
  },
  {
    id: "menu",
    name: "Pulsante MENU",
    label: "MENU",
    view: "rear",
    position: [-1.48, 0.92, -0.84],
    function: "Apre il menu principale e torna alla schermata di scatto.",
    when: "Per configurare rilevamento soggetto, Eye Detection e preferenze della fotocamera.",
    example: "MENU → AF → Eye detection → Enable.",
  },
  {
    id: "info",
    name: "Pulsante INFO",
    label: "INFO",
    view: "rear",
    position: [-1.48, -0.68, -0.84],
    function: "Cambia le informazioni mostrate; nel menu passa tra i gruppi di schede principali.",
    when: "Quando vuoi semplificare il display o raggiungere rapidamente il gruppo AF.",
    example: "Nel MENU premi INFO finché è attiva la scheda Autofocus.",
  },
  {
    id: "multi-controller",
    name: "Multi-controller / joystick",
    label: "JOYSTICK",
    view: "rear",
    position: [0.82, 0.42, -0.89],
    function: "Sposta il punto o la zona AF, sceglie il soggetto e conferma premendo al centro.",
    when: "Per posizionare con precisione il fuoco senza togliere l'occhio dal mirino.",
    example: "Con Whole area AF, spostalo verso l'occhio che vuoi privilegiare.",
  },
  {
    id: "focus-switch",
    name: "Selettore AF/MF",
    label: "AF / MF",
    view: "front",
    position: [-1.63, -0.26, 0.82],
    function: "Passa tra autofocus e fuoco manuale con obiettivi RF privi di selettore dedicato.",
    when: "Astro, macro o situazioni in cui l'autofocus non trova un soggetto affidabile.",
    example: "Per la Via Lattea passa a MF, ingrandisci una stella e rifinisci il fuoco.",
  },
];

export type CoachStep = {
  controlId: CameraControlId;
  title: string;
  instruction: string;
  menuPath?: string[];
  check: string;
};

export type CoachGuide = {
  id: "portrait-av" | "sport-servo" | "manual-focus";
  title: string;
  prompt: string;
  steps: CoachStep[];
};

export const coachGuides: CoachGuide[] = [
  {
    id: "portrait-av",
    title: "Ritratto Av + occhi",
    prompt: "Imposta Av, f/2.8 ed Eye Detection",
    steps: [
      {
        controlId: "mode-dial",
        title: "Passa alla modalità Av",
        instruction: "Ruota la ghiera modalità finché l'indice indica Av.",
        check: "Nel display deve comparire Av.",
      },
      {
        controlId: "main-dial",
        title: "Imposta f/2.8",
        instruction: "Con il tuo RF 50mm F1.8, ruota la ghiera principale fino a f/2.8.",
        check: "Controlla che 2.8 non lampeggi e verifica il tempo scelto dalla fotocamera.",
      },
      {
        controlId: "menu",
        title: "Attiva il tracking del soggetto",
        instruction: "Apri MENU e imposta il tracking prima del rilevamento occhi.",
        menuPath: ["MENU", "AF", "Subject tracking", "On"],
        check: "Il tracking deve essere On: senza tracking il riquadro dell'occhio non viene mostrato.",
      },
      {
        controlId: "info",
        title: "Seleziona Persone",
        instruction: "Nel gruppo AF scegli il tipo di soggetto da rilevare.",
        menuPath: ["AF", "Subject to detect", "People"],
        check: "Subject to detect deve indicare People.",
      },
      {
        controlId: "quick-control",
        title: "Abilita Eye Detection",
        instruction: "Seleziona Eye detection, scegli Enable e conferma con SET.",
        menuPath: ["AF", "Eye detection", "Enable"],
        check: "Inquadrando il volto deve apparire un riquadro attorno all'occhio.",
      },
    ],
  },
  {
    id: "sport-servo",
    title: "Sport con Servo AF",
    prompt: "Prepara la R10 per seguire un atleta",
    steps: [
      {
        controlId: "focus-switch",
        title: "Verifica AF",
        instruction: "Porta il selettore anteriore su AF.",
        check: "Il display non deve mostrare MF.",
      },
      {
        controlId: "quick-control",
        title: "Seleziona Servo AF",
        instruction: "Premi Q, scegli Operazione AF e imposta Servo AF.",
        check: "Servo AF deve rimanere attivo nella schermata di scatto.",
      },
      {
        controlId: "af-start",
        title: "Segui il soggetto",
        instruction: "Tieni premuto AF-ON mentre mantieni il riquadro sul soggetto.",
        check: "Il punto AF diventa blu quando il fuoco è raggiunto in Servo AF.",
      },
      {
        controlId: "shutter",
        title: "Scatta la sequenza",
        instruction: "Continua a seguire il movimento e premi il pulsante di scatto a fondo.",
        check: "Non interrompere il movimento della fotocamera durante la raffica.",
      },
    ],
  },
  {
    id: "manual-focus",
    title: "Fuoco manuale",
    prompt: "Passa da autofocus a manual focus",
    steps: [
      {
        controlId: "focus-switch",
        title: "Seleziona MF",
        instruction: "Con un obiettivo RF senza selettore AF/MF, sposta il selettore della R10 su MF.",
        check: "Sul display deve comparire l'indicazione MF.",
      },
      {
        controlId: "menu",
        title: "Se il selettore non risponde",
        instruction: "Verifica che il selettore AF/MF del corpo sia abilitato nel menu Setup.",
        menuPath: ["MENU", "Set-up", "Focus mode switch (AF/MF)", "Enable"],
        check: "Questa voce riguarda gli obiettivi RF privi di selettore di messa a fuoco.",
      },
    ],
  },
];
