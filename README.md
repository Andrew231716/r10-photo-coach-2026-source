# R10 Photo Coach

Scuola fotografica digitale interattiva dedicata alla Canon EOS R10.

## Stato

La Fase 1 include dashboard, Academy a cinque livelli, 23 tutorial completi, catalogo obiettivi, profilo attrezzatura e PWA. La Fase 2 aggiunge il simulatore EOS R10 rotabile, nove comandi interattivi e le procedure guidate “Mostrami cosa devo premere”. Progressi, tutorial completati e attrezzatura condividono ora uno stato coerente, salvato localmente e sincronizzato con Neon quando disponibile. AI Coach e analisi fotografie restano nelle fasi successive.

Le procedure del simulatore sono verificate sul manuale Canon EOS R10 per firmware 1.7.0 o successivo. Il modello 3D è uno schema didattico procedurale e non una riproduzione CAD.

## Avvio locale

```bash
npm install
npm run dev
```

Copia `.env.example` in `.env.local` e inserisci `DATABASE_URL` solo lato server. Senza questa variabile l'app continua a funzionare in modalità locale e conserva i dati nel browser.

## Database

Il backend usa Neon Postgres tramite `@neondatabase/serverless`. La tabella minima per lo stato anonimo del dispositivo viene creata automaticamente al primo accesso; `database/schema.sql` contiene anche lo schema completo predisposto per profili, contenuti e future funzioni. La connessione viene inizializzata solo a runtime, quindi la build non richiede credenziali.

Lo stato della connessione è disponibile su `/api/health`: restituisce `database: "not_configured"` finché `DATABASE_URL` non è configurata e `database: "connected"` dopo il collegamento. `/api/state` gestisce la sincronizzazione con fallback locale trasparente. Nessun servizio a pagamento è necessario per questa fase.

## Verifica

```bash
npm run typecheck
npm run build
```
