# HMQ EMG - Geräteverwaltung

Interne Web-App für die HMQ AG zur Verwaltung von Erschütterungsmessgeräten.

## Technologie-Stack

- **Framework:** Next.js 14 (App Router)
- **Sprache:** TypeScript (strict mode)
- **Styling:** TailwindCSS + ShadCN UI
- **Authentifizierung:** Supabase Auth
- **Datenbank:** Supabase (PostgreSQL)
- **Karten:** Leaflet (geplant)

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopieren Sie `.env.local.example` zu `.env.local` und tragen Sie Ihre Supabase-Credentials ein:

```bash
cp .env.local.example .env.local
```

Benötigte Variablen:
- `NEXT_PUBLIC_SUPABASE_URL` - Ihre Supabase Projekt-URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Ihr Supabase Anon Key

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentifizierungs-Seiten
│   │   ├── login/
│   │   └── passwort-vergessen/
│   └── (dashboard)/       # Geschützter Bereich
│       ├── geraete/       # Geräteverwaltung
│       ├── auftraege/     # Auftragsverwaltung
│       ├── einsaetze/     # Einsatzübersicht
│       ├── karte/         # Kartenansicht
│       └── admin/         # Administration (nur für Admins)
├── components/
│   ├── ui/                # ShadCN UI Komponenten
│   ├── layout/            # Layout-Komponenten
│   └── shared/            # Wiederverwendbare Komponenten
├── lib/
│   ├── supabase/          # Supabase Client-Konfiguration
│   ├── actions/           # Server Actions
│   ├── hooks/             # React Hooks
│   └── validations/       # Zod Validation Schemas
└── types/
    └── database.ts        # TypeScript Typen für die Datenbank
```

## Benutzerrollen

- **User:** Kann Geräte, Aufträge und Einsätze verwalten
- **Admin:** Zusätzlich Zugriff auf Stammdaten und Benutzerverwaltung

## Scripts

- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktions-Build erstellen
- `npm run start` - Produktions-Server starten
- `npm run lint` - Linting ausführen
