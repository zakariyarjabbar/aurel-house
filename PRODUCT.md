# AUREL HOUSE
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Next.js App Router, TypeScript strict, static export. All mutations use a single browser store with localStorage. No database or service keys.

## Users and purpose
Flagship agency portfolio demonstration for couples, design-conscious travelers, and small families. Demonstrate exceptional hospitality design and a complete local direct-booking simulation.

## Story and brand commitments
A small house by the sea. A fictional independent twelve-room retreat on an imagined Mediterranean coast. Pale limestone walls turn around a planted courtyard. Days move from breakfast beneath the pergola to a swim, a book in the shade, and a table at dusk. Warm, personal, architectural and unhurried. No real address, operator, ratings, certifications, testimonials or awards.

## Room and unit catalog
| Type / slug | Units | Guests | Area | Base USD/night |
|---|---|---|---|---|
| Courtyard Room / courtyard-room | C01–C04 | 2 | 24 m² | 190 |
| Terrace Room / terrace-room | T01–T04 | 2 | 30 m² | 250 |
| Sea Studio / sea-studio | S01–S02 | 3 | 38 m² | 340 |
| Aurel Suite / aurel-suite | A01–A02 | 4 | 52 m² | 420 |
Courtyard rooms have a courtyard window and queen bed, no balcony or sea view. Terrace rooms have a king bed and private planted terrace, no guaranteed sea view. Studios have a king and one daybed with sea-facing windows, no private terrace. Suites have a king bedroom, separate lounge with a two-person sofa bed, and a private sea-facing terrace. Every bathroom has a walk-in shower. No unsupported accessibility claims.

## Scope and sitemap
Home; room index and four details; the house; dining; three experiences and index; gallery; three complete journal articles and index; contact; FAQ; policies; booking; confirmation; My Stay and details; demo help; open front-desk dashboard; genuine 404.

## Rules
One physical room per reservation. 1–14 nights; 1+ adults; children ages 2–11; guests within capacity. Hotel today is Europe/Athens. Arrival today through +365; departure at most +366. Occupancy uses [arrival, departure). Check-in from 15:00; checkout by 11:00.
Friday/Saturday nights ×1.15; June–August ×1.20; multiply then round each night once to cents. Breakfast $18/adult/night and $9/child/night, transfer $65/stay, late checkout $40/stay. Extras opt-in. Prices include fictional taxes and fees. No deposits or real payment.
Future confirmed stays may be amended after availability revalidation and acceptance of the price difference. Cancellation before arrival day gives a full simulated refund; otherwise inquiry. Confirmed → checked in → checked out transitions must match hotel calendar dates.

## State and truth
Seed twelve units, relative sample reservations and maintenance once; preserve seed anchor and IDs. Draft, reservations, overrides, blocks, inquiries, local messages and activity share a versioned namespace. Availability derives from records. Idempotent writes and accepted snapshots. Same browser profile/origin shares storage; other contexts do not. No backend, secure auth, live global inventory, actual payment, or email delivery.

## Acceptance
Every route is complete, responsive, keyboard-usable, and exported. At least 23 coherent inspected images (hero, four views per room type, six supporting). Working inquiry, search, pricing, booking/decline/retry, confirmation/print/calendar, amendments/cancellation, dashboard/rates/blocks, storage failure/reset states. Typecheck, lint, focused tests and static production build pass; browser scenarios and measurements are recorded honestly.
