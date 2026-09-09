import { ROOMS, type RoomSlug } from './catalog';
import { addDays, isDate, overlaps } from './dates';
import type { DemoState, Maintenance, Override } from './types';
export function unitState(state: DemoState, unitId: string, date: string) {
  const reservation = state.reservations.find(r => r.unitId === unitId && r.status !== 'cancelled' && r.arrival <= date && date < r.departure);
  if (reservation) return { label: 'Occupied', kind: 'occupied', ref: reservation.ref, detail: `${reservation.guest.name} · ${reservation.ref}` };
  const block = state.maintenance.find(b => b.unitId === unitId && b.arrival <= date && date < b.departure);
  if (block) return { label: 'Maintenance', kind: 'blocked', detail: block.reason };
  return { label: 'Available', kind: 'available', detail: 'Available in this browser' };
}
export function dailyMetrics(state: DemoState, date: string) {
  const active = state.reservations.filter(r => r.status !== 'cancelled');
  const units = ROOMS.flatMap(room => room.units).map(id => unitState(state, id, date));
  const occupied = units.filter(unit => unit.kind === 'occupied').length;
  return { arrivals: active.filter(r => r.arrival === date), departures: active.filter(r => r.departure === date), occupied, blocked: units.filter(unit => unit.kind === 'blocked').length, available: units.filter(unit => unit.kind === 'available').length, occupancy: Math.round(occupied / 12 * 100) };
}
export function addMaintenance(state: DemoState, block: Maintenance, today: string, now: string) {
  if (!ROOMS.some(room => room.units.includes(block.unitId))) throw new Error('Choose a physical room unit.');
  if (!isDate(block.arrival) || !isDate(block.departure) || block.arrival >= block.departure) throw new Error('Maintenance needs a valid start and a later end date.');
  if (block.arrival < today || block.departure > addDays(today, 366)) throw new Error('Use maintenance dates from today through the next 366 days.');
  if (block.reason.trim().length < 3 || block.reason.length > 300) throw new Error('Add a reason, between 3 and 300 characters.');
  if (state.maintenance.some(b => b.id === block.id)) return;
  const conflict = state.reservations.find(r => r.unitId === block.unitId && r.status !== 'cancelled' && overlaps(block.arrival, block.departure, r.arrival, r.departure));
  if (conflict) throw new Error(`This block conflicts with ${conflict.ref}. Resolve that reservation before blocking this unit. No maintenance was saved.`);
  if (state.maintenance.some(b => b.unitId === block.unitId && overlaps(block.arrival, block.departure, b.arrival, b.departure))) throw new Error('A maintenance block already covers part of these dates. Remove or choose dates outside it.');
  state.maintenance.push({ ...block, reason: block.reason.trim() });
  state.activity.push({ id: `maintenance-${block.id}`, action: `Maintenance added for ${block.unitId}: ${block.reason.trim()}`, at: now });
}
export function removeMaintenance(state: DemoState, id: string, now: string) {
  const block = state.maintenance.find(b => b.id === id); if (!block) return;
  state.maintenance = state.maintenance.filter(b => b.id !== id);
  state.activity.push({ id: `removed-${id}`, action: `Maintenance removed for ${block.unitId}`, at: now });
}
export function editRoom(state: DemoState, slug: RoomSlug, patch: Override, now: string, id: string) {
  if (!ROOMS.some(room => room.slug === slug)) throw new Error('Choose a known room type.');
  if (patch.baseRate !== undefined && (!Number.isSafeInteger(patch.baseRate) || patch.baseRate < 100 || patch.baseRate > 1000000)) throw new Error('Use a base rate from $1 to $10,000, with at most two decimal places.');
  for (const field of ['name', 'short', 'description'] as const) if (patch[field] !== undefined && (patch[field]!.trim().length < 3 || patch[field]!.length > (field === 'description' ? 1500 : 160))) throw new Error(`The ${field} must have at least 3 characters and fit the field’s limit.`);
  state.roomOverrides[slug] = { ...state.roomOverrides[slug], ...patch };
  state.activity.push({ id, action: `Room details/rate updated: ${slug}`, at: now });
}
