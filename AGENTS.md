# AUREL HOUSE — operating rules

Read `PRODUCT.md`, `DESIGN.md`, `docs/STATUS.md`, then `docs/ARCHITECTURE.md` before continuing. Read `docs/ASSETS.md` before changing imagery.

- Design and finished hospitality storytelling take priority. Preserve the coastal identity, truthful fictional content, coherent imagery, and accessible booking controls.
- **Browser-only invariant:** all mutable data stays in a versioned localStorage envelope and a single client store. Never introduce databases, backend services, Server Actions, runtime APIs, authentication providers, real payments, email delivery, analytics, or secrets.
- Use Next.js App Router, strict TypeScript, build-generated editorial pages, local responsive images and fonts, and `output: 'export'`. Unknown booking references use query parameters on fixed routes.
- Keep pure date, pricing, availability, and reservation logic separate from React. Money is integer cents; dates are calendar days in the configured Europe/Athens demo timezone.
- Hydrate before seeding. Validate persisted state, re-read before mutation, serialize writes, synchronize same-origin tabs, and report temporary storage honestly. Reset only this app's keys.
- Preserve accepted price/policy snapshots. Assign one continuous physical unit; derive availability from reservations and blocks. Idempotent confirmation and cancellation are required.
- Encourage fictional guest data. Show the exact portfolio disclosure at review, confirmation, demo entry, and in the footer. Do not invent commercial credentials or outcomes.
- Work autonomously on reversible changes. Do not publish externally, buy assets, or register domains without authorization.
- Verification: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run start`, `npm run test:browser`. Inspect desktop/mobile screenshots in bounded batches. Record actual results in `docs/QA.md`.
- Completion requires every route and flow in PRODUCT.md, inspected final assets, static HTTP verification, current documentation, and honest remaining limitations. Never mark unimplemented work complete.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
