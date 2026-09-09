# Asset plan and provenance

## Property bible
One fictional Mediterranean house: two stories of warm limestone/limewash, flat clay-colored roof coping, tall rectangular walnut-framed windows, rounded courtyard archways, linen, walnut, woven chairs, aged bronze, olive trees, rosemary, a small rectangular pool, rocky coast and blue-green sea. Photography is natural editorial daylight, quiet highlights, subtle film grain, no people, logos or text. Room-specific outlooks follow PRODUCT.md.

## Required production
One cinematic landscape hero. Four distinct views per room type: sleeping area, alternate living/bed angle, bathroom/material, accurate outlook/terrace. Six supporting views: courtyard, pool, breakfast/dining, coastline, ceramics, evening table. Generate related views using references. Inspect every asset; preserve source prompts in `assets/source/manifest.json`. Optimize into responsive local WebP files with build-time sharp processing. Never store image blobs in browser data.

Fonts: Bodoni Moda and DM Sans from Fontsource, distributed under SIL Open Font License; license files are included locally. Emblem/location schematic authored as vector code for this project. The hero-based social card is generated locally from the final image and typography.

## Final production
All **23 distinct photographs** were generated with the built-in `image_gen.imagegen` tool and individually visually inspected. No stock photography is used. All originals are natively 1536×1024, including the hero; the generation tool did not return the larger requested hero size. They are intentional fictional concept images, not documentation of an actual property. Reference-driven generation reduces room drift but is not an architectural as-built record.

The complete exact prompt set, reference roles, original source paths, inspection notes and source SHA-256 hashes are in [`assets/source/manifest.json`](../assets/source/manifest.json). Original PNGs included built-in C2PA metadata; optimized WebP derivatives use adjacent `.webp.json` provenance sidecars. Every shipped raster has its provenance available alongside it. Generated output is used as project artwork under the applicable image-generation service terms; no claim of exclusive rights or trademark clearance is made.

| Asset IDs | Association and view | Where used |
|---|---|---|
| `hero` | Limestone house, pool and coast, seen through a shaded arch | Homepage and social card |
| `courtyard-room-1` … `-4` | Queen sleeping area; reading/bed angle; walk-in shower; actual courtyard window | Courtyard Room and curated gallery |
| `terrace-room-1` … `-4` | King sleeping area; alternate interior; walk-in shower; planted terrace without sea | Terrace Room and curated gallery |
| `sea-studio-1` … `-4` | King sleeping area; single daybed; walk-in shower; sea-facing window without terrace | Sea Studio and curated gallery |
| `aurel-suite-1` … `-4` | King bedroom; separate lounge/sofa bed; double vanity and walk-in shower; private sea terrace | Aurel Suite and curated gallery |
| `courtyard` | Olive-shaded limestone courtyard | House story, journal, booking fallback |
| `pool` | Small rectangular shared pool | Homepage, house, journal |
| `dining` | Breakfast with ceramics, fruit and bread | Homepage, dining, journal |
| `coast` | Rocky coastline and footpath | Homepage and coastal-walk experience |
| `ceramics` | Clay and handmade ceramics on a workshop table | Ceramics experience |
| `evening` | Intimate table at dusk | Homepage, dining, tasting experience |

The exact rendered alt text and captions are maintained in `lib/catalog.ts`; the source manifest also carries generation-time alt/caption notes. Room descriptions explicitly avoid unsupported sea-view, bathtub or step-free claims. The gallery exposes all four views through keyboard-accessible controls.

`scripts/prepare-assets.mjs` resizes sources into local 1536/800/480-width WebP derivatives at quality 87/84/81. `scripts/provenance.mjs` restores sidecars after any regeneration. The site never depends on remote image endpoints or a runtime image optimizer. Final assets live in `public/images/`; no data URLs enter localStorage.

## Typography and vector work
Bodoni Moda and DM Sans are served locally from the Fontsource packages under the SIL Open Font License. License texts are included as `public/fonts/bodoni-moda-LICENSE.txt` and `public/fonts/dm-sans-LICENSE.txt`. Only normal variable files are shipped; editorial italic uses the browser’s oblique styling. Font files are approximately 25 KB and 36 KB.

The original sun-and-sea emblem is in `components/identity.tsx` and `app/icon.svg`. The contact-page SVG map is an original schematic (`components/location.tsx`), visibly labeled illustrative with no real address. Interface icons come from Lucide (ISC license, included with the package).

`public/images/social-preview.jpg` is a 1200×630 original typography composition rendered by `scripts/social-image.mjs`, using the inspected hero and local fonts. It explicitly labels the portfolio demonstration. No separate generated physical space is introduced.

## Missing assets
None. All requested photographic views are present. The original hero’s native resolution is the only asset-resolution limitation recorded above.
