# Product

## Register

brand

## Users

Small, non-technical South African business owners — trades, beauty, hospitality,
wellness, events — who are stuck between expensive agencies that quote in tens of
thousands and freelancers who disappear the moment something breaks. They are
mostly on mobile, often on metered data, and they scan rather than read. Their
job to be done: get findable and look credible online without having to learn how
websites work, and without being left to maintain it alone afterwards.

## Product Purpose

A founder-led marketing / lead-generation site for Fynbos Creative. It sells
done-for-you websites (R1,200 once-off) plus a monthly care plan (from R349/mo),
website rescue-and-rebuild, and ongoing content/photography via a light network of
local partners. Success = a WhatsApp message. Every page's job is to build enough
trust that a hesitant owner taps "Chat with us on WhatsApp". It is not a web app —
no accounts, no dashboards, no e-commerce; complexity is the enemy of the
conversion.

## Brand Personality

Warm, direct, honest. Founder-first: you deal with a named person (Tiaan), and
that is framed as a trust advantage, never disguised behind a corporate "we". The
voice is plain-spoken and jargon-free — it talks to people who do not build
websites for a living. Tagline: "Rooted in local. Built to grow." Emotional goals:
reassurance and credibility over aspiration or hype. Never salesy.

## Anti-references

- **Corporate/agency gloss** — no "we're a team of experts" framing, no stock-photo
  polish, no invented statistics, testimonials, or case studies (brief §H).
- **Generic SaaS-startup look** — no gradient-heavy hero-metric templates, no dashboard
  chrome, no cold/sterile minimalism. Depth, cards, and shadows read as "software",
  which is the opposite of this brand.
- **Cream/sand AI-warm default** — the palette is a committed olive/terracotta/parchment
  system locked in the brief, not a warm-tinted near-white by reflex.
- Not proteas-everywhere literalism; fynbos is textural, not decorative.

## Moodboard (adopted 2026-07-21, REVERSED 2026-07-23 — history only)

**Current state: the brief §C system is in force.** `src/styles/tokens.css` was
restored on 2026-07-23 at the client's direction, from the "Fynbos Home" Claude
Design mockup — olive / terracotta / parchment, Zilla Slab + Work Sans, with
Alex Brush back as the script accent. That reversed *both* the 2026-07-21
moodboard adoption and the 2026-07-22 white/orange amendment. The moodboard hues
are gone from the codebase.

**`tokens.css` is the authority on palette and type, not this section.** Its
header comment carries the contrast contract and is dated later than anything
below. The rest of this section is kept as a record of what was tried and
withdrawn; do not design from it.

What follows described the withdrawn direction:

- ~~The moodboard replaced the brief §C palette and type stack on 2026-07-21;
  `tokens.css` carried the moodboard colours and Amatic SC + Josefin Sans.~~
- ~~Amended 2026-07-22: moodboard cream dropped for plain white, moodboard pink
  retired, accent moved to Sunbird Orange.~~
