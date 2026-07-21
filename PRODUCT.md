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

## Moodboard (adopted 2026-07-21)

The client Figma moodboard **replaced the brief §C palette and type stack** on
2026-07-21. `src/styles/tokens.css` now carries the moodboard colours and
Amatic SC + Josefin Sans; the olive/terracotta/parchment system and
Zilla Slab + Work Sans are gone.

Two adaptations were needed and are load-bearing — read `tokens.css`'s contrast
contract before touching colour:

- **Every moodboard hue fails WCAG AA as body text on the cream background**
  (green 3.17:1, pink 3.70:1, orange 2.93:1). Each hue therefore exists twice:
  the true value for fills and 24px+ display, and a ~8%-darker `-deep` variant
  that clears 4.5:1. The semantic aliases point at the `-deep` variants.
- **Prices set in the body font, not Amatic SC.** Hand-lettered numerals are
  ambiguous at a glance, which contradicts "honesty is the aesthetic".

Source: https://www.figma.com/design/vpmY9qidQIV2m6nvagVvDW/Moodboard?node-id=1-2

- **Colours:** green `#71955C`, pink `#D94C7C`, orange `#DD735A`, cream `#FDF6E8`.
  These hexes are *derived, not authoritative*: Figma stores the swatches as stacked
  semi-transparent fills, so the values above are composites accurate to roughly
  ±2 per channel. The cream was sampled off an image layer and is the least reliable
  of the four — confirm it with the client before using it anywhere.
  The green and orange are lighter cousins of Olive/Terracotta; the pink is new and
  sits close to the questionnaire's exclusion of neon (see the `tokens.css` header —
  the questionnaire itself is not in this repo, so the exact section is unconfirmed).
- **Type:** Amatic SC Bold (display) + Josefin Sans Regular (body) — a hand-lettered
  voice, versus the brief's Zilla Slab + Work Sans.
- **Imagery:** Cape landscapes (Table Mountain, coastal ranges), protea close-ups,
  fynbos interiors.
- **Fauna:** Cape Sugarbird, Orange-breasted Sunbird, Klipspringer, Geometric
  Tortoise, Cape Mountain Leopard.
- **Values / icons:** Protea, Trust, Community — single-weight line illustrations.

Two anti-references above are now **superseded** by this adoption and should be
read as historical:

- **"Cream/sand AI-warm default"** — no longer holds; `#FDF6E8` is the background.
- **"Not proteas-everywhere literalism"** — still the standing guidance for
  imagery. The colour and type direction was adopted; the protea/wildlife
  imagery has *not* been implemented, and this constraint still applies to it.

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
