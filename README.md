# SFG Studio – Website-Vorschlag

Neue Website für das **SFG Studio für Fitness & Gesundheit** (Mülheim/Mosel), das Fitnessstudio des
SFG Bernkastel-Kues e.V. Gebaut als schnelle, statische Seite mit Astro.

## Schnellstart

```bash
npm install
npm run dev       # Entwicklungsserver auf http://localhost:4321
npm run build     # statische Seite nach dist/
npm run preview   # gebaute Seite lokal ansehen
npm run check     # Typprüfung
```

Voraussetzung: Node.js ≥ 22.23.4.

## Inhalte pflegen

Fast alles, was sich ändert, steht in **einer Datei**: [`src/data/studio.ts`](src/data/studio.ts)

| Was | Wo in `studio.ts` |
| --- | --- |
| Öffnungszeiten | `hours` – wirkt auf Live-Status, Zeitleiste, Footer und Google-Daten |
| Preise & Tarife | `fees`, `tariffs`, `extras`, `dropIn` – wirkt auf Karten und Beitragsrechner |
| Kontaktdaten | `studio`, `verein` |
| Aktuelles | `news` |
| Wellengang-Kurszeiten | `wellengangCourses` |

## Aufbau

```
src/
  data/studio.ts          Inhalte (Single Source of Truth)
  lib/hours.ts            Öffnungslogik (Europe/Berlin) – geteilt von Server & Browser
  layouts/                Base (Head, SEO, JSON-LD), Legal
  components/             Header, Footer, Status, Logo, Icon, PageHero, WaveLab
  components/home/        Abschnitte der Startseite
  pages/                  /, /wellengang, /scaneca, /probetraining, /impressum, /datenschutz, 404
  scripts/motion.ts       GSAP + ScrollTrigger + Lenis (respektiert „Bewegung reduzieren“)
  scripts/forms.ts        Formularversand über Netlify Forms
  assets/                 Logo (vektorisiert) und Fotos (werden beim Build optimiert)
```

## Technik

- **Astro 7** – statisches HTML, nur so viel JavaScript wie nötig
- **GSAP** (ScrollTrigger, SplitText) und **Lenis** für Animationen und weiches Scrollen
- **Schriften lokal** (Archivo Variable, JetBrains Mono) – keine Verbindung zu Google Fonts
- **Bilder** automatisch als WebP in passenden Größen
- **Formulare** über Netlify Forms (kein eigenes Backend), Spamschutz per Honeypot
- **SEO**: strukturierte Daten (`ExerciseGym` inkl. Öffnungszeiten), Open-Graph-Bild, Canonicals
- **Barrierefreiheit**: Kontraste nach WCAG AA (axe-geprüft), Tastaturbedienung, Skip-Link,
  reduzierte Bewegung

## Deployment (Netlify)

`netlify.toml` ist vorbereitet. Repository verbinden – Build-Befehl `npm run build`, Ordner `dist`.
Die Formulare „kontakt“ und „probetraining“ werden von Netlify automatisch erkannt.

Offene Punkte für den Pitch: siehe [`docs/PITCH.md`](docs/PITCH.md).
