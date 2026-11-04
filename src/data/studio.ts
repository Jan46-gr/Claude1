/**
 * Zentrale Inhalte des SFG Studios.
 * Öffnungszeiten, Preise und Kontaktdaten werden NUR hier gepflegt –
 * alle Seiten, der Live-Status und die Google-Daten (JSON-LD) lesen von hier.
 */

export const studio = {
  name: 'SFG Studio',
  fullName: 'SFG Studio für Fitness & Gesundheit',
  operator: 'Das Fitnessstudio des Vereins für Sport, Freizeit & Gesundheit Bernkastel-Kues e.V.',
  street: 'Industriestraße 2',
  zip: '54486',
  city: 'Mülheim (Mosel)',
  country: 'DE',
  phone: '06534 9494300',
  phoneHref: 'tel:+4965349494300',
  email: 'studio@sfg-bks.de',
  founded: 1991,
  movedToMuelheim: 2022,
  facebook: 'https://www.facebook.com/p/SFG-Studio-f%C3%BCr-Fitness-und-Gesundheit-100054265460528/',
  mapsQuery: 'SFG Studio, Industriestraße 2, 54486 Mülheim (Mosel)',
} as const;

export const verein = {
  name: 'SFG Bernkastel-Kues e.V.',
  longName: 'Verein für Sport, Freizeit & Gesundheit Bernkastel-Kues e.V.',
  street: 'Peter-Kremer-Weg 7',
  zip: '54470',
  city: 'Bernkastel-Kues',
  phone: '06531 91199',
  phoneHref: 'tel:+49653191199',
  fax: '06531 91197',
  email: 'info@sfg-bks.de',
  web: 'https://sfg-bks.de',
  jobs: 'https://sfg-bks.de/category/jobs/',
} as const;

/* ---------- Öffnungszeiten ---------- */

export type Slot = readonly [open: string, close: string];
export interface Day {
  key: string;
  name: string;
  short: string;
  /** schema.org-Tagesname für JSON-LD */
  schema: string;
  slots: readonly Slot[];
}

/** Index 0 = Montag */
export const hours: readonly Day[] = [
  { key: 'mo', name: 'Montag', short: 'Mo', schema: 'Monday', slots: [['09:00', '13:00'], ['16:15', '21:15']] },
  { key: 'di', name: 'Dienstag', short: 'Di', schema: 'Tuesday', slots: [['09:00', '13:00'], ['14:30', '21:15']] },
  { key: 'mi', name: 'Mittwoch', short: 'Mi', schema: 'Wednesday', slots: [['09:00', '13:00'], ['16:15', '21:15']] },
  { key: 'do', name: 'Donnerstag', short: 'Do', schema: 'Thursday', slots: [['09:00', '13:00'], ['16:15', '21:15']] },
  { key: 'fr', name: 'Freitag', short: 'Fr', schema: 'Friday', slots: [['09:00', '13:00'], ['14:30', '21:15']] },
  { key: 'sa', name: 'Samstag', short: 'Sa', schema: 'Saturday', slots: [['09:00', '14:00']] },
  { key: 'so', name: 'Sonntag', short: 'So', schema: 'Sunday', slots: [['09:00', '13:00']] },
];

export const hoursNote = 'An Feiertagen können sich die Öffnungszeiten ändern.';

/** „Good Morning“-Tarif: Mo–Fr 9–13 Uhr + Wochenende ohne Begrenzung */
export const goodMorningWindow: readonly (readonly Slot[] | 'all')[] = [
  [['09:00', '13:00']],
  [['09:00', '13:00']],
  [['09:00', '13:00']],
  [['09:00', '13:00']],
  [['09:00', '13:00']],
  'all',
  'all',
];

/* ---------- Preise ---------- */

export const fees = {
  aufnahme: 12,
  grundbeitrag: 9,
} as const;

export interface Tariff {
  id: string;
  name: string;
  price: number;
  tagline: string;
  audience: string;
  features: string[];
  featured?: boolean;
}

