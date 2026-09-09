# Architecture

## Static application
Next.js 16.3.4 App Router, React 19.2.8, strict TypeScript. `output: 'export'` with `trailingSlash: true` produces `out/`. Known rooms and editorial slugs use `generateStaticParams`; browser-created references use `?ref=` on fixed routes. Query readers have Suspense boundaries. Editorial components render at build time. There are no Server Actions, runtime API routes, cookies, auth services, databases, payment services or required credentials. The local Node preview script only serves files and a genuine 404.

## State flow
`lib/catalog.ts` and `lib/content.ts` are immutable fixtures. `lib/types.ts` defines the mutable envelope. `StoreProvider` subscribes using React’s `useSyncExternalStore`, with a stable empty server snapshot and browser-only initialization. Static content renders immediately; local widgets wait for hydration. `BrowserStore` owns all mutations, so there is no competing state library.

`aurel-house:demo:v1` contains schemaVersion, revision, seedAnchor, draft, reservations, roomOverrides, maintenance, inquiries, messages and activity. A missing key seeds once relative to the hotel date; refreshing reads and validates existing records without regenerating IDs or dates. Draft fields may temporarily be invalid for form feedback; saved reservations are validated more strictly. Schema v0 and unknown versions are deliberately unsupported and preserved until a scoped reset; no invented migration is attempted.

Each mutation re-reads the latest persisted envelope, clones it, applies a synchronous operation, validates the candidate, increments its revision and writes it before publishing success. Domain exceptions discard the candidate. A write failure does not publish a reservation or success. The user may explicitly select temporary-session mode and retry; such changes are held in memory and lost on reload. Corrupt source text stays untouched and is available as a recovery download. Storage events refresh other same-origin tabs. Writes are serialized within one tab; localStorage does **not** provide guaranteed atomic multi-tab booking or production transaction semantics.

## Dates, units and pricing
`lib/dates.ts` formats hotel today in Europe/Athens and uses UTC calendar ordinals for calendar-day math, independent of visitor-local DST. Stays are half-open [arrival, departure). `availableUnits` filters stable physical unit IDs against all non-cancelled reservation intervals and maintenance. One unit must be free for the entire stay; checked-out records retain historical occupied nights. Confirmation and amendment revalidate against the latest state.

`lib/pricing.ts` is pure. Each night multiplies integer-cent base rate by 1.15 for Fri/Sat and 1.20 for Jun–Aug, then rounds once. Night totals are summed; breakfast uses people × nights, transfer and late checkout are once. No tax is added. Accepted quote, name and policy snapshots live on the reservation. Edits affect new quotes only.

## Mutations
Confirmation reuses submissionId, rejects declines without inventory effects, assigns a physical unit and writes a local message in the same candidate. Amendments exclude the replaced reservation, preserve its unit if still available, require an accepted current total, and log one idempotent simulated difference. Cancellation is permitted only for future confirmed arrivals, changes status and records one full simulated refund. Confirmed → checked-in is allowed during the occupied dates; checked-in → checked-out on/after departure. The dashboard’s viewing date never changes the mutation clock.

Maintenance cannot overlap a non-cancelled reservation or another block for the same unit. Rates and selected descriptions are validated. Dashboard metrics derive from records; there are no mutable inventory counters or invented analytics.

## Reset, exports and privacy
Reset replaces only the app’s v1 key and removes its obsolete v0 key after successful replacement. It clears draft/reference selection through navigation to `/demo/`; unrelated storage remains. Calendar downloads use all-day DTSTART and exclusive DTEND, marked tentative and explicitly demo. Print CSS makes confirmation readable on A4. No PII enters URLs, analytics or outbound forms. User-editable local storage is not secure authentication.

Images are preoptimized local WebP in three widths; `picture` selects them with an unoptimized Next Image fallback. Fonts are served locally. `lib/site-origin.ts` resolves the build-time canonical/social origin from `NEXT_PUBLIC_SITE_URL`, then `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, with localhost only as the local fallback. The 1200×630 branded JPEG is declared with Open Graph dimensions/type/alt text, and Twitter/X uses a large-image card. All metadata is emitted in the static HTML; no crawler-facing runtime service is introduced. Default metadata remains noindex/nofollow, with no LocalBusiness or fabricated rating data.
