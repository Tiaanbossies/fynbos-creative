---
name: Fynbos Creative
description: Founder-led web services for small South African businesses — olive, terracotta and parchment, stated plainly.
colors:
  paper: "#fafffb"
  olive: "#3d5a3a"
  terracotta: "#a8503d"
  terracotta-dark: "#8a3d2e"
  parchment: "#e4decd"
  parchment-soft: "#f0ecdf"
  sage: "#b9cba0"
  sage-deep: "#819872"
  sage-wash: "#f1f5ec"
  deep-pine: "#1c2117"
  body-ink: "#3a3a30"
  bark-grey: "#8a8672"
  bark-deep: "#6c6957"
  on-olive: "#fbf8f1"
  on-olive-muted: "#cfe0c4"
typography:
  display:
    fontFamily: "Zilla Slab, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.2rem + 4.6vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Zilla Slab, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  title:
    fontFamily: "Zilla Slab, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.15rem + 1.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  body:
    fontFamily: "Work Sans, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Work Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.65
    letterSpacing: "normal"
  script:
    fontFamily: "Alex Brush, cursive"
    fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "normal"
rounded:
  sm: "4px"
  btn: "8px"
  md: "10px"
  pill: "999px"
  hero: "4px 40px 4px 40px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  6: "1.5rem"
  8: "2rem"
  12: "3rem"
  16: "4rem"
  24: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.btn}"
    padding: "1rem 26px"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.terracotta}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 2rem"
    height: "3rem"
  button-header-cta:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "2.75rem"
  input-text:
    backgroundColor: "{colors.sage-wash}"
    textColor: "{colors.deep-pine}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.75rem"
  nav-link:
    textColor: "{colors.deep-pine}"
    typography: "{typography.label}"
    padding: "0.5rem 0"
  nav-link-active:
    textColor: "{colors.olive}"
  row-open:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-ink}"
    typography: "{typography.body}"
    rounded: "0"
    padding: "2rem 0"
---

# Design System: Fynbos Creative

## 1. Overview

**Creative North Star: "The Plain Ledger"**

Everything is stated in the open and nothing is boxed away. This system reads like a well-kept account book rather than a brochure: entries divided by hairlines, prices sitting on the same baseline as the thing they belong to, olive as the ink, parchment as the ruling, and terracotta reserved for the single line you are meant to act on. The layout is the argument — a visitor who scans it should conclude that this business has nothing to hide before reading a word about honesty.

It is a warm system, but warmth comes from hue and voice, never from softness of structure. Zilla Slab's slab serifs give headings the weight of a printed heading rather than a marketing headline. Work Sans carries body copy at a full 1.65 line-height because the audience is scanning on a phone, on data, and legibility outranks personality. Alex Brush appears at most once per page, as a script kicker, and never sets anything a visitor must read to understand the page.

The system explicitly rejects, in PRODUCT.md's own words: **corporate/agency gloss** — no stock-photo polish, no invented statistics; the **generic SaaS-startup look** — no gradient-heavy hero-metric templates, no dashboard chrome, no cold/sterile minimalism, because "depth, cards, and shadows read as software, which is the opposite of this brand"; the **cream/sand AI-warm default** — the background is Paper `#fafffb`, a near-white pulled toward the brand's own green, not a warm-tinted beige by reflex; and **proteas-everywhere literalism** — fynbos is textural, not decorative, and the 2026-07-28 identity is a sunbird, not a protea.

**Key Characteristics:**
- Open rows and hairlines, not cards — content divided by whitespace and 1px parchment rules
- One loud thing per screen: the terracotta WhatsApp CTA, and nothing else in that colour
- Prices always in the body font, never a display or script face
- Every text colour measured against Paper and documented; the muted grey exists twice so the readable one is the only one used for text
- Mobile-first at ~85% of the audience: 44px+ targets, Save-Data respected, reduced-motion honoured everywhere

## 2. Colors

A committed olive / terracotta / parchment system: green as the voice, a single warm red as the action, and a near-white that leans green rather than beige.

### Primary
- **Fynbos Olive** (`#3d5a3a`): the brand's speaking voice. Section headings, active navigation, the secondary "Send message" button, and the full-bleed footer. At 7.63:1 on Paper it carries body-sized text directly, which is why it appears as text and not only as a fill.

