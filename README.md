# MOVETOS Co-Marketing

Marketing-Repository fuer MOVETOS — Smart Infrastructure Security. Enthaelt die Marketing-Website, die Kontaktformular-API und Unternehmensunterlagen.

## Projektstruktur

```
movetos-co-marketing/
├── website/          # Astro + React + Tailwind Marketing-Website
├── contact-api/      # Express.js API fuer das Kontaktformular (SMTP)
├── mov-unterlagen/   # Produktpraesentationen und Unternehmensdokumente
└── create_presentation.py  # Script zur Praesentation-Generierung
```

## Website

Die Marketing-Website basiert auf **Astro 5** mit **React** und **Tailwind CSS 4**.

### Setup

```bash
cd website
npm install
npm run dev       # Lokaler Dev-Server auf localhost:4321
npm run build     # Produktions-Build nach ./dist/
npm run preview   # Build lokal testen
```

## Contact API

Express.js-basierte API, die Kontaktanfragen per SMTP als E-Mail versendet.

### Setup

```bash
cd contact-api
cp .env.example .env   # SMTP-Zugangsdaten konfigurieren
npm install
npm run dev            # Server mit Auto-Reload starten
npm start              # Produktions-Server starten
```

## Unterlagen

Im Ordner `mov-unterlagen/` befinden sich:

- Produktpraesentationen (PPTX)
- Unternehmensuebersichten (PDF)
- Smart Infrastructure Security Dokumentation

## Tech-Stack

| Komponente   | Technologie                    |
|:-------------|:-------------------------------|
| Website      | Astro 5, React 19, Tailwind 4  |
| Contact API  | Express.js, Nodemailer         |
| Hosting      | Statisch (Website) + Node.js   |

## Lizenz

Proprietaer — MOVETOS GmbH. Alle Rechte vorbehalten.
