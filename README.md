# R10 Photo Coach

Scuola fotografica digitale interattiva dedicata alla Canon EOS R10.

## Stato

Dashboard, Academy a cinque livelli, 23 tutorial, catalogo obiettivi, profilo attrezzatura, PWA, simulatore EOS R10 rotabile con procedure guidate, e Photo Coach con analisi privata sul dispositivo. Progressi e attrezzatura si salvano in locale e si sincronizzano con Neon quando `DATABASE_URL` è disponibile.

Le procedure del simulatore sono verificate sul manuale Canon EOS R10 per firmware 1.7.0 o successivo. Il modello 3D è uno schema didattico procedurale e non una riproduzione CAD.

## Avvio locale

```bash
npm install
npm run dev
```

Copia `.env.example` in `.env.local` e inserisci `DATABASE_URL` solo lato server. Senza questa variabile l'app continua a funzionare in modalità locale e conserva i dati nel browser.

Opzionale: `NEXT_PUBLIC_SITE_URL` per sitemap, robots e Open Graph assoluti in produzione.

## Database

Il backend usa Neon Postgres tramite `@neondatabase/serverless`. La tabella minima per lo stato anonimo del dispositivo viene creata automaticamente al primo accesso; `database/schema.sql` contiene anche lo schema completo predisposto per profili, contenuti e future funzioni. La connessione viene inizializzata solo a runtime, quindi la build non richiede credenziali.

Lo stato della connessione è disponibile su `/api/health`. `/api/state` gestisce la sincronizzazione con fallback locale trasparente.

## Verifica

```bash
npm run typecheck
npm run build
```

## Deploy Vercel

Il progetto punta a Next.js (`vercel.json`). Su Vercel devono essere presenti almeno `DATABASE_URL` (Neon) e, consigliato, `NEXT_PUBLIC_SITE_URL` con l’URL di produzione.
