# Fynbos Creative — Website Build Brief

*Hand this document to Claude Code alongside your asset folders. It contains the non-negotiables, brand context, content structure, and copy already decided — everything needed to build the site correctly on the first pass, not just something that technically fits a generic brief.*

---

## How to use this brief

1. Organize your assets into the folder structure in Section A below, before starting.
2. Give Claude Code this entire document as context, plus your asset folders.
3. Ask for a **page-by-page structural plan first** — confirm it matches this brief before any code is generated.
4. Build and review **one section at a time** (hero → how it works → pricing → proof/testimonials → network → footer) — don't request the whole site in one shot.
5. For anything in your reference/example templates that inspired you, annotate *specifically* what you liked (layout, mood, interaction, tone) — not just "like this site." Ambiguous references produce ambiguous results.

---

## A. Asset folder structure (organize your files this way before handing them over)

```
/fynbos-assets
  /images
    /hero          — hero background/feature images
    /team          — founder photo, any partner photos (with permission)
    /client-work   — screenshots or photos of finished client sites (for proof/case studies)
    /icons         — any icon sets you already have
  /videos           — note in filename or a README where each is meant to go
  /fonts            — actual font files, or exact names + Google Fonts links
  /colors           — this brief already contains the locked palette (Section C) — no separate file needed unless you have brand swatches to share
  /layouts          — wireframes or reference screenshots, labeled by page/section
  /example-templates — reference sites, each with a short note: what specifically you liked (layout / mood / interaction / tone) — required, not optional
```

---

## B. Non-negotiables (hard requirements — do not treat these as flexible)

1. **WhatsApp CTA button must be visible on every page, without scrolling, on mobile.** This is the single most important element on the site — it must render and be tappable immediately, not blocked by other components or animations loading.
2. **The WhatsApp button opens with a pre-filled message**: *"Hi, I'm interested in a website for my business."*
3. **Mobile-first, fast-loading.** 85%+ of the target audience browses on mobile. Test and optimize for mobile load speed specifically, not just desktop.
4. **No corporate jargon anywhere in visible copy.** No "comprehensive solutions," "leverage," "synergy," etc. Plain, warm, direct language only.
5. **A contact form must also exist** (name, contact detail, one-line message — no more fields than that) as a fallback alongside WhatsApp — not link-only.
6. **POPIA-compliant privacy policy** must be present, linked in the footer.
7. **The R1,200 standard build price must be stated clearly and early** — do not hide pricing behind a "contact us" wall. Custom/e-commerce builds are quoted separately.
8. **Deploy to the Absolute Hosting VPS** (Ubuntu Server, already provisioned) — not Vercel/Netlify. If building the React template/showcase track, this is a static build served via Nginx on the same VPS as the WordPress environment.
9. **Respect `prefers-reduced-motion`** for any animation/micro-interaction work.

---

## C. Brand context (locked decisions — use exactly as specified)

**Business name:** Fynbos Creative
**Tagline:** "Rooted in local. Built to grow."
**Primary contact email:** tiaan@fynboscreative.co.za (hello@fynboscreative.co.za as alias)
**Domain:** fynboscreative.co.za

**Positioning (do not deviate from this tone):** Fynbos Creative is *not* a corporate agency. It's a founder-led, relationship-first web services business for small, non-technical South African business owners who feel stuck between expensive agencies and freelancers who disappear. The brand voice is warm, direct, and honest — never salesy, never jargon-heavy. The founder is the visible, named point of contact, not a hidden team behind a "we" — this is a trust *advantage*, not a weakness to disguise.

**Colour palette:**

| Role | Colour | Hex |
|---|---|---|
| Background / neutral | Parchment | `#FBF8F1` |
| Text / dark | Deep Pine | `#1C2117` |
| Primary | Olive | `#3D5A3A` |
| Accent (primary CTA colour) | Terracotta | `#A8503D` |
| Secondary accent | Sage | `#B9CBA0` |
| Tertiary / supporting (borders, secondary text, muted UI) | Bark Grey | `#8A8672` |

**Typography:**
- Headings (all levels): **Zilla Slab**, Bold/SemiBold — sturdy, warm slab serif, free on Google Fonts. Must not read as corporate/SaaS.
- Body text: **Work Sans** (Inter as alternative) — clean, highly legible, mobile-friendly. Mobile legibility prioritized over personality.
- Script accent (sparing use only): **Alex Brush** — reserved for small warmth touches only (e.g. a signature-style flourish under the tagline). Never for body or heading text.

**Imagery style:** real, warm, local photography over stock-photo gloss — small business owners, hands-on work, genuine settings. Nature/fynbos imagery used subtly and texturally (background elements, section dividers) — not literal photos of proteas everywhere. The name already carries the metaphor; visuals shouldn't over-explain it.

