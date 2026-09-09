'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Coffee, CarFront, Sun } from 'lucide-react';
import { useHouse } from './store-provider';
import { StayFields } from './search';
import { Photo } from './photo';
import { Emblem } from './identity';
import { PriceBreakdown } from './quote';
import { BookingLoading } from './booking-loading';
import { ROOMS, DISCLOSURE, POLICY } from '@/lib/catalog';
import { availableUnits, resolvedRoom, sampleStay, guestErrors, confirmReservation, amendReservation } from '@/lib/domain';
import { browserStore, newId, roomSlugValue } from '@/lib/storage';
import { dateLabel, hotelToday, isDate, stayErrors } from '@/lib/dates';
import { money, priceStay, type Extras } from '@/lib/pricing';
import type { Draft } from '@/lib/types';
const STEPS = ['Your dates', 'Your room', 'Little extras', 'Your details', 'Review'];
export function ExtraChoices({ value, onChange }: { value: Extras; onChange: (extras: Extras) => void }) {
  const choices = [
    { id: 'breakfast' as const, title: 'A slow breakfast', text: '$18 per adult · $9 per child · each night', detail: 'Bread, fruit, yogurt, eggs and something warm in your cup.', Icon: Coffee },
    { id: 'transfer' as const, title: 'An easy arrival', text: '$65 · once per stay', detail: 'A simulated airport transfer. No car or driver is actually arranged.', Icon: CarFront },
    { id: 'lateCheckout' as const, title: 'Stay a little longer', text: '$40 · once per stay', detail: 'Checkout until 14:00. A simulated confirmed option for this demo.', Icon: Sun },
  ];
  return <div className="extra-choices">{choices.map(({ id, title, text, detail, Icon }) => <label className={`extra-choice ${value[id] ? 'selected' : ''}`} key={id}><Icon size={24} strokeWidth={1.3} /><span><strong>{title}</strong><span>{text}</span><small>{detail}</small></span><input type="checkbox" checked={value[id]} onChange={event => onChange({ ...value, [id]: event.target.checked })} /></label>)}</div>;
}
export function BookingFlow() {
  const { state, ready, temporary } = useHouse(); const router = useRouter(); const search = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({}); const [message, setMessage] = useState(''); const [accepted, setAccepted] = useState(false); const [payment, setPayment] = useState<'success' | 'decline'>('success'); const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null); const locked = useRef(false); const initialized = useRef('');
  const queryString = search.toString(); const step = state?.draft.step ?? 0;
  useEffect(() => {
    if (!ready || initialized.current === `loaded:${queryString}`) return;
    initialized.current = `loaded:${queryString}`;
    const query = new URLSearchParams(queryString); const current = browserStore.getSnapshot().state; if (!current) return;
    const ref = query.get('amend');
    if (ref && current.draft.amendmentRef !== ref) {
      const booking = current.reservations.find(r => r.ref === ref);
      if (booking && booking.status === 'confirmed' && booking.arrival > hotelToday()) { try { browserStore.updateDraft({ arrival: booking.arrival, departure: booking.departure, adults: booking.adults, children: booking.children, roomSlug: booking.roomSlug, extras: { ...booking.extras }, guest: { ...booking.guest }, step: 0, submissionId: newId(), amendmentRef: ref }); } catch { /* Storage provider presents the required recovery action. */ } }
    } else if (!ref && queryString) {
      const patch: Partial<Draft> = {};
      if (isDate(query.get('arrival'))) patch.arrival = query.get('arrival')!;
      if (isDate(query.get('departure'))) patch.departure = query.get('departure')!;
      if (query.has('room')) patch.roomSlug = roomSlugValue(query.get('room')!);
      for (const field of ['adults', 'children'] as const) if (query.has(field) && Number.isInteger(Number(query.get(field)))) patch[field] = Number(query.get(field));
      try { browserStore.updateDraft(patch); } catch { /* Provider gives the recovery action. */ }
    }
  }, [ready, queryString]);
  useEffect(() => { if (ready) heading.current?.focus(); }, [step, ready]);
  if (!state) return <BookingLoading />;
  const draft = state.draft; const today = hotelToday(); const room = draft.roomSlug ? resolvedRoom(state, draft.roomSlug) : null;
  const stayValid = !Object.keys(stayErrors(draft, today)).length;
  const quote = room && stayValid ? priceStay(room.baseRate, draft, draft.extras) : null;
  const original = draft.amendmentRef ? state.reservations.find(r => r.ref === draft.amendmentRef) : null;
  const requestedAmendment = search.get('amend');
  const patch = (change: Partial<Draft>) => { setAccepted(false); setMessage(''); try { browserStore.updateDraft(change); setErrors({}); } catch (error) { setMessage((error as Error).message); } };
  const go = (next: number) => { setErrors({}); setMessage(''); try { browserStore.updateDraft({ step: next }); } catch (error) { setMessage((error as Error).message); } };
  const trySample = () => { try { patch({ ...sampleStay(state, today, undefined, draft.adults > 0 ? draft.adults : 2, draft.children >= 0 ? draft.children : 0), step: 0 }); } catch (error) { setMessage((error as Error).message); } };
  const next = () => {
    const found = step === 0 ? stayErrors(draft, today) : step === 1 ? !room ? { room: 'Choose a room to continue.' } : stayErrors(draft, today, room.capacity) : step === 3 ? guestErrors(draft.guest) : {};
    if (step === 1 && room && !availableUnits(state, room.slug, draft, original?.ref).length) found.room = 'Choose a room available for the whole stay.';
    setErrors(found); if (!Object.keys(found).length) go(step + 1);
  };
  const confirm = () => {
    if (locked.current) return;
    if (!accepted) { setErrors({ accept: 'Please acknowledge the demo and stay policy before confirming.' }); return; }
    if (!quote || !room) { setMessage('Return to your dates and room to complete the selection.'); return; }
    locked.current = true; setBusy(true); setMessage('');
    try {
      const saved = browserStore.mutate(current => original ? amendReservation(current, original.ref, draft, today, new Date().toISOString(), draft.submissionId, quote.total) : confirmReservation(current, draft, today, new Date().toISOString(), payment, quote.total));
      router.push(original ? `/my-stay/details/?ref=${encodeURIComponent(saved.ref)}` : `/booking/confirmation/?ref=${encodeURIComponent(saved.ref)}`);
    } catch (error) { setMessage((error as Error).message); setAccepted(false); locked.current = false; setBusy(false); }
  };
  if (requestedAmendment && (!original || original.ref !== requestedAmendment || original.status !== 'confirmed' || original.arrival <= today)) return <div className="empty-page wrap"><h1>This stay cannot be changed here.</h1><p>The reference may belong to another browser, or the stay may no longer be eligible. Your existing reservation is unchanged.</p><Link className="button" href="/my-stay/">See local stays</Link></div>;
  const reviewControls = <><div className="demo-notice"><p>{DISCLOSURE}</p>{temporary && <p><strong>Temporary-session mode:</strong> this reservation will be lost on reload.</p>}</div><label className="consent"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span>I understand this is a browser-only demonstration and accept the fictional stay and cancellation policy.</span></label>{errors.accept && <p className="field-error" role="alert">{errors.accept}</p>}{!original && <details className="payment-demo"><summary>Demo payment scenario</summary><label htmlFor="payment-scenario">Simulated result</label><select id="payment-scenario" value={payment} onChange={e => setPayment(e.target.value as 'success' | 'decline')}><option value="success">Success — save a demo reservation</option><option value="decline">Decline — preserve the draft, reserve nothing</option></select><p>No network request or real payment details.</p></details>}</>;
  const actions = <>
  {message && <div className="form-alert" role="alert">{message}{step === 4 && <button className="text-button" onClick={() => go(1)}>Review available rooms and current price</button>}</div>}
  <div className="step-actions">{step > 0 && <button className="text-button" disabled={busy} onClick={() => go(step - 1)}><ArrowLeft size={16} /> Back</button>}{step < 4 ? <button className="button" onClick={next}>Continue <ArrowRight size={17} /></button> : <button className="button confirm-button" disabled={busy} onClick={confirm}>{busy ? 'Saving your stay…' : original ? 'Accept change and simulated difference' : 'Confirm demo reservation'}<ArrowRight size={17} /></button>}</div></>;
  return <div className="booking-page wrap"><div className="booking-top"><Link href="/rooms/" className="back-link"><ArrowLeft size={16} /> Back to the rooms</Link><span>ONE ROOM. A LITTLE TIME AWAY.</span></div><div className="booking-title"><h1>{original ? 'A different rhythm.' : 'Make a little time.'}</h1><p>{original ? 'Change your future stay. Review the difference before saving.' : 'Your stay at Aurel House, one thoughtful detail at a time.'}</p></div><nav className="booking-progress" aria-label="Booking progress"><ol>{STEPS.map((label, i) => <li key={label} className={i === step ? 'current' : i < step ? 'complete' : ''}><button disabled={i > step || busy} aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}><span>{i < step ? <Check size={14} /> : i + 1}</span>{label}</button></li>)}</ol></nav>
  <div className={`booking-layout ${step === 4 ? 'booking-review-layout' : ''}`}><section className="booking-work"><h2 ref={heading} tabIndex={-1}>{['When shall we expect you?', 'Find your kind of room.', 'A few simple pleasures.', 'A name for your stay.', 'Everything, just as you like it.'][step]}</h2>
  {step === 0 && <><p>One room, 1–14 nights. Our hotel calendar uses Europe/Athens; today is {dateLabel(today)}.</p><StayFields value={draft} onChange={change => patch(change)} errors={errors} /><div className="form-helper"><button className="text-button" onClick={trySample}>Try sample dates</button><Link href="/contact/?subject=Group%20stay">More than one room?</Link></div><p className="small muted">Children are ages 2–11. At least one adult is required. We do not collect children’s names or birth dates.</p></>}
  {step === 1 && <><p>{dateLabel(draft.arrival)} — {dateLabel(draft.departure)} · {draft.adults + draft.children} guests</p><div className="booking-room-list">{ROOMS.map(base => { const candidate = resolvedRoom(state, base.slug); const units = availableUnits(state, candidate.slug, draft, original?.ref); const fits = draft.adults + draft.children <= candidate.capacity; const candidateQuote = stayValid ? priceStay(candidate.baseRate, draft, draft.extras) : null; return <label key={candidate.slug} className={`booking-room-option ${draft.roomSlug === candidate.slug ? 'selected' : ''} ${!units.length ? 'unavailable' : ''}`}><Photo id={`${candidate.slug}-1`} sizes="(max-width:700px) 50vw, 250px" /><div><h3>{candidate.name}</h3><p>{candidate.view} · {candidate.area} m²</p><p>{candidate.bed} · Up to {candidate.capacity} guests</p><strong>{candidateQuote ? money(candidateQuote.total) : money(candidate.baseRate)}</strong><small>{candidateQuote ? 'Total for this stay, including selected extras' : 'Base nightly rate'}</small><span className="availability-label">{!fits ? 'Too small for this group' : units.length ? `${units.length} ${units.length === 1 ? 'room' : 'rooms'} available in this browser` : 'Unavailable for the whole stay'}</span></div><input aria-label={`Select ${candidate.name}`} type="radio" name="room" checked={draft.roomSlug === candidate.slug} disabled={!units.length} onChange={() => patch({ roomSlug: candidate.slug })} /></label>; })}</div>{errors.room && <p role="alert" className="field-error">{errors.room}</p>}{errors.guests && <p role="alert" className="field-error">{errors.guests}</p>}<div className="form-helper"><button className="text-button" onClick={trySample}>Try alternative sample dates</button><span className="small muted">One unit must be free for every night.</span></div></>}
  {step === 2 && <><p>Make the stay your own. Everything here is optional.</p><ExtraChoices value={draft.extras} onChange={extras => patch({ extras })} /></>}
  {step === 3 && <><p>Please use fictional guest details. Everything stays in this browser, and no email is sent.</p><button className="text-button sample-guest" onClick={() => patch({ guest: { name: 'Alex Rowan', email: 'alex.rowan@example.com', requests: 'A quiet corner and a good book. Fictional sample guest.' } })}>Use sample guest</button><div className="form-grid"><div className="field full"><label htmlFor="guest-name">Guest name</label><input id="guest-name" autoComplete="off" value={draft.guest.name} maxLength={100} onChange={e => patch({ guest: { ...draft.guest, name: e.target.value } })} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'guest-name-error' : undefined} />{errors.name && <p id="guest-name-error" className="field-error">{errors.name}</p>}</div><div className="field full"><label htmlFor="guest-email">Email for the local message preview</label><input id="guest-email" type="email" autoComplete="off" placeholder="alex.rowan@example.com" value={draft.guest.email} maxLength={180} onChange={e => patch({ guest: { ...draft.guest, email: e.target.value } })} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'guest-email-error' : undefined} />{errors.email && <p id="guest-email-error" className="field-error">{errors.email}</p>}</div><div className="field full"><label htmlFor="guest-requests">Anything to keep in mind? <span>(optional)</span></label><textarea id="guest-requests" value={draft.guest.requests} maxLength={1000} onChange={e => patch({ guest: { ...draft.guest, requests: e.target.value } })} /><span className="small muted">No identity documents, passwords or payment details.</span></div></div></>}
  {step === 4 && <><div className="review-guest"><Emblem /><div><h3>{draft.guest.name}</h3><p>{draft.guest.email}</p><p>{draft.guest.requests || 'No special requests added.'}</p></div><button className="text-button" onClick={() => go(3)}>Edit</button></div><div className="review-policy"><h3>The details, agreed.</h3><p>{POLICY}</p><p>Breakfast is served 07:30–10:30. If selected, late checkout is confirmed in this simulation until 14:00. The airport transfer is simulated.</p><Link href="/policies/">Read all stay policies</Link></div>{original && quote && <div className="amendment-difference"><h3>Your change, clearly.</h3><div><span>Original accepted total</span><span>{money(original.quote.total)}</span></div><div><span>New total</span><span>{money(quote.total)}</span></div><div><strong>{quote.total >= original.quote.total ? 'Simulated additional charge' : 'Simulated refund'}</strong><strong>{money(Math.abs(quote.total - original.quote.total))}</strong></div></div>}</>}
  {step < 4 && actions}</section>
  <aside className="booking-summary"><Photo id={room ? `${room.slug}-1` : 'courtyard'} sizes="(max-width:700px) 100vw, 400px" /><div className="summary-content"><div className="summary-house"><Emblem /><span>AUREL HOUSE<small>A small house by the sea.</small></span></div><h3>{room?.name || 'Your place by the sea.'}</h3><div className="summary-dates"><div><span>Arrival</span><strong>{dateLabel(draft.arrival)}</strong><small>From 15:00</small></div><div><span>Departure</span><strong>{dateLabel(draft.departure)}</strong><small>By {draft.extras.lateCheckout ? '14:00' : '11:00'}</small></div></div><p className="summary-guests">{draft.adults} {draft.adults === 1 ? 'adult' : 'adults'}{draft.children > 0 ? ` · ${draft.children} ${draft.children === 1 ? 'child' : 'children'}` : ''} · One room</p>{quote ? <PriceBreakdown quote={quote} /> : <p className="small muted">Choose your dates and a room to see every night and the complete price.</p>}</div></aside>{step === 4 && <section className="booking-confirm-controls" aria-label="Confirm the reviewed stay">{reviewControls}{actions}</section>}</div></div>;
}
