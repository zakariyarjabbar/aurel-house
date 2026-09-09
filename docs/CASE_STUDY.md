# AUREL HOUSE — portfolio case-study draft

**A small hotel, given room to breathe online.**

Aurel House is a fictional twelve-room Mediterranean retreat, created as an agency portfolio demonstration. The project connects an original hospitality identity with a complete interactive booking experience, implemented as a static Next.js website with browser-only data.

The design begins with the place: warm limestone, an olive-shaded courtyard, a small pool and a rocky coast. Reference-driven generated photography keeps the property and four room types visually related. Large Bodoni headings, a restrained green-and-limestone palette and varied editorial compositions carry the feeling of an independent travel journal. The room galleries explain sleeping arrangements, bathrooms and actual outlooks rather than relying on atmosphere alone.

The booking flow retains that identity while making practical decisions clear. Guests can compare physical-room availability, see each nightly rate, choose extras and review a transparent total. Confirmation becomes a designed artifact with print and calendar exports. Future stays can be changed after accepting a simulated price difference, or cancelled according to the stated policy.

An openly accessible front-desk dashboard uses the same local records for arrivals, departures, occupancy, room availability, rate edits, maintenance and inquiry/message previews. All mutable data remains in localStorage, with explicit hydration, validation, revalidation before writes, same-origin tab updates and honest handling of failed saves. There is no backend, database, authentication or real payment integration.

The work demonstrates visual direction, responsive frontend implementation, accessibility-aware interactions, calendar and pricing logic, local persistence and static-export delivery. Verification evidence is recorded in `docs/QA.md`. No real booking conversion, revenue, occupancy improvement, client outcome or business metric is claimed.
