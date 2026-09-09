import { nightsBetween, occupiedNights, type Stay } from './dates';
export type Extras = { breakfast: boolean; transfer: boolean; lateCheckout: boolean };
export const NO_EXTRAS: Extras = { breakfast: false, transfer: false, lateCheckout: false };
export type Quote = { nights: { date: string; amount: number; weekend: boolean; summer: boolean }[]; roomSubtotal: number; extras: { label: string; quantity: number; unitPrice: number; amount: number }[]; total: number; baseRate: number };
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
export function priceStay(baseRate: number, stay: Stay, extras: Extras): Quote {
  if (!Number.isSafeInteger(baseRate) || baseRate < 0) throw new Error('The room rate must be a valid amount in cents.');
  const count = nightsBetween(stay.arrival, stay.departure);
  if (count < 1 || count > 14 || !Number.isInteger(stay.adults) || stay.adults < 1 || !Number.isInteger(stay.children) || stay.children < 0) throw new Error('A quote needs 1–14 nights and valid guest counts.');
  const nights = occupiedNights(stay.arrival, stay.departure).map(date => {
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    const month = Number(date.slice(5, 7));
    const weekend = day === 5 || day === 6;
    const summer = month >= 6 && month <= 8;
    return { date, weekend, summer, amount: Math.round(baseRate * (weekend ? 115 : 100) * (summer ? 120 : 100) / 10000) };
  });
  const items: Quote['extras'] = [];
  const add = (label: string, quantity: number, unitPrice: number) => { if (quantity > 0) items.push({ label, quantity, unitPrice, amount: quantity * unitPrice }); };
  if (extras.breakfast) { add('Adult breakfast', stay.adults * nights.length, 1800); add('Child breakfast', stay.children * nights.length, 900); }
  if (extras.transfer) add('Airport transfer', 1, 6500);
  if (extras.lateCheckout) add('Late checkout until 14:00', 1, 4000);
  const roomSubtotal = nights.reduce((sum, night) => sum + night.amount, 0);
  return { nights, roomSubtotal, extras: items, total: roomSubtotal + items.reduce((sum, item) => sum + item.amount, 0), baseRate };
}