### Secondary
- **Sunbird Terracotta** (`#a8503d`): the action colour, and nothing else. Primary CTAs, the wordmark's "bos", step numerals, form error states, the script kicker. 5.35:1 on Paper. **Terracotta Dark** (`#8a3d2e`) exists for link hover only.

### Tertiary
- **Sage** (`#b9cba0`): a 1.71:1 tint. It is never text and never a fill behind text — it exists only inside `color-mix()` washes and as the hero leaf. **Sage Deep** (`#819872`, 3.11:1) is the readable sage, added 2026-07-28 so the logo's leaf tail and "CREATIVE" letterforms clear the 3:1 WCAG asks of a graphic. **Sage Wash** (`#f1f5ec`) is the input field background and the contact section's tint.

### Neutral
- **Paper** (`#fafffb`): the page. A near-white pulled toward green, not toward warm.
- **Deep Pine** (`#1c2117`): full ink, 16.23:1. Headings and any text that must be maximally sharp. The one constant that survived every palette change.
- **Body Ink** (`#3a3a30`): long-form paragraphs, 11.36:1. Softer than full ink so a wall of copy does not shout.
- **Bark Deep** (`#6c6957`): the readable muted grey, 5.47:1. Secondary copy, ledes, captions, form consent text.
- **Bark Grey** (`#8a8672`): 3.62:1 — **hairlines and decoration only**.
- **Parchment** (`#e4decd`) / **Parchment Soft** (`#f0ecdf`): the ruling. Every divider, border and table rule.
- **On Olive** (`#fbf8f1`, 7.27:1) / **On Olive Muted** (`#cfe0c4`, 5.55:1): the inverted footer pair, measured against olive rather than Paper.

### Named Rules

**The One Action Rule.** Terracotta is reserved for the primary CTA and the wordmark. If you are reaching for it anywhere else, reach for something else. A page with two terracotta elements competing has no primary action.

**The Two Greys Rule.** The muted grey exists twice on purpose. `--bark-grey` (3.62:1) fails AA and is for hairlines and decoration; `--bark-deep` (5.47:1) is for anything a visitor has to read. **Never set text in `--bark-grey`.** This palette has fallen into that trap before and it took a commit to climb out.

**The Green Near-White Rule.** The page background is Paper, tinted toward the brand's own green. Never substitute a warm-tinted near-white — cream, sand, bone, linen, parchment-as-background. The warm-neutral band is the saturated AI default and this brand is explicitly defined against it.

## 3. Typography

**Display Font:** Zilla Slab (with Georgia, serif)
**Body Font:** Work Sans (with system-ui, -apple-system, sans-serif)
**Script Font:** Alex Brush (with cursive) — decorative accent only