export const tariffs: Tariff[] = [
  {
    id: 'voll',
    name: 'Vollmitgliedschaft',
    price: 39.9,
    tagline: 'Trainieren, wann immer wir geöffnet haben.',
    audience: 'Für alle',
    features: ['Studionutzung ohne zeitliche Begrenzung', 'Monatlich kündbar', 'Ruhendstellung möglich'],
    featured: true,
  },
  {
    id: 'morning',
    name: 'Good Morning',
    price: 22,
    tagline: 'Für Frühaufsteher und Wochenend-Athleten.',
    audience: 'Mo–Fr 9–13 Uhr + Wochenende',
    features: ['Mo–Fr 9:00–13:00 Uhr', 'Samstag & Sonntag ohne zeitliche Begrenzung', 'Monatlich kündbar'],
  },
  {
    id: 'ermaessigt',
    name: 'Ermäßigt',
    price: 19.9,
    tagline: 'Für alle, die gerade in Ausbildung sind.',
    audience: 'Studierende · Azubis · Schüler · DRK-Klienten',
    features: ['Für Studierende, Azubis & Schüler', 'Für DRK-Klienten', 'Monatlich kündbar'],
  },
];

export interface Extra {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export const extras: Extra[] = [
  { id: 'plan', name: 'Trainingsplanerstellung', price: 18, unit: 'einmalig', description: 'Individueller Plan inkl. Flexibilitätstest' },
  { id: 'bia', name: 'BIA-Analyse', price: 18, unit: 'einmalig', description: 'Muskel-, Wasser- & Fettanteil im Körper' },
  { id: 'scan', name: 'SCANECA 3D-Körperscan', price: 20, unit: 'pro Scan', description: 'Maße & Proportionen in 3D dokumentieren' },
];

export const dropIn = [
  { name: 'Einmalnutzung', price: 8 },
  { name: '10er-Karte', price: 75 },
] as const;

export const contractFacts = ['Monatlich kündbar', 'Keine Jahresverträge', 'Ruhendstellung möglich'] as const;

/* ---------- Trainingsbereiche ---------- */

export const machines = [
  'Beinpresse',
  'Schulterpresse',
  'Beinheber & -beuger',
  '3D-Rudern',
  'Lat-Zug',
  'Hüftadduktor & -abduktor',
  'Butterfly',
  'Rhomboideus-Maschine',
  'Bauchpresse',
  'Rückenstrecker',
  'Rotationsmaschine',
] as const;

/* ---------- Aktuelles ---------- */

export interface NewsItem {
  tag: string;
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
}

export const news: NewsItem[] = [
  {
    tag: 'Neu im Studio',
    title: 'SCANECA 3D-Körperanalyse',
    text: 'Deinen Körper in 3D vermessen und Fortschritte sichtbar machen. Sprich uns an!',
    href: '/scaneca',
    linkLabel: 'Mehr zum Scan',
  },
  {
    tag: 'Demnächst',
    title: 'Reboots kommt',
    text: 'Bald in unserem Studio – weitere Infos folgen. Hier kannst du dich schon mal schlau machen.',
    href: 'https://reboots.com/',
    linkLabel: 'reboots.com',
    external: true,
  },
  {
    tag: 'Jobs',
    title: 'Sportlicher Job gesucht?',
    text: 'Als vereinsgeführtes Studio suchen wir immer tatkräftige Unterstützung.',
    href: verein.jobs,
    linkLabel: 'Zu den Jobs',
    external: true,
  },
  {
    tag: 'Wir suchen',
    title: 'Reinigungskraft (1–2× pro Woche)',
    text: 'Du bist zuverlässig und hast ein paar Stunden pro Woche Zeit? Melde dich gerne.',
    href: 'mailto:braun@sfg-bks.de',
    linkLabel: 'braun@sfg-bks.de',
  },
];

/* ---------- Wellengang ---------- */

export const wellengangCourses = [
  { day: 'Montag', time: '09:30–10:30' },
  { day: 'Montag', time: '19:00–20:00' },
  { day: 'Dienstag', time: '09:30–10:30' },
  { day: 'Mittwoch', time: '19:00–20:00' },
] as const;

/* ---------- Helfer ---------- */

export const euro = (n: number, opts: { decimals?: boolean } = {}) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: opts.decimals === false && Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

export const fullAddress = `${studio.street}, ${studio.zip} ${studio.city}`;
