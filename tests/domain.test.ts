import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, hotelToday, isDate, nightsBetween, occupiedNights, overlaps, stayErrors } from '../lib/dates';
import { NO_EXTRAS, priceStay } from '../lib/pricing';
import { availableUnits, amendReservation, cancelReservation, confirmReservation, emptyDraft, sampleStay, seedState, transitionReservation } from '../lib/domain';
import { addMaintenance, dailyMetrics, editRoom, removeMaintenance } from '../lib/front-desk';
import { calendarFile } from '../lib/calendar';
import type { Draft } from '../lib/types';
const TODAY = '2026-09-09'; const NOW = `${TODAY}T09:00:00.000Z`;
function setup() { const state = seedState(TODAY, NOW); const draft: Draft = { ...emptyDraft('visitor-1'), arrival: '2026-10-09', departure: '2026-10-12', adults: 2, children: 0, roomSlug: 'courtyard-room', guest: { name: 'Alex Rowan', email: 'alex@example.com', requests: 'Fictional guest' } }; return { state, draft }; }
const quote = (draft: Draft, base = 19000) => priceStay(base, draft, draft.extras).total;
test('calendar math crosses month, year, leap year and Athens DST with exact nights', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01'); assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(nightsBetween('2026-03-28', '2026-03-30'), 2); assert.equal(nightsBetween('2026-10-24', '2026-10-26'), 2);
  assert.deepEqual(occupiedNights('2026-12-31', '2027-01-02'), ['2026-12-31', '2027-01-01']); assert.equal(isDate('2026-02-29'), false);
});
test('hotel today is independent of visitor timezone', () => { assert.equal(hotelToday(new Date('2026-09-09T21:30:00Z')), '2026-09-10'); assert.equal(hotelToday(new Date('2026-01-01T22:30:00Z')), '2026-01-02'); });
test('missing, reversed, same-day, past, long and guest errors are explicit', () => {
  const { draft } = setup();
  for (const change of [{ arrival: '' }, { departure: '' }, { departure: draft.arrival }, { departure: '2026-10-08' }, { arrival: '2026-09-08' }, { departure: '2026-10-24' }, { adults: 0 }, { adults: 1.5 }, { children: -1 }, { children: .5 }]) assert.ok(Object.keys(stayErrors({ ...draft, ...change }, TODAY)).length, JSON.stringify(change));
  assert.ok(stayErrors({ ...draft, children: 1 }, TODAY, 2).guests);
  assert.deepEqual(stayErrors({ ...draft, arrival: addDays(TODAY,365), departure: addDays(TODAY,366) }, TODAY), {});
  assert.ok(stayErrors({ ...draft, arrival: addDays(TODAY,366), departure: addDays(TODAY,367) }, TODAY).arrival);
});
test('adjacent half-open stays do not overlap', () => { assert.equal(overlaps('2026-10-01','2026-10-03','2026-10-03','2026-10-04'),false); assert.equal(overlaps('2026-10-01','2026-10-04','2026-10-03','2026-10-05'),true); });
test('a continuous unit is required; availability cannot combine units across nights', () => {
  const { state, draft } = setup(); state.reservations = [];
  state.maintenance = ['C01','C02','C03','C04'].map((unitId,i) => ({ id: unitId, unitId, arrival: i % 2 ? '2026-10-10' : '2026-10-09', departure: i % 2 ? '2026-10-11' : '2026-10-10', reason: 'Test block' }));
  assert.equal(availableUnits(state,'courtyard-room',draft).length,0);
  assert.equal(availableUnits(state,'courtyard-room',{...draft,arrival:'2026-10-11'}).length,4);
  assert.equal(availableUnits(state,'courtyard-room',{...draft,children:1}).length,0);
});
test('nightly price multiplies weekend and summer then rounds once', () => {
  const q = priceStay(19001,{arrival:'2026-07-03',departure:'2026-07-06',adults:2,children:0},NO_EXTRAS);
  assert.deepEqual(q.nights.map(n=>n.amount),[26221,26221,22801]); assert.equal(q.total,75243);
  const boundary = priceStay(19000,{arrival:'2026-05-31',departure:'2026-06-02',adults:1,children:0},NO_EXTRAS);
  assert.deepEqual(boundary.nights.map(n=>n.amount),[19000,22800]);
});
test('breakfast quantities track people × nights; flat extras apply once', () => {
  const q = priceStay(34000,{arrival:'2026-09-14',departure:'2026-09-17',adults:2,children:1},{breakfast:true,transfer:true,lateCheckout:true});
  assert.deepEqual(q.extras.map(e=>[e.quantity,e.amount]),[[6,10800],[3,2700],[1,6500],[1,4000]]); assert.equal(q.total,126000);
  assert.equal(priceStay(34000,{arrival:'2026-09-14',departure:'2026-09-17',adults:2,children:1},NO_EXTRAS).extras.length,0);
});
test('confirmation saves one physical unit, accepted snapshot and message atomically in candidate', () => {
  const { state,draft } = setup(); const before = state.reservations.length; const saved = confirmReservation(state,draft,TODAY,NOW,'success',quote(draft));
  assert.equal(state.reservations.length,before+1); assert.ok(saved.unitId.startsWith('C')); assert.equal(state.messages[0].ref,saved.ref);
  const oldPrice = structuredClone(saved.quote); editRoom(state,'courtyard-room',{baseRate:50000},NOW,'rate-change'); assert.deepEqual(saved.quote,oldPrice);
});
test('double confirmation reuses submission id and never duplicates messages or inventory', () => {
  const { state,draft } = setup(); const first = confirmReservation(state,draft,TODAY,NOW,'success',quote(draft)); const second = confirmReservation(state,draft,TODAY,NOW,'success',quote(draft));
  assert.equal(first.ref,second.ref); assert.equal(state.messages.length,1); assert.equal(state.activity.filter(a=>a.ref===first.ref).length,1);
});
test('decline leaves reservations, draft, messages and inventory unchanged', () => {
  const { state,draft } = setup(); state.draft=draft; const before=structuredClone(state);
  assert.throws(()=>confirmReservation(state,draft,TODAY,NOW,'decline',quote(draft)),/declined/); assert.deepEqual(state,before);
});
test('rate change between review and confirmation requires a new review', () => { const {state,draft}=setup(); const expected=quote(draft); state.roomOverrides['courtyard-room']={baseRate:21000}; assert.throws(()=>confirmReservation(state,draft,TODAY,NOW,'success',expected),/rate has changed/); assert.equal(state.messages.length,0); });
test('amendment excludes original booking, accepts difference, retries once and preserves original on invalid change', () => {
  const { state,draft }=setup(); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft)); const original=structuredClone(saved);
  assert.throws(()=>amendReservation(state,saved.ref,{...draft,adults:3},TODAY,NOW,'invalid',quote(draft)),/accommodates/); assert.deepEqual(saved,original);
  const replacement:Draft={...draft,extras:{...NO_EXTRAS,transfer:true}}; const changed=amendReservation(state,saved.ref,replacement,TODAY,NOW,'amend-1',quote(replacement));
  assert.equal(changed.unitId,original.unitId); assert.equal(changed.adjustments[0].amount,6500);
  amendReservation(state,saved.ref,replacement,TODAY,NOW,'amend-1',quote(replacement)); assert.equal(changed.adjustments.length,1);
});
test('unavailable amendment retains original, including accepted quote', () => {
  const {state,draft}=setup(); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft)); const before=structuredClone(saved);
  state.maintenance.push(...['T01','T02','T03','T04'].map(unitId=>({id:unitId,unitId,arrival:draft.arrival,departure:draft.departure,reason:'Testing'})));
  assert.throws(()=>amendReservation(state,saved.ref,{...draft,roomSlug:'terrace-room'},TODAY,NOW,'unavailable',quote(draft,25000)),/No single room/); assert.deepEqual(saved,before);
});
test('cancellation releases inventory once and produces one full simulated refund', () => {
  const {state,draft}=setup(); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft)); assert.equal(availableUnits(state,'courtyard-room',draft).length,3);
  cancelReservation(state,saved.ref,TODAY,NOW); cancelReservation(state,saved.ref,TODAY,NOW); assert.equal(availableUnits(state,'courtyard-room',draft).length,4); assert.equal(saved.refunded,saved.quote.total); assert.equal(state.activity.filter(a=>a.id===`cancelled-${saved.ref}`).length,1);
});
test('arrival-day cancellation and invalid transitions are rejected; checkout retains historical nights', () => {
  const {state,draft}=setup(); draft.arrival=TODAY; draft.departure=addDays(TODAY,2); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft));
  assert.throws(()=>cancelReservation(state,saved.ref,TODAY,NOW),/before arrival/); assert.throws(()=>transitionReservation(state,saved.ref,'checked-out',TODAY,NOW),/does not match/);
  transitionReservation(state,saved.ref,'checked-in',TODAY,NOW); assert.throws(()=>transitionReservation(state,saved.ref,'checked-out',TODAY,NOW),/does not match/);
  transitionReservation(state,saved.ref,'checked-out',draft.departure,NOW); assert.ok(!availableUnits(state,'courtyard-room',draft).includes(saved.unitId));
});
test('sample dates fit actual state and seeds do not depend on the build date', () => { const {state}=setup(); const sample=sampleStay(state,TODAY); assert.ok(availableUnits(state,sample.roomSlug,sample).length); assert.deepEqual(seedState(TODAY,NOW),seedState(TODAY,NOW)); assert.equal(seedState('2027-01-01',NOW).seedAnchor,'2027-01-01'); });
test('maintenance conflicts are rejected, adjacent blocks work and removal is idempotent', () => {
  const {state,draft}=setup(); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft));
  assert.throws(()=>addMaintenance(state,{id:'blocked',unitId:saved.unitId,arrival:draft.arrival,departure:draft.departure,reason:'Paint'},TODAY,NOW),/conflicts/);
  addMaintenance(state,{id:'adjacent',unitId:saved.unitId,arrival:draft.departure,departure:addDays(draft.departure,1),reason:'Paint'},TODAY,NOW);
  assert.ok(availableUnits(state,'courtyard-room',{...draft,arrival:draft.departure,departure:addDays(draft.departure,1)}).length===3);
  removeMaintenance(state,'adjacent',NOW); removeMaintenance(state,'adjacent',NOW); assert.equal(state.activity.filter(a=>a.id==='removed-adjacent').length,1);
});
test('dashboard totals derive from physical records and selected nights', () => { const {state}=setup(); const metrics=dailyMetrics(state,TODAY); assert.equal(metrics.occupied,2); assert.equal(metrics.arrivals.length,1); assert.equal(metrics.available+metrics.blocked+metrics.occupied,12); });
test('calendar uses all-day arrival and exclusive departure with CRLF folding', () => { const {state,draft}=setup(); const saved=confirmReservation(state,draft,TODAY,NOW,'success',quote(draft)); const ics=calendarFile(saved); assert.ok(ics.includes('DTSTART;VALUE=DATE:20261009\r\n')); assert.ok(ics.includes('DTEND;VALUE=DATE:20261012\r\n')); assert.ok(ics.includes('STATUS:TENTATIVE')); assert.ok(!/(^|[^\r])\n/.test(ics)); });
