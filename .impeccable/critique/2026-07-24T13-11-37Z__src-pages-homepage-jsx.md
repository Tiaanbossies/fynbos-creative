---
target: home page
total_score: 33
p0_count: 0
p1_count: 1
timestamp: 2026-07-24T13-11-37Z
slug: src-pages-homepage-jsx
---
# Home page critique — Fynbos Creative

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form has sending/sent/failed + aria-live; scroll progress + active nav underline |
| 2 | Match System / Real World | 4 | Plain language throughout ("no call centre, no jargon") |
| 3 | User Control and Freedom | 3 | Back-to-top, errors clear on edit; little to escape on a marketing page |
| 4 | Consistency and Standards | 4 | Cohesive token system, consistent CTA treatment |
| 5 | Error Prevention | 3 | Form validation + honeypot; noValidate with custom checks |
| 6 | Recognition Rather Than Recall | 4 | Everything visible, labeled nav, no hidden menus |
| 7 | Flexibility and Efficiency | 3 | Three contact paths (WhatsApp / form / email) |
| 8 | Aesthetic and Minimalist Design | 3 | Excellent except the gym-logo clash + offer-row void |
| 9 | Error Recovery | 3 | Form failure hands over WhatsApp + email, plain language, never fakes success |
| 10 | Help and Documentation | 3 | FAQ + privacy note at point of data entry |
| **Total** | | **33/40** | **Good** |

## Anti-Patterns Verdict

Not AI slop. Committed olive/terracotta/parchment palette, Zilla Slab + Work Sans, honesty-as-aesthetic POV. Passes first- and second-order category-reflex tests. Deterministic detector (detect.mjs) returned CLEAN (empty) across all 8 home markup files. No eyebrows, no numbered-section scaffolding abuse (01–04 is a genuine sequence), no gradient text, no glassmorphism, no hero-metric template, no identical-card grids.

## Priority Issues

- **[P1] "One real result" proof shows a clashing gym LOGO, not the site.** The most-emphasized image on the page (the one "hero lift" shadow) is Bossie's Gym's loud red/black/chrome bodybuilder logo. It (a) detonates the restrained brand — the single jarring element on an otherwise cohesive page; (b) doesn't prove the claim ("a bookable, WhatsApp-ready site") — it's the client's logo, not a screenshot of the work. Fix: replace with a real browser/laptop-framed screenshot of the Bossie's Gym site Fynbos built. If none exists, it's a content blocker before the section earns its slot.

- **[P2] Offer-row vertical imbalance ("half-empty" void).** Desktop 1fr/1.6fr grid aligns top; "How it works" (4 short steps) is far shorter than Pricing (3 cards + table), leaving a tall empty left column with the hairline divider running through dead space. Fix: align-self:center the left column, add a small closing element (mini reassurance/CTA) to balance mass, or stop the divider at content.

- **[P2] SEO mock names the studio as the client's search result.** The Google mock shows "Fynbos Creative" ranked #1 for "Plumber near me" — reads as the web agency claiming to be the top plumber. Fix: use a plausible local-business name as the highlighted result, or a query Fynbos would plausibly rank for.

- **[P3] Comparison table restates card content.** The three price cards summarize inclusions in prose, then the table repeats them as a checkmark matrix. Mild redundancy; the table does add tier-by-tier clarity, so defensible. Consider whether both are needed.

## Persona Red Flags

- **Jordan (First-timer):** Well served — obvious first action (WhatsApp), plain language, founder shown up top. Red flag: the gym-logo proof reads as "is this a gym?" for a beat.
- **Casey (Distracted mobile, 85% of audience):** Strong — WhatsApp repeated, sticky bar owns the bottom, poster frame instead of 850 KB video under Save-Data. Watch: the tall 4/5 hero media pushes the founder strip down on small phones; verify the primary CTA sits above heavy scroll.
- **Riley (Stress tester):** Catches the SEO-mock name mismatch and the logo/claim gap. Form-failure path is robust (never fakes success).

## Minor Observations

- Stale CSS comments: base.css still says "Amatic SC ships 400 and 700" though the font is now Zilla Slab; several comments say "Parchment page" though the bg is near-white #fafffb. Comment rot from the palette history — harmless but misleading to the next editor.
- Dev server (Vite 8) renders blank in-browser (module-load quirk); the production build/preview renders perfectly. Not user-facing, but the dev environment has a quirk worth knowing.

## Questions to Consider

- What if the proof section showed the actual Bossie's Gym site in a browser frame — proves more, clashes less?
- Does "How it works" need a closing element to balance pricing, or should the two not share one row?
- Should the SEO mock use a neutral client name so it doesn't read as "Fynbos ranks for plumbers"?
