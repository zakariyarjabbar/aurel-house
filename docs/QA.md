# Verification record

Verified on 9 September 2026, on macOS with Node 26.0.0 and isolated headless Google Chrome 152.0.7977.83. Browser scenarios fix the clock at `2026-09-09T09:00:00Z`; the app's calendar remains Europe/Athens. All HTTP/browser checks use the production static export at `http://127.0.0.1:3001`, not the Next development server.

## Commands

| Check | Actual result |
|---|---|
| `npm run typecheck` | Passed, strict TypeScript, no errors |
| `npm run lint` | Passed, no errors or warnings |
| `npm test` | 29 passed, 0 failed |
| `npm run build` | Passed; all known content generated into `out/` |
| `npm run start` | Static file server running on port 3001 |
| `npm run test:browser` | Passed 16/16; 26 routes, 28 full-page captures, zero page errors |
| `node scripts/layout-check.mjs` | 8 passed, 0 failed |
| Raster provenance scan | 70 shipping rasters, 0 missing sidecars |

No checks were disabled. Playwright runs required permission to launch an isolated local Chrome process outside the command sandbox. Test profiles do not touch the user's ordinary browser profile. Sharp was updated to 0.35.4 after the dependency audit identified the older version; the subsequent install reported zero vulnerabilities.

## Domain and storage tests

The 19 domain tests cover month/year/leap-year and Athens daylight-saving boundaries, hotel today independent of visitor timezone, missing/reversed/same-day/past/long stays, guest capacity, adjacent stays, one continuous unit, seasonal/weekend rounding, breakfast quantities, flat extras, accepted snapshots, duplicate confirmation, declined payment, changed rate at confirmation, valid/invalid/unavailable amendments, idempotent cancellation, valid date/status transitions, sample dates, maintenance conflicts, dashboard metrics and all-day calendar semantics.

The 10 storage tests cover stable server state, hydration before first seed, seed preservation on refresh, re-reading the latest envelope, corrupt/unsupported data preservation, unavailable storage, failed reservation writes without false success, explicit temporary-session retry, scoped reset with unrelated keys preserved, failed reset, invalid drafts versus invalid envelopes, rollback of partially modified candidates, and storage-event reset recovery.

## Browser scenarios

The reproducible suite is `scripts/functional-check.mjs`; its complete result is [browser-results.json](browser-results.json).

1. Missing dates show feedback; sample dates fit actual inventory; room navigation, refresh and back/forward retain the draft.
2. Courtyard Room, 6–9 October, two adults, breakfast and transfer total **$743**. Decline writes no reservation/message. A double click saves one reservation, one message and one physical unit. Refresh preserves it. At mobile width, the selected stay and price precede consent and confirmation.
3. Calendar download has `DTSTART;VALUE=DATE:20261006` and exclusive `DTEND;VALUE=DATE:20261009`. The same reference appears in confirmation, My Stay and the front-desk drawer. Print CSS exports a readable A4 PDF.
4. A local rate edit to $205 appears in the other same-origin tab, while the accepted $743 reservation remains unchanged.
5. Maintenance overlapping that reservation is rejected without a write; a free unit accepts the block and its calendar shows maintenance.
6. A reversed-date amendment preserves the original. A valid Terrace Room amendment to 7–10 October accepts **$960.50**, recording a **$217.50** simulated additional charge.
7. Cancellation records one **$960.50** simulated refund and one activity event; a repeated cancellation control is absent.
8. Invalid inquiries show feedback. A fictional Dining inquiry saves locally and appears with the local confirmation-message preview; no email is claimed.
9. Another browser context has independent seeded records and an explanatory missing-booking state.
10. Confirmed reset removes this app's visitor records, draft and inquiries, preserves an unrelated storage sentinel and updates another tab.
11. Corrupt source text remains preserved; recovery download and explicit temporary-session mode work.
12. Disabled storage keeps browsing and temporary room selection usable.
13. Mobile date sheet, navigation and lightbox support Escape/focus restoration; lightbox arrow keys and keyboard booking progression work.
14. Every one of the 26 requested route URLs returns HTTP 200, survives direct refresh, has one main heading and `noindex`; an unknown path returns an actual HTTP 404.
15. Final desktop/mobile images load, responsive pages avoid document overflow, and eight representative axe scans run.
16. Three representative cold mobile loads are measured under documented throttling.

## Responsive and accessibility evidence