**Character:** A true slab serif against a humanist sans — contrast on the serif/sans axis rather than two lookalike families. Zilla Slab reads as printed and confident without being ornamental; Work Sans is unfussy and legible at small sizes on a phone. Alex Brush is the one moment of hand in the system, and it is deliberately never load-bearing.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 1.2rem + 4.6vw, 4rem)`, 1.05): the hero headline only. Peaks at 64px, matching the mockup, and stays under the 6rem shouting ceiling.
- **Headline** (700, `clamp(1.75rem, 1.2rem + 2.4vw, 2.5rem)`, 1.05): interior-page `<h1>`s. Bounded to 16–20ch so they break as two deliberate lines, not four ragged ones.
- **Title** (700, `clamp(1.5rem, 1.15rem + 1.5vw, 2rem)`, 1.05): section headings within a page.
- **Body** (400, 1rem, 1.65): paragraphs. **Bounded to 54–64ch everywhere** — 60ch is the house measure for service rows, pricing bodies and FAQ answers.
- **Label** (600, 0.875rem, 1.65): navigation, buttons, form labels, table cells, captions.
- **Script** (400, `clamp(1.125rem, 1rem + 0.6vw, 1.35rem)`, 1.15): section kickers only, set in terracotta, marked `aria-hidden`, and always duplicated in plain words by the heading directly beneath it.

### Named Rules

**The Legible Price Rule.** Prices are set in the body font, never a display or script face, and never wrap. Hand-lettered or ornamental numerals are ambiguous at a glance, which contradicts "honesty is the aesthetic". This rule outlived two full palette changes; it is not negotiable.

**The Silent Script Rule.** Alex Brush never carries information. If removing the script line would cost the reader anything, it was doing a job it is not allowed to do — move the words into the heading.

**The One H1 Rule.** One `<h1>` per page, and it says what the page is in a plain sentence. Headings are sentences, not labels.

## 4. Elevation

**Flat by default; lift only on action.** Surfaces are flat and separated by 1px parchment hairlines and whitespace. Depth is not the system's vocabulary for structure — it is reserved as a signal that something is pressable. The shadow tokens below exist because the adopted 2026-07-23 mockup drew real depth on the homepage price cards and hero media, and that decision was recorded rather than smuggled in; treat them as the documented exception, not as a licence to box things.

### Shadow Vocabulary
- **CTA** (`box-shadow: 0 6px 18px rgb(168 80 61 / 30%)`): the terracotta primary button at rest. A terracotta-tinted shadow, not a grey one — the button glows in its own colour.
- **CTA hover** (`box-shadow: 0 10px 22px rgb(168 80 61 / 40%)`): paired with `translateY(-2px)`. Shadow and translate move together; a bare translate reads as a jump rather than a rise.
- **Card** (`box-shadow: 0 12px 26px rgb(0 0 0 / 10%)`): homepage price cards only.
- **Panel** (`box-shadow: 0 16px 40px rgb(0 0 0 / 10%)`) / **Media** (`box-shadow: 0 14px 34px rgb(0 0 0 / 14%)`): the SEO illustration and the hero media panel.

### Named Rules

**The Hairline-First Rule.** Reach for a 1px `--parchment` rule before reaching for a border box, and for whitespace before reaching for a hairline. Heavy card, border and shadow treatment is rejected: it reads as software, and this business is a person.

**The Nested-Box Prohibition.** A bordered thing inside a bordered thing is always wrong here. If content needs grouping inside an already-ruled row, group it with spacing.

## 5. Components

Plain-spoken and unmissable: nothing decorated, one thing loud, and every target big enough for a thumb.

### Buttons
- **Shape:** softly squared for the primary CTA (8px), fully pill for the header and secondary actions (999px).
- **Primary:** terracotta with pure-white text (5.41:1 — white rather than Paper, which would sit fractionally lower for no visual gain), 600 weight, `1rem 26px` padding, 3rem minimum height. Carries the CTA shadow at rest.
- **Hover / Focus:** rises 2px with the deepened shadow, plus a single soft diagonal band of 28%-white sweeping across in ~0.6s. The sheen is contained by `overflow: hidden` and is `pointer-events: none`, so it can never intercept the tap. Under reduced-motion the global transition override neutralises it and the band simply never travels.
- **Secondary:** olive pill with Paper text, used for the contact form's "Send message" — deliberately quieter than the WhatsApp CTA beside it, because WhatsApp must stay the loudest thing in that section.
- **Header CTA:** terracotta pill, 2.75rem, label size, desktop only (≥60rem). Below that the sticky bar carries the job.

### Cards / Containers
- **Corner Style:** 10px on the rare real card; `4px 40px 4px 40px` on hero media — the mockup's "organic" shape, two square corners and two heavily rounded.
- **Background:** Paper, or a `color-mix()` sage wash where a section needs to sit back.
- **Shadow Strategy:** see Elevation — flat unless it is a homepage price card or a media panel.
- **Border:** 1px `--parchment`, or none.
- **Internal Padding:** `2rem` block on open rows; the row's own padding, not a box's.

### Inputs / Fields
- **Style:** 12%-sage wash background, 1px parchment border, 10px radius, `0.75rem` padding, full width.
- **Focus:** border shifts to olive; the global focus-visible ring is a 2px terracotta outline at 3px offset.
- **Error:** border shifts to terracotta and a terracotta message appears beneath, wired with `aria-invalid` and `aria-describedby`. The error clears the moment the field is being corrected — leaving it up while someone fixes it reads as nagging.
- **Labels are always visible.** Placeholder-as-label is forbidden.

### Navigation
- **Style:** label size, 500 weight, deep pine, with a 2px `currentColor` underline that grows from the left on hover and focus and stays put for the active route. Active links are olive.
- **Header:** sticky, 4.5rem, 92%-Paper with an 8px backdrop blur and a parchment bottom rule. A transparent Parchment state exists for pages that mark hero media with `data-hero-media`; no page currently does, so the solid state is what ships.
- **Mobile (<60rem):** hamburger at a full 44px target; the nav drops below the bar as full-width rows with parchment separators and the swept underline suppressed.
- **Footer:** inverted on olive, using the On Olive pair.

### Open Row (signature component)
The system's replacement for the card, used on Services, Pricing, FAQ and About. A row is: a 1px parchment top rule, `2rem` block padding, a head line where the name (olive, title size) and the price (body font, 700, `white-space: nowrap`) share a baseline and push apart to the edges of a 60ch measure, then body copy in Bark Deep below. It groups without enclosing. **The head is bounded to the same measure as the body** — left to fill the container, name and price drift far enough apart that they stop reading as one thing.

### Sticky WhatsApp Bar (signature component)
Mobile-only, fixed to the bottom, `z-index: 200` — it must outrank everything. Plain markup with a real `href`: no reveal animation, no data fetch, nothing that could fail or defer. It yields (hides) while any in-page `[data-primary-cta]` is 60% visible, so the hero never shows two identical terracotta pills a thumb apart — and it **fails open**: no observer support, no marked CTA, or a thrown error all leave the bar showing.

## 6. Do's and Don'ts

### Do:
- **Do** reference semantic aliases (`--color-text-muted`, `--color-accent`), not raw hues — but note the aliases resolve to whichever token is correct for the job, so "use a semantic alias" is the rule, not "everything points at a `-deep`".
- **Do** state prices plainly and early, in the body font, on the same baseline as what they buy. Never behind a "contact us" wall.
- **Do** divide content with whitespace and 1px `--parchment` hairlines.
- **Do** bound body copy to 54–64ch and headings to 16–20ch.
- **Do** give every tap target 44px, and every inline link at least 24×24 (WCAG 2.5.8).
- **Do** honour `prefers-reduced-motion` on every animation and `Save-Data` on heavy media. Both are non-negotiable.
- **Do** make reveals enhance an already-visible page. Content is never gated on a class-triggered transition — a crawler, a PDF capture or a hidden tab must still see the section.
- **Do** measure any new colour against Paper before assigning it to text, and write the ratio into `tokens.css`.

### Don't:
- **Don't** use terracotta for anything but the primary CTA and the wordmark.
- **Don't** set text in `--bark-grey` (3.62:1). Ever.
- **Don't** reach for **corporate/agency gloss** — no "we're a team of experts", no stock-photo polish, no invented statistics, testimonials or case studies.
- **Don't** reach for the **generic SaaS-startup look** — no gradient-heavy hero-metric templates, no dashboard chrome, no cold/sterile minimalism. Depth, cards and shadows read as "software", which is the opposite of this brand.
- **Don't** substitute the **cream/sand AI-warm default** for Paper. The warm near-white is the reflex this palette is defined against.
- **Don't** fall into **proteas-everywhere literalism**. Fynbos is textural, not decorative; the identity is a sunbird.
- **Don't** box a box. Nested cards, bordered things inside bordered things, and side-stripe accent borders are all prohibited.
- **Don't** set a price, a heading, or anything load-bearing in Alex Brush.
- **Don't** put a tiny uppercase tracked eyebrow above every section. One script kicker on one section is voice; a kicker on every section is scaffolding.
- **Don't** add a "Most popular" badge, a ranking, a fabricated metric or a mocked-up search position. If the data does not exist, the pixel does not either.
- **Don't** ship an interior page as a single narrow column of text with no compositional move. If it looks like a document rather than a page, it is not finished.

<!-- Audit test: if a section could be lifted onto a generic SaaS landing page without anyone noticing, it has lost the brand. If a visitor cannot find the one terracotta thing within two seconds, the page has no primary action. -->