**Logo status:** no logo exists yet. Use a text-only wordmark — "Fynbos Creative" in the heading typeface, fynbos green, with an accent word (e.g. "bos") picked out in protea coral.

**Design psychology principles to apply (filtered for this brand specifically):**
- **Halo effect:** aim for "trustworthy and warm," not "aspirational luxury." Clean and uncluttered, but never cold/sterile minimalism.
- **Cognitive fluency (highest priority principle):** reduce decisions, reduce clutter, make the next action obvious. The target visitor scans, they don't read — icon + short label over paragraphs wherever possible.
- **Micro-interactions / peak-end rule:** the WhatsApp CTA click is the "ending" moment to optimize — a small, satisfying confirmation animation or warm transition on click. Tier-card hover states (subtle lift/scale) reinforce the "growth" metaphor. No heavy parallax, no gimmicky motion.

---

## D. Hero copy (use as-is, or as the strong starting point)

**Headline:** "Your business, finally online."
**Subheadline:** "Done-for-you websites for small South African businesses — from R1,200, with ongoing support so you never have to think about it again."
**CTA button text:** "Chat with us on WhatsApp"

---

## E. Site structure and page flow

Build in this order, one section at a time:

| Order | Section | Purpose / content notes |
|---|---|---|
| 1 | **Hero** | Headline + subheadline (Section D above) + WhatsApp CTA, visible without scrolling on mobile |
| 2 | **Proof** | One specific, real result or testimonial — not generic marketing copy. Use real client outcomes if available (see Section F). |
| 3 | **How it works** | 3–4 step visual process, plain language, icon-led:<br>1. Chat to us on WhatsApp — tell us about your business<br>2. We build your site — you approve it, no jargon<br>3. You go live — found on Google, ready for enquiries<br>4. We keep it running — hosting, updates, growth support every month |
| 4 | **Pricing** | Tier cards: **Seed** (R349/mo), **Bloom** (R699/mo), **Grove** (R1,500–2,000/mo) — see Section G for full inclusions. Build fee stated separately: R1,200 flat standard, custom/e-commerce quoted. |
| 5 | **Case studies / portfolio** | Client work grid, grouped by industry if possible (beauty, trades, hospitality, wellness, events). Link out to real client sites where permitted. |
| 6 | **The Fynbos Network** | Featured partners (photographers, social media collaborators) + client spotlight directory — positions Fynbos Creative as a connector, not just a vendor. Optional "Part of the Fynbos Network" badge concept for client sites. |
| 7 | **Contact** | WhatsApp CTA repeated + short contact form (name, contact detail, one-line message) |
| 8 | **Footer** | Business info, POPIA privacy policy link, email (hello@fynboscreative.co.za) |

---

## F. Proof-of-outcomes content (use real data if you have it; placeholder format otherwise)

Case study format to follow:

> *"[Client name], [industry], [location]. Before: no website, relying on word-of-mouth only. After [X time] with Fynbos Creative: [X] website visits, [Y] WhatsApp enquiries, client reports [Z] new customers directly from the site."*

If no real case studies exist yet, build the section with a clearly-marked placeholder structure rather than fabricated numbers — do not invent fake statistics or testimonials.

---

## G. Pricing tiers — full detail

**Build fee (separate from retainer):**
- Standard build: **R1,200 flat**
- E-commerce / custom build: **quoted per scope**

**Monthly retainer tiers:**

| Tier | Price | Includes |
|---|---|---|
| **Seed** | R349/mo | Hosting, basic maintenance, Google Business Profile, WhatsApp click-to-chat |
| **Bloom** | R699/mo | Everything in Seed + monthly optimisation, 1 blog post/month, basic online presence management, newsletter setup (client-writes) |
| **Grove** | R1,500–R2,000/mo | Everything in Bloom + 2–4 blog posts/month, ongoing presence management, fortnightly done-for-you newsletters, light social media management, light graphic design (2 graphics/month), bundled partner network |

**Standalone named service:** Website Rescue & Rebuild — for clients with an old, broken, or abandoned site (R2,500–R8,000, tier-dependent on scope).

---

## H. What NOT to do

- Don't introduce a new visual direction — enhance the fynbos palette and warm tone above, don't replace it with a generic SaaS-startup look
- Don't add features not requested (no e-commerce, user accounts, or complex interactivity beyond what's specified) — this is a marketing/lead-generation site, not a web app
- Don't sacrifice load speed for visual polish
- Don't fabricate testimonials, statistics, or case studies
- Don't hide the R1,200 price behind a "contact us" wall
- Don't let the "team" framing imply staff that don't exist — the founder-led, named-person positioning is intentional (Section C)

---

## I. Deliverable expectations

After each section is built, ask Claude Code for a short summary: what was built, which assets were used from your folders, and any assumptions made where the brief was ambiguous — so you can correct course early rather than discovering a mismatch after the full site is built.