- ~~Every moodboard hue failed WCAG AA as body text on white (green 3.41:1,
  orange 3.15:1), so each hue existed twice with a ~8%-darker `-deep` variant.~~
  **This no longer describes the codebase:** the restored brief hues are dark
  enough to carry body text directly (terracotta 5.35:1, olive 7.63:1 on Paper),
  so there is no `-deep` shadow palette. Two unrelated `-deep` tokens do exist
  for their own documented reasons — `--bark-deep` (the muted-text grey, since
  the mockup's `#8A8672` is 3.62:1 and fails AA) and `--sage-deep` (added
  2026-07-28 so the logo's leaf tail and "CREATIVE" letterforms clear 3:1).
  Read the contract in `tokens.css` before touching either.
- **Prices set in the body font, never a display face.** Hand-lettered numerals
  are ambiguous at a glance, which contradicts "honesty is the aesthetic". This
  one **still stands** — it outlived the moodboard and applies to Zilla Slab and
  Alex Brush exactly as it did to Amatic SC.

Source: https://www.figma.com/design/vpmY9qidQIV2m6nvagVvDW/Moodboard?node-id=1-2

- **Colours as captured:** green `#71955C`, pink `#D94C7C`, orange `#DD735A`,
  cream `#FDF6E8`. These hexes are *derived, not authoritative*: Figma stores the
  swatches as stacked semi-transparent fills, so the values above are composites
  accurate to roughly ±2 per channel. The green and orange are lighter cousins of
  Olive/Terracotta.
  **In use, green and orange only** — the 2026-07-22 amendment retired the pink,
  and the cream (the least reliable of the four, sampled off an image layer)
  became moot when the background went white.
- **Type:** Amatic SC Bold (display) + Josefin Sans Regular (body) — a hand-lettered
  voice, versus the brief's Zilla Slab + Work Sans.
- **Imagery:** Cape landscapes (Table Mountain, coastal ranges), protea close-ups,
  fynbos interiors.
- **Fauna:** Cape Sugarbird, Orange-breasted Sunbird, Klipspringer, Geometric
  Tortoise, Cape Mountain Leopard.
- **Values / icons:** Protea, Trust, Community — single-weight line illustrations.

**Both anti-references above are in force.** The 2026-07-21 adoption had
suspended the first of them; the 2026-07-23 restoration put it back:

- **"Cream/sand AI-warm default"** — **live guidance again.** The brief's
  olive/terracotta/parchment system is what `tokens.css` carries, and the page
  background is Paper `#fafffb`, so the "warm-tinted near-white by reflex"
  failure mode this bullet warns about is a real risk to guard, not a moot one.
- **"Not proteas-everywhere literalism"** — unchanged throughout. The
  protea/wildlife imagery has *not* been implemented, and this constraint still
  applies to it. Note the 2026-07-28 logo is a **sunbird**, not a protea; the
  superseded protea badge is kept only as history (see `CLAUDE.md`).

### Imagery on `/pricing` and `/faq` — cleared, not yet built (2026-08-02)

A UI critique flagged both pages as text-only and recommended imagery. It has not shipped yet, and
this note exists so the next person does not re-derive the reasoning or resolve it by reaching for
whatever happens to be on disk.

**Cozy Cage Rentals is consented.** The client granted permission on 2026-08-02, so
`public/case-studies/cozy-cage-rentals.jpeg` may be published. It had sat in the repo since the
scaffold commit `6d1ff3c` with no consent recorded, which is why it went unused for so long — the
same standard `nav.js` documents for the absent Work and Industries routes, which wait on real
client work and partner consent rather than being filled in.

**Implementation is deliberately still pending.** It is application work, and it was kept out of the
first CI run so a green or red pipeline would say something about the pipeline rather than about a
page change landing beside it. One screenshot per page, at most.

What may be used: consented client work, screenshots of interfaces actually delivered, original
process diagrams, or assets this business owns. What may not: stock photography, invented case
studies, or Bossie's Gym repeated across every route because it is the one screenshot that exists —
`/services` already carries it, and reuse would turn one real client into decorative wallpaper.
Consent for one client is not consent for the rest.

**Blank space remains the honest answer whenever that list is empty.** "No fabricated proof" below
is not a stylistic preference: a thin page is a smaller failure than a page implying clients it
cannot name.

## Design Principles

- **Honesty is the aesthetic.** Prices are stated plainly and early, never behind a
  "contact us" wall. No fabricated proof. What you see is what you get.
- **One obvious next action.** Cognitive fluency is the highest-priority principle
  (brief §C): reduce decisions, reduce clutter, make the WhatsApp CTA the clear
  destination on every page. Scanners, not readers.
- **The person is the product.** Founder-led, named, visible — trust comes from a real
  human, not a brand facade.
- **Open, not boxed.** Content sits in open rows/columns divided by whitespace and
  hairlines; heavy card/border/shadow treatment is rejected (questionnaire §08).
- **Fast on a phone, on data.** ~85% mobile audience on metered connections; load
  speed and Save-Data/reduced-motion respect are non-negotiable, never sacrificed
  for polish.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Honour `prefers-reduced-motion` on every animation (brief §B.9)
and `Save-Data` for heavy media. Mobile legibility is prioritised over typographic
personality. Semantic structure and keyboard/screen-reader access are expected
(e.g. native `<details>` for the FAQ, skip link, one `<h1>` per page).