Desktop/mobile full-page captures use 1440×1000 and 390×844 viewports. Additional document-overflow checks cover 360, 768 and 1024 CSS-pixel widths on home, Aurel Suite, booking and admin. The dashboard's wide reservations table scrolls inside its container; its availability calendar has a mobile unit list with explicit text states.

The actual Codex preview panel was also inspected at 509×730: the home opening and availability controls were visible, with document width 498px and no horizontal page overflow.

The supplementary [layout-results.json](layout-results.json) records four 390px checks with a long edited room name (home, room index, room detail and booking), plus four checks with computed body/control text doubled (contact, FAQ, policies and booking). All eight have no horizontal document overflow. Text doubling is a deterministic stress check, not a claim of native browser zoom conformance.

Eight axe checks report zero violations against the selected WCAG 2 A/AA, 2.1 AA and 2.2 AA tags: booking review, confirmation, home, room, contact, demo, admin and room selection. Muted text was darkened to `#655F55` after contrast testing. Native dialogs provide focus containment; keyboard tests verify restoration. Reduced-motion styles keep content visible.

These checks do not establish full WCAG conformance. Manual screen-reader use, native iOS/Android date pickers, Safari/Firefox and physical mobile devices were not tested.

## Visual review and captures

The early home/room inspection established the visual direction before the site expanded. A later bounded desktop/mobile pass corrected contrast, mobile table overflow and the booking loading layout. The independent finish review identified mobile review order and incomplete leading-image capture evidence. The summary now precedes consent on mobile. Captures now take a viewport image after decoding and scrolling, then the full-page image, allowing Chrome's compositor to paint the leading image. Fresh viewport checks confirmed this was a capture issue, not a missing source asset.

The home full-page capture needed a further valid capture after its viewport rendered correctly; all delivered evidence is reviewed visually rather than inferred from decoded-image checks. Final review disposition is recorded in [FINISH_REVIEW.md](FINISH_REVIEW.md). Only the following named captures are final portfolio evidence; `early-*`, `*inspect*` and diagnostic files are historical working material.

| Surface | Desktop | Mobile |
|---|---|---|
| Home | [Full page](screenshots/home-desktop.png) | [Full page](screenshots/home-mobile.png) |
| Courtyard Room | [Full page](screenshots/room-desktop.png) | [Full page](screenshots/room-mobile.png) |
| Booking review | [Full page](screenshots/booking-desktop.png) | [Full page](screenshots/booking-mobile.png) |
| Confirmation | [Full page](screenshots/confirmation-desktop.png) | [Full page](screenshots/confirmation-mobile.png) |
| Front desk | [Full page](screenshots/admin-desktop.png) | [Full page](screenshots/admin-mobile.png) |

The same folder contains desktop/mobile house, dining, experiences, journal article, gallery, contact, FAQ, policies and demo captures. Each final capture also has a `-viewport.png` counterpart. The final printed [confirmation PDF](screenshots/confirmation-print.pdf) was rendered with Poppler and visually inspected: one A4 page with the photograph, reference, dates, accepted price, policy and demo disclosure, without clipped content. Import into third-party calendar software and a physical printer were not tested.

## Performance

Measurements are from isolated Chrome contexts at 390×844, device scale factor 1, cold cache, 4× CPU slowdown, 150ms latency, 1.6 Mbps download and 750 Kbps upload. FCP/LCP/CLS use browser PerformanceObserver entries; transfer size uses CDP network bytes. These are single local lab runs, not Lighthouse scores or field Core Web Vitals.

| Page | FCP | LCP | CLS | Transferred bytes |
|---|---|---|---|---|
| Home | 2.320s | 2.320s | 0.00245 | 1,184,078 |
| Courtyard Room | 2.276s | 2.276s | 0.00123 | 1,138,910 |
| Booking | 2.256s | 4.256s | 0.00007 | 827,582 |

Booking is the slowest representative page and remains a performance limitation under this throttle. Prior comparable runs ranged from 3.728–4.256s LCP for booking. The static loading layout reduced its early measured CLS of 0.503; post-fix runs ranged from about 0.00007–0.046. A single run is not a stable field estimate.

## Remaining limits

- All hotel content, images, payments, guests and reservations are fictional. No real inventory, payment, service booking or email delivery exists.
- Browser-local data is editable and can be lost when site data is cleared. Re-reading before writes and tab synchronization do not provide guaranteed multi-tab atomic transactions.
- Source photography is 1536×1024; the hero is not native 4K. The responsive assets and all 23 distinct photographic views are present and inspected. See [ASSETS.md](ASSETS.md).
- Browser/assistive-technology coverage and lab performance limits are stated above. There is no verified public deployment or external service integration.
