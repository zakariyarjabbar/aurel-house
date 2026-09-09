---
name: AUREL HOUSE
description: A photographed coastal journal with a calm, transparent booking experience.
colors:
  deep-sea: "#173D41"
  limestone: "#F6F2E9"
  terracotta: "#AD5E42"
  sand: "#DFD3BE"
  warm-gray: "#655F55"
  rule: "#D4CEC1"
  error: "#9C3429"
  summary: "#EEE7D9"
  sea-hover: "#26575A"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(46px, 6.3vw, 88px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(38px, 4.2vw, 62px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(27px, 2.4vw, 36px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
rounded:
  square: "0px"
spacing:
  space-1: "8px"
  space-2: "16px"
  space-3: "24px"
  space-4: "32px"
  space-5: "48px"
  space-6: "64px"
  page: "clamp(24px, 5vw, 80px)"
  section: "clamp(72px, 9vw, 144px)"
components:
  button-primary:
    backgroundColor: "{colors.deep-sea}"
    textColor: "{colors.limestone}"
    rounded: "{rounded.square}"
    padding: "15px 23px"
  button-primary-hover:
    backgroundColor: "{colors.sea-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-sea}"
    rounded: "{rounded.square}"
    padding: "15px 23px"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.deep-sea}"
    rounded: "{rounded.square}"
    padding: "11px 13px"
  booking-summary:
    backgroundColor: "{colors.summary}"
    textColor: "{colors.deep-sea}"
    rounded: "{rounded.square}"
---

# Design System: AUREL HOUSE

## Overview

**Creative North Star: "An independent coastal journal"**

A small Mediterranean house is understood through light, limestone, planted outdoor spaces and the rhythm of a stay. The storefront gives photography and original editorial writing room to work. Booking and the front desk use the same identity with clearer density and practical controls.

The user's written direction is the visual authority. The final implementation and inspected screenshots are the evidence; no separately approved visual comp exists. This document replaces the provisional direction with the actual system as of 9 September 2026.

**Key Characteristics:**

- Large architectural photographs with meaningful room views and captions.
- Bodoni display type, clear sans-serif controls, fine rules and square surfaces.
- Varied editorial proportions, restrained motion and visible availability actions.
- A consistent fictional hotel identity through review, confirmation and management.

## Colors

Deep sea carries primary text, buttons, selected states and the footer. Limestone is the main canvas. Sand and the slightly lighter summary surface distinguish supporting regions without shadows. Terracotta accents the original emblem, caret and focus outline; it is not the default color for small text. Warm gray is the tested supporting-copy color, darkened from the brief's starting value to improve contrast. Rule and error colors have specific divider and validation roles.

**The Readable Surface Rule.** Check text against its actual surface. Automated contrast checks found no remaining violations on the eight tested surfaces; that result does not establish full accessibility conformance.

## Typography

**Display Font:** Bodoni Moda, with Georgia/serif fallback. **Body Font:** DM Sans, with Arial/sans-serif fallback. Both are local variable font files with SIL Open Font License texts in `public/fonts/`. The display file covers weights 400–600; body covers 400–700. Only normal font files ship; italic editorial passages use synthesized oblique styling.

Display headings are balanced and lightly tightened. The home opening has its own larger heading, while room, booking and confirmation headings have context-specific responsive sizes. Controls and detailed policies use DM Sans; native inputs remain 16px on mobile. Supporting labels are smaller than body text, and price columns retain unbroken amounts.

**The Two Voices Rule.** Keep the two-family relationship. Do not use display type for dense instructions or add an ornamental third font.

## Layout

The main wrapper tops out at 1600px with fluid side padding. The spacing scale in the frontmatter is reused alongside deliberate local values. Desktop room presentations combine different image/text proportions; alternating room rows become a straightforward image-first sequence on mobile. Main breakpoint groups are 1100px, 850px and 700px, with a wide-screen adjustment at 1600px.

The home opening is a still photograph with a shade for text contrast and a green availability strip. At narrow widths the strip exposes a date/guest summary and a button; date editing opens a native dialog instead of compressing the desktop fields. The mobile header keeps the wordmark, booking action and menu accessible.

Booking uses a two-column work/summary layout until 850px. On review, DOM order is guest and policy content, the full selected stay/price summary, then disclosure, consent and confirmation controls. Desktop grid areas position the summary alongside the work; mobile preserves that DOM sequence so the total appears before confirmation. Other booking steps place the summary below the work on mobile.

The desktop front desk uses tables. Wide reservation content scrolls within its own container; the availability calendar has a mobile unit list with textual availability labels. Layout testing covers 360, 390, 768, 1024 and 1440px, plus the actual local preview panel.

## Elevation & Depth

Surfaces are flat. Photography, tonal backgrounds, borders and spatial separation provide depth; there is no general card-shadow system. Native modal dialogs use a dark sea-colored backdrop. The photographic hero shade is for legibility and is not a decorative gradient treatment applied to text or controls.

## Shapes

Controls, inputs, room selections and confirmation surfaces use square corners. One-pixel rules organize content. The original emblem uses an outlined sun, horizon and waves; interface actions use Lucide icons with a consistent line vocabulary. A circular discovery control is a local exception in the hero, not a rounded-card motif.

## Components

**Buttons and links.** Primary buttons use sea/limestone colors and a 48px minimum height. Header booking and icon controls generally use 44px targets. Hover changes the surface and nudges the arrow; focus has a two-pixel terracotta outline with five-pixel offset. Disabled buttons reduce opacity and show a disabled cursor. Text links use a fine underline/rule and an explicit arrow where useful.

**Inputs and feedback.** Visible labels precede square outlined fields. Native date inputs provide arrival/departure editing; the site does not implement a custom calendar grid. Invalid fields have error color and associated inline copy. Save outcomes and failures use explicit local/temporary language. Loading, empty, disabled-storage, corrupt-storage and recovery states retain the same palette.

**Navigation and dialogs.** Desktop navigation indicates the current page with an underline. Mobile navigation, availability, image viewer and reservation drawer use native dialogs with Escape behavior and focus restoration. Gallery filters expose pressed state. Lightbox controls have explicit labels, captions and arrow-key navigation.

**Room and price presentation.** Room imagery reveals sleeping area, another meaningful angle, bathroom and accurate outlook. Prices say “From” without selected dates and show the current stay total when dates exist. The summary exposes an expandable nightly breakdown, extras quantities and total. Snapshot prices on reservations remain visually separate from newly calculated quotes.

**Confirmation.** The room image, reference, stay facts, accepted price/policy and original seal form one composed artifact. Print rules format a single A4 example with visible demo disclosure and hide navigation/actions. Details with unusually long user content may need more paper.

**Motion.** The shared ease is `cubic-bezier(.22,1,.36,1)`. Image hover gently scales to 1.025 over 0.8s; dialogs enter over 0.25s with a small upward settling motion. Navigation underline uses a transform. Reduced-motion media rules remove animation and smooth scrolling. Content is visible by default; no intro gate, autoplay media, custom cursor or scroll hijacking exists.

**Photography.** Twenty-three inspected generated photographs represent one fictional property. Three local WebP widths provide responsive delivery with reserved dimensions and meaningful alt text. Images are cropped with `object-fit: cover`; mobile preserves the relevant room/outlook. See `docs/ASSETS.md` before changing an association or image.

## Do's and Don'ts

### Do

- Do preserve the relationship between a room's actual outlook, copy, imagery and caption.
- Do show the current stay and full total before asking for confirmation.
- Do keep the exact portfolio disclosure visible in the required contexts.
- Do vary image scale and editorial density while keeping alignment and reading order clear.
- Do verify both desktop and mobile screenshots with visibly painted images.

### Don't

- Don't add fake ratings, scarcity, testimonials, credentials or real-business claims.
- Don't replace the coastal story with aggregator cards, ornamental gold, glass panels or a SaaS feature grid.
- Don't hide prices, errors or booking actions to protect an aesthetic.
- Don't add autoplay media, forced intros, custom cursors or scroll hijacking.
- Don't claim complete accessibility or production reservation reliability from this demo's tests.
