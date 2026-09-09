export const HOTEL_TIMEZONE = 'Europe/Athens';
export function hotelToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HOTEL_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}
export function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
// Ordinals use UTC calendar components, never visitor-local timestamp differences.
export function ordinal(value: string): number {
  if (!isDate(value)) throw new Error('Choose a valid calendar date.');
  const [year, month, day] = value.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}
export function addDays(value: string, days: number) { return new Date((ordinal(value) + days) * 86400000).toISOString().slice(0, 10); }
export const nightsBetween = (arrival: string, departure: string) => ordinal(departure) - ordinal(arrival);
export function occupiedNights(arrival: string, departure: string) { return Array.from({ length: Math.max(0, nightsBetween(arrival, departure)) }, (_, i) => addDays(arrival, i)); }
export const overlaps = (a: string, b: string, c: string, d: string) => a < d && c < b;
export function dateLabel(value: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) { return isDate(value) ? new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`)) : 'Choose a date'; }
export type Stay = { arrival: string; departure: string; adults: number; children: number };
export function stayErrors(stay: Stay, today: string, capacity = 4): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!isDate(stay.arrival)) errors.arrival = 'Choose a valid arrival date.';
  else if (stay.arrival < today) errors.arrival = 'Arrival cannot be before the hotel’s current date.';
  else if (stay.arrival > addDays(today, 365)) errors.arrival = 'Choose an arrival within the next 365 days.';
  if (!isDate(stay.departure)) errors.departure = 'Choose a valid departure date.';
  else if (stay.departure > addDays(today, 366)) errors.departure = 'Departure must be within 366 days of today.';
  if (isDate(stay.arrival) && isDate(stay.departure)) {
    const count = nightsBetween(stay.arrival, stay.departure);
    if (count < 1) errors.departure = 'Departure must be after arrival, for at least one night.';
    if (count > 14) errors.departure = 'Choose a stay of 1–14 nights.';
  }
  if (!Number.isInteger(stay.adults) || stay.adults < 1 || stay.adults > 4) errors.adults = 'Choose 1–4 adults; at least one adult is required.';
  if (!Number.isInteger(stay.children) || stay.children < 0 || stay.children > 3) errors.children = 'Choose 0–3 children, ages 2–11.';
  if (!errors.adults && !errors.children && stay.adults + stay.children > capacity) errors.guests = `This room accommodates up to ${capacity} guests. Choose a larger room or fewer guests.`;
  return errors;
}
