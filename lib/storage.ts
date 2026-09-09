import { ROOMS, type RoomSlug } from './catalog';
import { hotelToday, isDate } from './dates';
import { seedState } from './domain';
import type { DemoState } from './types';
export const STORAGE_KEY = 'aurel-house:demo:v1';
export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
type Obj = Record<string, unknown>;
const obj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, max = 2000): v is string => typeof v === 'string' && v.length <= max;
const integer = (v: unknown, min = 0): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v < 10000000000;
// Draft inputs may temporarily contain invalid counts; final booking validation is stricter.
const draftCount = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= 1000000;
const array = (v: unknown): v is unknown[] => Array.isArray(v) && v.length <= 10000;
const date = (v: unknown) => isDate(v);
const timestamp = (v: unknown) => str(v, 40) && Number.isFinite(Date.parse(v));
const slug = (v: unknown) => ROOMS.some(room => room.slug === v);
const unit = (v: unknown) => ROOMS.some(room => room.units.includes(String(v)));
const extras = (v: unknown) => obj(v) && ['breakfast', 'transfer', 'lateCheckout'].every(key => typeof v[key] === 'boolean');
const guest = (v: unknown) => obj(v) && str(v.name, 100) && str(v.email, 180) && str(v.requests, 1000);
const stay = (v: Obj) => date(v.arrival) && date(v.departure) && String(v.arrival) < String(v.departure) && integer(v.adults, 1) && integer(v.children);
const quote = (v: unknown) => obj(v) && integer(v.baseRate) && integer(v.roomSubtotal) && integer(v.total) && array(v.nights) && v.nights.length > 0 && v.nights.length <= 14 && v.nights.every(n => obj(n) && date(n.date) && integer(n.amount) && typeof n.weekend === 'boolean' && typeof n.summer === 'boolean') && array(v.extras) && v.extras.every(e => obj(e) && str(e.label, 100) && integer(e.quantity) && integer(e.unitPrice) && integer(e.amount));
export function parseState(raw: string): DemoState {
  if (raw.length > 6000000) throw new Error('Saved demo data is too large to open safely.');
  const s: unknown = JSON.parse(raw);
  if (!obj(s) || s.schemaVersion !== 1) throw new Error('This saved schema is not supported. Export a recovery copy, then reset this demo.');
  if (!integer(s.revision) || !date(s.seedAnchor) || !obj(s.draft) || !obj(s.roomOverrides)) throw new Error('The saved demo envelope is incomplete.');
  const d = s.draft;
  if (!(d.arrival === '' || date(d.arrival)) || !(d.departure === '' || date(d.departure)) || !draftCount(d.adults) || !draftCount(d.children) || !(d.roomSlug === '' || slug(d.roomSlug)) || !extras(d.extras) || !guest(d.guest) || !str(d.submissionId, 160) || !integer(d.step) || d.step > 4 || (d.amendmentRef !== undefined && !str(d.amendmentRef, 180))) throw new Error('The saved booking draft is invalid.');
  if (!Object.entries(s.roomOverrides).every(([key, value]) => slug(key) && obj(value) && Object.entries(value).every(([field, data]) => field === 'baseRate' ? integer(data, 100) && data <= 1000000 : ['name', 'short', 'description'].includes(field) && str(data, field === 'description' ? 1500 : 160)))) throw new Error('Saved room changes are invalid.');
  if (!array(s.reservations) || !s.reservations.every(r => obj(r) && stay(r) && str(r.ref, 180) && str(r.submissionId, 160) && slug(r.roomSlug) && unit(r.unitId) && ROOMS.find(room => room.slug === r.roomSlug)!.units.includes(String(r.unitId)) && str(r.roomName, 160) && extras(r.extras) && guest(r.guest) && quote(r.quote) && str(r.policy, 2000) && ['confirmed', 'checked-in', 'checked-out', 'cancelled'].includes(String(r.status)) && ['sample', 'visitor'].includes(String(r.source)) && timestamp(r.createdAt) && timestamp(r.updatedAt) && integer(r.refunded) && array(r.adjustments) && r.adjustments.every(a => obj(a) && str(a.id, 180) && integer(a.amount, -1000000000) && timestamp(a.at)))) throw new Error('Saved reservations contain invalid data.');
  const refs = s.reservations.map(r => (r as Obj).ref);
  if (new Set(refs).size !== refs.length) throw new Error('Duplicate reservation references were found.');
  if (!array(s.maintenance) || !s.maintenance.every(b => obj(b) && str(b.id, 180) && unit(b.unitId) && date(b.arrival) && date(b.departure) && String(b.arrival) < String(b.departure) && str(b.reason, 300))) throw new Error('Saved maintenance data is invalid.');
  if (!array(s.inquiries) || !s.inquiries.every(i => obj(i) && str(i.id, 180) && str(i.name, 100) && str(i.email, 180) && str(i.subject, 180) && str(i.message, 2000) && timestamp(i.createdAt))) throw new Error('Saved inquiries are invalid.');
  if (!array(s.messages) || !s.messages.every(m => obj(m) && str(m.id, 240) && str(m.ref, 180) && str(m.recipient, 180) && str(m.subject, 300) && str(m.body, 6000) && timestamp(m.createdAt))) throw new Error('Saved message previews are invalid.');
  if (!array(s.activity) || !s.activity.every(a => obj(a) && str(a.id, 240) && str(a.action, 300) && timestamp(a.at) && (a.ref === undefined || str(a.ref, 180)) && (a.amount === undefined || integer(a.amount, -1000000000)))) throw new Error('Saved activity is invalid.');
  return s as unknown as DemoState;
}
export type StoreSnapshot = { state: DemoState | null; ready: boolean; warning: string; temporary: boolean; recovery: string | null };
const INITIAL: StoreSnapshot = { state: null, ready: false, warning: '', temporary: false, recovery: null };
export class BrowserStore {
  private snapshot: StoreSnapshot = INITIAL;
  private listeners = new Set<() => void>();
  private writing = false;
  constructor(private adapter: () => StorageAdapter, private clock: () => Date = () => new Date()) {}
  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => INITIAL;
  subscribe = (callback: () => void) => { this.listeners.add(callback); return () => { this.listeners.delete(callback); }; };
  private publish(next: Partial<StoreSnapshot>) { this.snapshot = { ...this.snapshot, ...next }; this.listeners.forEach(listener => listener()); }
  initialize = () => {
    if (this.snapshot.ready) return;
    let raw: string | null = null;
    try {
      const storage = this.adapter(); raw = storage.getItem(STORAGE_KEY);
      // v0 is deliberately unsupported, preserved under its own key until a scoped reset.
      if (!raw && storage.getItem('aurel-house:demo:v0')) throw new Error('An older demo schema is present. Reset this demo to start version 1; the old data is preserved.');
      const state = raw ? parseState(raw) : seedState(hotelToday(this.clock()), this.clock().toISOString());
      if (!raw) storage.setItem(STORAGE_KEY, JSON.stringify(state));
      this.publish({ state, ready: true });
    } catch (error) {
      this.publish({ state: seedState(hotelToday(this.clock()), this.clock().toISOString()), ready: true, warning: `Browser storage could not be loaded. ${error instanceof Error ? error.message : 'Storage may be disabled or full.'} Browsing still works. Choose temporary-session mode or reset in Demo help before saving.`, recovery: raw });
    }
  };
  synchronize = () => {
    if (this.snapshot.temporary) return;
    try {
      const raw = this.adapter().getItem(STORAGE_KEY);
      if (raw) this.publish({ state: parseState(raw), warning: '', recovery: null });
      else this.publish({ state: seedState(hotelToday(this.clock()), this.clock().toISOString()), warning: 'Demo data was removed in another tab. Choose Reset sample house in Demo help to save a clean state.' });
    } catch { this.publish({ warning: 'Another tab changed the stored data, but it could not be read. Your current view is retained. Open Demo help for recovery.' }); }
  };
  useTemporary = () => { this.publish({ temporary: true, warning: 'Temporary-session mode. Changes stay in memory and will be lost when this tab reloads or closes.' }); };
  mutate<T>(operation: (state: DemoState) => T): T {
    if (!this.snapshot.ready || !this.snapshot.state) throw new Error('The local house is still loading.');
    if (this.writing) throw new Error('A local save is in progress. Try again.');
    if (this.snapshot.warning && !this.snapshot.temporary) throw new Error('Storage needs attention. Use Demo help to reset or explicitly enable temporary-session mode.');
    this.writing = true;
    try {
      let latest = this.snapshot.state;
      if (!this.snapshot.temporary) {
        let raw: string | null;
        try { raw = this.adapter().getItem(STORAGE_KEY); } catch { this.publish({ warning: 'Browser storage is unavailable. Enable temporary-session mode explicitly to continue.' }); throw new Error('Your change was not saved. Browser storage is unavailable.'); }
        if (raw) { try { latest = parseState(raw); } catch { this.publish({ warning: 'Saved data could not be validated. Reset or recover it from Demo help before saving.', recovery: raw }); throw new Error('Your change was not saved; existing data is preserved.'); } }
        else { this.publish({ warning: 'The demo’s storage was removed. Reset the sample house from Demo help before saving.' }); throw new Error('Your change was not saved because the underlying storage was removed.'); }
      }
      if (latest.revision !== this.snapshot.state.revision) this.publish({ state: latest });
      const candidate = structuredClone(latest);
      const result = operation(candidate);
      candidate.revision = latest.revision + 1;
      parseState(JSON.stringify(candidate));
      if (!this.snapshot.temporary) {
        try { this.adapter().setItem(STORAGE_KEY, JSON.stringify(candidate)); }
        catch { this.publish({ warning: 'The save failed because browser storage is full or disabled. Nothing was confirmed. Free storage or explicitly enable temporary-session mode, then retry.' }); throw new Error('Your change was not durably saved. Enable temporary-session mode to retry without persistence.'); }
      }
      this.publish({ state: candidate });
      return result;
    } finally { this.writing = false; }
  }
  updateDraft = (patch: Partial<DemoState['draft']>) => this.mutate(state => { state.draft = { ...state.draft, ...patch }; });
  reset = () => {
    const state = seedState(hotelToday(this.clock()), this.clock().toISOString());
    state.draft.submissionId = crypto.randomUUID();
    if (this.snapshot.temporary) { this.publish({ state, recovery: null }); return; }
    try {
      // Write the validated replacement first so a quota failure cannot destroy existing records.
      const storage = this.adapter(); storage.setItem(STORAGE_KEY, JSON.stringify(state)); storage.removeItem('aurel-house:demo:v0');
      this.publish({ state, ready: true, warning: '', recovery: null });
    } catch { this.publish({ warning: 'Reset could not be saved. Existing data was not cleared. Enable temporary-session mode if storage is unavailable.' }); throw new Error('Reset was not durably saved.'); }
  };
}
export const browserStore = new BrowserStore(() => window.localStorage);
export const newId = () => crypto.randomUUID();
export const roomSlugValue = (value: string): RoomSlug | '' => ROOMS.some(room => room.slug === value) ? value as RoomSlug : '';
