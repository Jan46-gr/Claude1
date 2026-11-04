import { hours, type Slot } from '../data/studio';

/** "16:15" → 975 */
export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** "09:00" → "9:00" */
export const fmt = (t: string) => t.replace(/^0/, '');

export const slotLabel = ([o, c]: Slot) => `${fmt(o)}–${fmt(c)}`;

/** Wochentag (0 = Montag) und Minuten seit Mitternacht in Europe/Berlin */
export function berlinNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  return { dayIndex, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export interface OpenStatus {
  open: boolean;
  closingSoon?: boolean;
  closesAt?: string;
  opensAt?: string;
  opensDay?: string;
}

export function getStatus(date = new Date()): OpenStatus {
  const { dayIndex, minutes } = berlinNow(date);

  for (const [o, c] of hours[dayIndex].slots) {
    if (minutes >= toMin(o) && minutes < toMin(c)) {
      return { open: true, closesAt: c, closingSoon: toMin(c) - minutes <= 45 };
    }
  }

  for (let offset = 0; offset < 8; offset++) {
    const d = (dayIndex + offset) % 7;
    for (const [o] of hours[d].slots) {
      if (offset > 0 || toMin(o) > minutes) {
        const opensDay = offset === 0 ? 'heute' : offset === 1 ? 'morgen' : `am ${hours[d].name}`;
        return { open: false, opensAt: o, opensDay };
      }
    }
  }
  return { open: false };
}

export function statusText(s: OpenStatus) {
  if (s.open) {
    return {
      label: s.closingSoon ? 'Schließt bald' : 'Jetzt geöffnet',
      detail: `bis ${fmt(s.closesAt!)} Uhr`,
    };
  }
  return {
    label: 'Gerade geschlossen',
    detail: s.opensAt ? `öffnet ${s.opensDay} um ${fmt(s.opensAt)} Uhr` : '',
  };
}

/** Summe der Öffnungsstunden pro Woche (aktuell 57,5) */
export const weeklyOpenHours = () =>
  hours.reduce((sum, d) => sum + d.slots.reduce((a, [o, c]) => a + toMin(c) - toMin(o), 0), 0) / 60;
