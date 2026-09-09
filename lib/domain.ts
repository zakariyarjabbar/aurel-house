import { ROOMS, getRoom, POLICY, type RoomSlug } from './catalog';
import { addDays, isDate, overlaps, stayErrors, type Stay } from './dates';
import { NO_EXTRAS, priceStay } from './pricing';
import type { DemoState, Draft, Guest, Reservation, ReservationStatus } from './types';
export function emptyDraft(id: string): Draft { return { arrival: '', departure: '', adults: 2, children: 0, roomSlug: '', extras: { ...NO_EXTRAS }, guest: { name: '', email: '', requests: '' }, submissionId: id, step: 0 }; }
export function resolvedRoom(state: DemoState, slug: RoomSlug) { return { ...getRoom(slug)!, ...state.roomOverrides[slug] }; }
export function availableUnits(state: DemoState, slug: RoomSlug, stay: Stay, excludingRef?: string): string[] {
  const room = getRoom(slug);
  if (!room || !Number.isInteger(stay.adults) || stay.adults < 1 || !Number.isInteger(stay.children) || stay.children < 0 || stay.adults + stay.children > room.capacity || !isDate(stay.arrival) || !isDate(stay.departure) || stay.arrival >= stay.departure) return [];
  return room.units.filter(unit => !state.reservations.some(r => r.ref !== excludingRef && r.unitId === unit && r.status !== 'cancelled' && overlaps(stay.arrival, stay.departure, r.arrival, r.departure)) && !state.maintenance.some(block => block.unitId === unit && overlaps(stay.arrival, stay.departure, block.arrival, block.departure)));
}
export function sampleStay(state: DemoState, today: string, slug?: RoomSlug, adults = 2, children = 0): Stay & { roomSlug: RoomSlug } {
  for (let day = 1; day <= 360; day++) {
    const stay = { arrival: addDays(today, day), departure: addDays(today, day + 2), adults, children };
    for (const room of ROOMS.filter(room => !slug || room.slug === slug)) if (availableUnits(state, room.slug, stay).length) return { ...stay, roomSlug: room.slug };
  }
  throw new Error('No two-night stay fits this selection in the next year. Try fewer guests or another room.');
}
export function guestErrors(guest: Guest) {
  const errors: Record<string, string> = {};
  if (guest.name.trim().length < 2 || guest.name.length > 100) errors.name = 'Enter a fictional full name, between 2 and 100 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) || guest.email.length > 180) errors.email = 'Enter a valid email format; an example.com address is welcome.';
  if (guest.requests.length > 1000) errors.requests = 'Keep special requests within 1,000 characters.';
  return errors;
}
export function confirmReservation(state: DemoState, draft: Draft, today: string, now: string, payment: 'success' | 'decline', expectedTotal: number): Reservation {
  const existing = state.reservations.find(r => r.submissionId === draft.submissionId);
  if (existing) return existing;
  if (payment === 'decline') throw new Error('The demo payment was declined. No reservation was created. Your selection is saved; choose success and try again.');
  const room = draft.roomSlug && resolvedRoom(state, draft.roomSlug);
  if (!room) throw new Error('Choose a room for your stay.');
  const errors = { ...stayErrors(draft, today, room.capacity), ...guestErrors(draft.guest) };
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  const unitId = availableUnits(state, room.slug, draft)[0];
  if (!unitId) throw new Error('That room is no longer available for the whole stay in this browser. Return to rooms to see current alternatives, or try sample dates.');
  const quote = priceStay(room.baseRate, draft, draft.extras);
  if (quote.total !== expectedTotal) throw new Error('The local rate has changed. Review the updated price before confirming again.');
  const ref = `AH-${today.replaceAll('-', '')}-${String(state.reservations.length + 1).padStart(4, '0')}`;
  const reservation: Reservation = { arrival: draft.arrival, departure: draft.departure, adults: draft.adults, children: draft.children, extras: { ...draft.extras }, guest: { ...draft.guest }, ref, submissionId: draft.submissionId, unitId, roomSlug: room.slug, roomName: room.name, quote, policy: POLICY, status: 'confirmed', source: 'visitor', createdAt: now, updatedAt: now, refunded: 0, adjustments: [] };
  state.reservations.push(reservation);
  state.messages.push({ id: `confirmation-${ref}`, ref, recipient: draft.guest.email, subject: `Your demo stay at Aurel House · ${ref}`, body: `Hello ${draft.guest.name},\n\nYour demo ${room.name} stay is saved for ${draft.arrival} to ${draft.departure}, for ${draft.adults} adult(s) and ${draft.children} child(ren).\n\nCheck-in from 15:00; checkout by 11:00 (Europe/Athens).\n\nPortfolio demonstration. Reservations are saved in this browser only. No payment is taken and no room is reserved.\n\nThis is a local message preview. No email has been sent.`, createdAt: now });
  state.activity.push({ id: `confirmed-${ref}`, ref, action: 'Demo reservation confirmed', amount: quote.total, at: now });
  state.draft = emptyDraft(`${Date.parse(now)}-${state.reservations.length}`);
  return reservation;
}
export function amendReservation(state: DemoState, ref: string, draft: Draft, today: string, now: string, mutationId: string, expectedTotal: number) {
  const reservation = state.reservations.find(r => r.ref === ref);
  if (!reservation) throw new Error('This reservation is not saved in this browser.');
  if (reservation.adjustments.some(change => change.id === mutationId)) return reservation;
  if (reservation.status !== 'confirmed' || reservation.arrival <= today) throw new Error('Only confirmed stays arriving after today can be changed. Please save an inquiry.');
  const room = draft.roomSlug && resolvedRoom(state, draft.roomSlug);
  if (!room) throw new Error('Choose a room.');
  const errors = { ...stayErrors(draft, today, room.capacity), ...guestErrors(draft.guest) };
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  const units = availableUnits(state, room.slug, draft, ref);
  const unitId = units.includes(reservation.unitId) ? reservation.unitId : units[0];
  if (!unitId) throw new Error('No single room is available for that entire stay. Your original reservation is unchanged.');
  const quote = priceStay(room.baseRate, draft, draft.extras);
  if (quote.total !== expectedTotal) throw new Error('The local rate has changed. Review the updated difference before saving. Your original stay is unchanged.');
  const difference = quote.total - reservation.quote.total;
  Object.assign(reservation, { arrival: draft.arrival, departure: draft.departure, adults: draft.adults, children: draft.children, extras: { ...draft.extras }, guest: { ...draft.guest }, roomSlug: room.slug, roomName: room.name, unitId, quote, policy: POLICY, updatedAt: now });
  reservation.adjustments.push({ id: mutationId, amount: difference, at: now });
  state.activity.push({ id: mutationId, ref, action: 'Stay amended · simulated price difference', amount: difference, at: now });
  state.messages.push({ id: `amendment-${mutationId}`, ref, recipient: reservation.guest.email, subject: `Updated demo stay · ${ref}`, body: `Your local demo stay is now ${reservation.arrival} to ${reservation.departure} in ${room.name}. Simulated price difference: ${(difference / 100).toFixed(2)} USD. No email is sent, no money is moved and no real room is reserved.`, createdAt: now });
  state.draft = emptyDraft(`next-${mutationId}`);
  return reservation;
}
export function cancelReservation(state: DemoState, ref: string, today: string, now: string) {
  const reservation = state.reservations.find(r => r.ref === ref);
  if (!reservation) throw new Error('Reservation not found in this browser.');
  if (reservation.status === 'cancelled') return reservation;
  if (reservation.status !== 'confirmed' || reservation.arrival <= today) throw new Error('Cancellation is available before arrival day for confirmed stays. Please save a local inquiry.');
  reservation.status = 'cancelled'; reservation.refunded = reservation.quote.total; reservation.updatedAt = now;
  state.activity.push({ id: `cancelled-${ref}`, ref, action: 'Stay cancelled · full simulated refund', amount: -reservation.quote.total, at: now });
  return reservation;
}
export function transitionReservation(state: DemoState, ref: string, next: ReservationStatus, today: string, now: string) {
  if (next === 'cancelled') return cancelReservation(state, ref, today, now);
  const reservation = state.reservations.find(r => r.ref === ref);
  if (!reservation) throw new Error('Reservation not found.');
  if (reservation.status === next) return reservation;
  const checkIn = reservation.status === 'confirmed' && next === 'checked-in' && reservation.arrival <= today && today < reservation.departure;
  const checkOut = reservation.status === 'checked-in' && next === 'checked-out' && today >= reservation.departure;
  if (!checkIn && !checkOut) throw new Error('That status change does not match the hotel’s current date. Check-in is allowed during the stay; checkout is allowed on or after departure.');
  reservation.status = next; reservation.updatedAt = now;
  state.activity.push({ id: `${next}-${ref}`, ref, action: next === 'checked-in' ? 'Guest checked in' : 'Guest checked out', at: now });
  return reservation;
}
export function seedState(anchor: string, now: string): DemoState {
  const state: DemoState = { schemaVersion: 1, revision: 0, seedAnchor: anchor, draft: emptyDraft('first-draft'), reservations: [], roomOverrides: {}, maintenance: [], inquiries: [], messages: [], activity: [] };
  const samples: [RoomSlug, number, number, number, ReservationStatus, string][] = [
    ['courtyard-room', 0, -1, 1, 'checked-in', 'Alex Rowan'], ['terrace-room', 0, 0, 3, 'confirmed', 'Sam Vale'], ['sea-studio', 0, 3, 6, 'confirmed', 'Robin Wren'], ['aurel-suite', 0, 1, 4, 'confirmed', 'Charlie Reed'], ['courtyard-room', 1, 4, 7, 'confirmed', 'Jamie Brook'], ['terrace-room', 1, -5, -3, 'checked-out', 'Morgan Lake'], ['aurel-suite', 1, 9, 11, 'confirmed', 'Taylor Lane'],
  ];
  for (const [slug, unit, start, end, status, name] of samples) {
    const room = getRoom(slug)!; const stay = { arrival: addDays(anchor, start), departure: addDays(anchor, end), adults: 2, children: 0 };
    const ref = `AH-SAMPLE-${room.units[unit]}`;
    state.reservations.push({ ...stay, ref, submissionId: ref, unitId: room.units[unit], roomSlug: slug, roomName: room.name, extras: { ...NO_EXTRAS }, guest: { name, email: `${name.toLowerCase().replace(' ', '.')}@example.com`, requests: 'Fictional sample guest.' }, quote: priceStay(room.baseRate, stay, NO_EXTRAS), policy: POLICY, status, source: 'sample', createdAt: now, updatedAt: now, refunded: 0, adjustments: [] });
  }
  state.maintenance = [{ id: 'sample-block-c04', unitId: 'C04', arrival: addDays(anchor, 2), departure: addDays(anchor, 5), reason: 'Limewash touch-up' }, { id: 'sample-block-t04', unitId: 'T04', arrival: addDays(anchor, 10), departure: addDays(anchor, 12), reason: 'Terrace planting' }];
  state.activity = [{ id: 'seed-initialized', action: 'Local sample house initialized', at: now }];
  return state;
}
