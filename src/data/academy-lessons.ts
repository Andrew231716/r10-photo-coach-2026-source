export type AcademyLesson = { concept: string; setup: string; exercise: string; question: string; choices: string[]; answer: number; explanation: string };

export const academyLessons: Record<string, AcademyLesson> = {
  tempo: {
    concept: "Il tempo di esposizione è l'intervallo in cui raccogli luce. Un tempo breve registra meno movimento; uno lungo può mostrare scie. Passare da 1/250 a 1/500 s dimezza la luce, a parità degli altri parametri.",
    setup: "Sulla ghiera scegli Tv e parti da 1/500 s con ISO Auto. Inquadra un soggetto in movimento in buona luce. Controlla l'esposizione: se l'obiettivo non apre abbastanza, serve più luce o un ISO maggiore.",
    exercise: "Fotografa lo stesso gesto a 1/500, 1/125 e 1/30 s. Appoggia bene la fotocamera e mantieni l'inquadratura. Ingrandisci le foto: distingui il movimento del soggetto dal tremolio dell'intera scena.",
    question: "Quale tempo tende a congelare meglio lo stesso movimento?", choices: ["1/30 s", "1/1000 s", "1/125 s"], answer: 1, explanation: "1/1000 s è l'intervallo più breve: il soggetto si sposta meno durante l'esposizione."
  },
  diaframma: {
    concept: "Il diaframma regola quanta luce passa. Un numero f piccolo indica un'apertura ampia. A parità di distanza e focale, aprire il diaframma riduce la profondità di campo; chiuderlo la aumenta.",
    setup: "Scegli Av e la massima apertura disponibile sul tuo obiettivo. Metti un oggetto vicino e uno sfondo distante. Metti a fuoco il primo oggetto. Non tutti gli obiettivi arrivano a f/1.8: usa il valore disponibile.",
    exercise: "Scatta dalla stessa posizione alla massima apertura, a f/5.6 e a f/8. Mantieni lo stesso punto AF. Confronta lo sfondo e controlla che il tempo scelto dalla fotocamera non causi mosso.",
    question: "A parità di tutto il resto, quale apertura aumenta la profondità di campo?", choices: ["f/2", "f/2.8", "f/8"], answer: 2, explanation: "f/8 chiude maggiormente il diaframma e amplia la zona apparentemente nitida."
  },
  iso: {
    concept: "L'ISO influenza la luminosità registrata senza aggiungere luce alla scena. ISO alti aiutano a mantenere tempi brevi, ma possono rendere più visibile il rumore e ridurre il margine nelle alte luci.",
    setup: "Scegli M, imposta tempo e diaframma adatti alla scena e osserva l'esposimetro cambiando ISO. Per soggetti in movimento puoi usare ISO Auto mantenendo tu il controllo di tempo e apertura.",
    exercise: "In una stanza fotografa un oggetto a ISO 400, 1600 e 6400. Per confrontare il rumore a luminosità simile, accorcia il tempo quando alzi ISO e usa un appoggio. Osserva ombre e dettagli al 100%.",
    question: "Se il tempo necessario è troppo lento per il soggetto, alzare ISO può aiutare?", choices: ["Sì, consente un tempo più breve a luminosità simile", "No, cambia solo il colore", "Sì, aggiunge luce alla scena"], answer: 0, explanation: "Puoi accorciare il tempo compensando con ISO, accettando il compromesso sul rumore."
  },
  esposizione: {
    concept: "Tempo, diaframma e ISO lavorano insieme. Uno stop equivale a raddoppiare o dimezzare l'esposizione luminosa o il relativo livello ISO. Parti dalla priorità creativa: movimento, profondità oppure qualità.",
    setup: "Scegli M per un soggetto fermo. Parti da ISO 100, f/5.6 e un tempo che dia una luminosità adatta alla scena. Leggi esposimetro e istogramma: la posizione corretta dipende anche dal soggetto.",
    exercise: "Da 1/125 s passa a 1/250 s mantenendo il diaframma. Raddoppia ISO e confronta la luminosità. Poi ripeti usando Av per capire quale parametro la fotocamera modifica automaticamente.",
    question: "Passi da 1/125 a 1/250 s con diaframma fisso. Come compensi?", choices: ["Dimezzi ISO", "Raddoppi ISO", "Non cambia nulla"], answer: 1, explanation: "Il tempo dimezzato raccoglie metà luce; raddoppiare ISO compensa la luminosità registrata."
  },
  "servo-af": {
    concept: "One-Shot AF è adatto a soggetti fermi: acquisisce il fuoco e lo mantiene mentre tieni attiva la messa a fuoco. Servo AF aggiorna il fuoco mentre cambia la distanza del soggetto.",
    setup: "Nelle impostazioni AF scegli One-Shot per un oggetto fermo. Per una persona che cammina passa a Servo AF e continua ad attivare la messa a fuoco mentre la segui. Usa un tempo abbastanza breve.",
    exercise: "Fotografa una persona che si avvicina lentamente, prima in One-Shot e poi in Servo. Confronta il fuoco sul viso in una sequenza di scatti. Ripeti in buona luce se l'AF fatica.",
    question: "Quale operazione AF scegli per un soggetto che si avvicina?", choices: ["One-Shot", "Fuoco bloccato sullo sfondo", "Servo AF"], answer: 2, explanation: "Servo aggiorna la distanza di messa a fuoco durante il movimento."
  },
  "eye-detection": {
    concept: "Il rilevamento occhi aiuta a collocare il fuoco sul volto, ma devi controllare il riquadro AF. Occhi piccoli, coperti o poco contrastati possono non essere riconosciuti.",
    setup: "Nelle opzioni AF scegli il tipo di soggetto appropriato e abilita il rilevamento occhi, quando disponibile nella configurazione AF scelta. Inquadra un volto ben visibile e controlla quale occhio viene agganciato.",
    exercise: "Scatta un ritratto frontale e uno di tre quarti. Controlla il riquadro prima dello scatto e ingrandisci l'occhio dopo. Se il rilevamento fallisce, seleziona un'area più precisa sul volto.",
    question: "Il riquadro AF è sullo sfondo. Cosa fai?", choices: ["Seleziono il soggetto o un'area AF più precisa", "Scatto comunque", "Cambio solo bilanciamento del bianco"], answer: 0, explanation: "Il riconoscimento non sostituisce il controllo del punto effettivamente scelto."
  },
  tracking: {
    concept: "Il tracking cerca di mantenere il soggetto selezionato nell'inquadratura. È diverso dal solo aggiornamento della distanza: riconoscimento, area iniziale e sfondo influenzano il risultato.",
    setup: "Usa Servo AF e una configurazione con inseguimento del soggetto. Seleziona chiaramente chi vuoi seguire, attiva AF e osserva se il riquadro resta sul soggetto durante lo spostamento.",
    exercise: "Segui una persona che cammina lateralmente davanti a uno sfondo semplice, poi più affollato. Confronta gli errori. Se perde il soggetto, riacquisiscilo e prova un'area iniziale più mirata.",
    question: "Il tracking passa a un'altra persona: qual è la prima azione utile?", choices: ["Chiudere sempre a f/22", "Riselezionare il soggetto voluto", "Alzare la saturazione"], answer: 1, explanation: "Occorre ripristinare la priorità sul soggetto corretto."
  },
  "aree-af": {
    concept: "Un'area piccola dà controllo su dove cercare il fuoco. Un'area ampia facilita l'acquisizione di un soggetto difficile da mantenere sotto un punto, ma può includere elementi indesiderati.",
    setup: "Prova AF a punto singolo su un oggetto fermo tra altri oggetti. Poi prova un'area ampia su un soggetto isolato in movimento. Controlla sempre il riquadro effettivo.",
    exercise: "Fotografa un oggetto tra rami o elementi vicini con area ampia e punto singolo. Confronta dove cade il fuoco e scegli la configurazione che rende ripetibile il risultato.",
    question: "Per un dettaglio fermo tra ostacoli, da quale area conviene partire?", choices: ["Sempre intera area", "Qualsiasi area è identica", "Punto singolo"], answer: 2, explanation: "Un punto mirato riduce la possibilità di mettere a fuoco un ostacolo."
  },
  terzi: {
    concept: "La griglia dei terzi divide il fotogramma in nove parti. Collocare soggetto o orizzonte sulle linee può dare equilibrio e spazio allo sguardo, ma anche una composizione centrale può funzionare.",
    setup: "Attiva la griglia di composizione se ti aiuta. Scegli un soggetto semplice e prova a posizionarlo su una linea verticale. Mantieni dritto l'orizzonte quando la scena lo richiede.",
    exercise: "Realizza tre foto: soggetto centrale, sul terzo sinistro e sul terzo destro. Confronta lo spazio verso cui guarda o si muove. Scegli quella che racconta meglio la scena e spiega perché.",
    question: "La regola dei terzi va applicata sempre?", choices: ["No, è uno strumento compositivo", "Sì, altrimenti la foto è sbagliata", "Solo con ISO bassi"], answer: 0, explanation: "La composizione dipende dall'intenzione: simmetria e centralità possono essere scelte efficaci."
  },
  prospettiva: {
    concept: "La prospettiva dipende dal punto di ripresa. Cambiare focale restando fermi modifica il campo inquadrato; spostarsi cambia i rapporti apparenti tra elementi vicini e lontani.",
    setup: "Trova un oggetto davanti a uno sfondo distante. Scatta vicino con una focale corta, poi allontanati e usa una focale più lunga per mantenere simile la dimensione del soggetto.",
    exercise: "Confronta le due immagini: quanto spazio occupa lo sfondo rispetto al soggetto? Ripeti da una posizione più bassa, senza cambiare focale, e osserva quali elementi si sovrappongono.",
    question: "Che cosa cambia direttamente la prospettiva?", choices: ["ISO", "Posizione della fotocamera", "Formato JPEG"], answer: 1, explanation: "La distanza e il punto di vista determinano i rapporti prospettici."
  },
  linee: {
    concept: "Strade, ombre e bordi possono guidare lo sguardo. Ripetizioni creano ritmo; un elemento diverso può diventare il punto d'interesse. Controlla dove conducono le linee e come escono dal fotogramma.",
    setup: "Cerca una fila di oggetti o una strada da un punto sicuro. Scegli un soggetto verso cui dirigere le linee e modifica leggermente altezza e posizione della fotocamera.",
    exercise: "Scatta una composizione in cui le linee portano al soggetto e una in cui portano fuori dalla scena. Confronta l'ordine di lettura. Cerca poi una ripetizione interrotta da un dettaglio.",
    question: "Una linea guida è utile soprattutto quando…", choices: ["È sempre al centro", "È perfettamente orizzontale", "Dirige l'attenzione verso un elemento significativo"], answer: 2, explanation: "Il suo valore dipende da come organizza lo sguardo nella scena."
  },
  sfondo: {
    concept: "Uno sfondo luminoso o affollato può rubare attenzione. Prima di cercare più sfocato, controlla bordi, sovrapposizioni, colori e oggetti che sembrano uscire dalla testa del soggetto.",
    setup: "Inquadra il soggetto e osserva prima i quattro bordi. Spostati di mezzo passo, abbassati o alzati per separarlo dagli elementi di disturbo. Aumenta la distanza tra soggetto e sfondo quando possibile.",
    exercise: "Fai una foto iniziale, una cambiando posizione e una aumentando la distanza dallo sfondo. Scegli la più pulita senza basarti soltanto sulla quantità di sfocato.",
    question: "Qual è una prima soluzione a un palo dietro la testa?", choices: ["Spostare il punto di ripresa", "Aumentare ISO", "Scattare in raffica"], answer: 0, explanation: "Un piccolo spostamento può eliminare la sovrapposizione già in ripresa."
  },
  "golden-hour": {
    concept: "Quando il sole è basso la luce può essere calda e radente, con ombre lunghe. Nuvole e orientamento cambiano molto il risultato: osserva la luce sul soggetto, non soltanto l'orario.",
    setup: "Metti il soggetto prima di fronte alla luce e poi di lato. Usa Av con un'apertura adatta alla profondità desiderata. Controlla tempo e alte luci durante il rapido cambiamento di luminosità.",
    exercise: "Scatta tre immagini con luce frontale, laterale e dietro al soggetto. Confronta volume del viso, ombre e separazione dallo sfondo. Evita di guardare direttamente il sole.",
    question: "La luce laterale tende a evidenziare…", choices: ["Solo il rumore", "Volume e texture", "La velocità della scheda"], answer: 1, explanation: "Il passaggio tra luce e ombra rende più leggibili le forme."
  },
  controluce: {
    concept: "In controluce il soggetto può risultare scuro rispetto allo sfondo. Decidi se vuoi una silhouette o dettagli sul soggetto: una scena molto contrastata può superare ciò che il sensore registra in un solo scatto.",
    setup: "Controlla istogramma e avviso alte luci. In Av prova la compensazione dell'esposizione: aumenta per schiarire il soggetto, riduci per proteggere lo sfondo. Il risultato dipende dalla scena.",
    exercise: "Crea una silhouette con forma riconoscibile, poi una versione con il soggetto più chiaro. Confronta quali zone perdono dettaglio. Prova un pannello bianco per riflettere luce sul soggetto.",
    question: "Schiarire molto il soggetto in controluce può…", choices: ["Garantire tutto il dettaglio", "Eliminare ogni ombra", "Bruciare le alte luci dello sfondo"], answer: 2, explanation: "Aumentare l'esposizione può superare il limite registrabile nelle zone già luminose."
  },
  notte: {
    concept: "Di notte separa due problemi: movimento della fotocamera e movimento del soggetto. Il treppiede risolve il primo, ma una persona che si muove può risultare mossa anche con la fotocamera ferma.",
    setup: "Per una scena immobile usa un supporto stabile, autoscatto e ISO basso, allungando il tempo. A mano libera scegli invece un tempo sostenibile e aumenta ISO quanto necessario.",
    exercise: "Fotografa una strada illuminata prima da un appoggio, poi a mano libera. Confronta nitidezza, rumore e scie. Controlla il fuoco ingrandendo un dettaglio contrastato.",
    question: "Il treppiede congela una persona che cammina?", choices: ["No, serve anche un tempo adatto", "Sì, sempre", "Solo in JPEG"], answer: 0, explanation: "Il supporto elimina il movimento della fotocamera, non quello del soggetto."
  },
  "lunga-esposizione": {
    concept: "Un'esposizione lunga somma il movimento nel tempo: acqua e nuvole diventano morbide, le luci tracciano scie. Un filtro ND riduce la luce quando vuoi tempi lunghi anche di giorno.",
    setup: "Usa un supporto stabile e autoscatto. Componi e metti a fuoco prima di applicare un filtro molto scuro. In M parti da ISO basso e un diaframma moderato, poi adatta il tempo alla luminosità.",
    exercise: "Fotografa acqua o traffico da una posizione sicura a 1/4, 1 e 4 secondi, compensando l'esposizione quando possibile. Confronta il disegno del movimento e cerca vibrazioni negli elementi fermi.",
    question: "A cosa serve un filtro ND?", choices: ["Aumentare la velocità AF", "Ridurre la luce che entra", "Ingrandire il soggetto"], answer: 1, explanation: "Riducendo la luce puoi usare tempi più lunghi a parità di ISO e apertura."
  },
  astro: {
    concept: "Le stelle si spostano apparentemente nel cielo. Il tempo limite per averle puntiformi dipende da focale, direzione e livello di ingrandimento. Le regole numeriche sono soltanto punti di partenza.",
    setup: "Usa un treppiede, modalità M, apertura ampia e fuoco manuale. Ingrandisci una stella luminosa sul display e cerca il punto più piccolo. Parti da pochi secondi e ISO abbastanza alto da valutare lo scatto.",
    exercise: "Realizza esposizioni di 4, 8 e 15 secondi con la stessa focale. Ingrandisci centro e bordi: individua quando iniziano le scie. Salva una sequenza omogenea se vuoi in seguito sperimentare lo stacking.",
    question: "Come controlli se il tempo è troppo lungo?", choices: ["Dal nome del file", "Dal colore della fotocamera", "Ingrandendo le stelle e cercando scie"], answer: 2, explanation: "Il controllo dell'immagine è più affidabile di un tempo universale."
  },
  sport: {
    concept: "Una foto sportiva nasce anche dall'anticipo: posizione, sfondo e momento contano quanto la raffica. Un tempo rapido limita il mosso, mentre Servo AF segue il cambiamento di distanza.",
    setup: "Parti da Tv o M con ISO Auto, Servo AF e un tempo breve, ad esempio 1/1000 s in buona luce. Scegli l'area AF in base alla prevedibilità del movimento. Regola poi il tempo sullo sport reale.",
    exercise: "Scegli un gesto ripetibile e scatta brevi raffiche intorno al momento decisivo. Confronta fuoco, posizione del corpo e sfondo. Ripeti anticipando leggermente lo scatto invece di allungare sempre la raffica.",
    question: "Per migliorare il momento catturato conviene…", choices: ["Osservare e anticipare il gesto", "Tenere premuto senza osservare", "Usare sempre il tempo più lungo"], answer: 0, explanation: "La previsione del gesto aumenta la probabilità di catturare un momento significativo."
  },
  professionale: {
    concept: "Un metodo ripetibile parte dal risultato richiesto: soggetto, destinazione delle foto, tempi e immagini indispensabili. Una checklist riduce le dimenticanze e rende più chiara la selezione finale.",
    setup: "Scrivi un breve brief e una lista di cinque scatti. Controlla batteria, scheda, obiettivo, formato e impostazioni AF. Prevedi una soluzione per luce o meteo diversi da quelli attesi.",
    exercise: "Realizza una mini serie di cinque immagini coerenti. Copia i file su due supporti distinti e verifica che si aprano prima di cancellare la scheda. Seleziona tre foto spiegando perché soddisfano il brief.",
    question: "Quando è prudente liberare la scheda dopo un lavoro?", choices: ["Appena finito di scattare", "Dopo avere verificato copie separate", "Dopo aver visto una miniatura"], answer: 1, explanation: "Copie separate e verificate riducono il rischio di perdere gli originali."
  }
};
