# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # vite build && node scripts/prerender.mjs — BOTH stages matter
npm run lint     # oxlint
npm run preview  # serve dist/ locally; use this to check the real built output
```

There is **no test framework** in this project — no runner, no test files, no `test` script. Do not
invent a `npm test` invocation. Verification here means `npm run build` (the prerender stage throws
on template drift, so it is a real check), `npm run lint`, and looking at the site in a browser.

## Architecture

A React 19 + Vite SPA for a marketing/lead-generation site. No accounts, no API, no database. The
only server-side behaviour is a Formspree POST. Success for this product is a WhatsApp click.

### The two-headed metadata system (the least obvious thing here)

`src/lib/seo.js` is the single source of truth for every route's title/description/robots, and it is
read from **both** runtimes:

- `src/lib/useSeo.js` — a React hook that updates `document.head` on client navigation.
- `scripts/prerender.mjs` — a Node script that runs after `vite build` and writes a static
  `dist/<route>/index.html` per route with that route's metadata, Open Graph/Twitter tags, and
  FAQPage JSON-LD on `/faq`. It also emits `dist/sitemap.xml`.

Consequences:

- **`seo.js` must stay free of React and browser imports.** The Node prerender imports it directly.
  `whatsapp.js` now carries the same constraint — the prerender imports `WHATSAPP_NUMBER` from it.
- The prerender rewrites tags in `index.html` by regex and **throws if a tag is missing**. Editing
  the `<head>` in `index.html` can break the build — that is deliberate, so a template change can
  never silently ship pages carrying stale homepage metadata.
- The hand-written `ProfessionalService` JSON-LD in `index.html` duplicates four values that are
  owned elsewhere: `telephone` is `WHATSAPP_NUMBER` (`whatsapp.js`) in E.164, and `name`/`url`/
  `email` are `SITE`'s. `assertBusinessEntity` compares all four every build and throws on drift.
  A stale number there would send enquiries nowhere while the page still looked correct.
- It prerenders `<head>` only; `#root` stays empty and React hydrates it. Do not expect page bodies
  in `dist/<route>/index.html`.

### Adding a route

A new page needs edits in **three** places or it half-exists:

1. `src/lib/nav.js` — `NAV_LINKS` (Header and Footer both read this, so they cannot drift).
2. `src/lib/seo.js` — a `ROUTE_META` entry (otherwise it falls through to the noindex 404 meta).
3. `src/App.jsx` — a `<Route>` **and** its path added to `BUILT_ROUTES`.

`BUILT_ROUTES` exists because any `NAV_LINKS` entry not in that set is auto-routed to
`PagePlaceholder`. Forgetting it means the placeholder shadows the real page with a duplicate route.

Routes deliberately absent (Work, Industries, Partners) are documented in `nav.js` — they need real
client work and partner consent before shipping. Do not add them back to fill out the nav.

### Styling and design tokens

`src/styles/tokens.css` holds the palette, type scale, and spacing. **Read its header comment before
touching any colour** — it carries a contrast contract, not just values. The brief §C hues restored
on 2026-07-23 are dark enough to carry body text directly (terracotta 5.35:1, olive 7.63:1 on Paper),
so there is **no** blanket `-deep` shadow palette — that was the superseded moodboard arrangement.
Exactly two `-deep` tokens exist, each for a stated reason: `--bark-deep` (5.47:1) because the
mockup's muted grey `#8A8672` is 3.62:1 and fails AA, and `--sage-deep` (3.11:1) because `--sage` is
a 1.71:1 wash that could not carry the logo's leaf tail and "CREATIVE" letterforms. Components should
reference semantic aliases, not raw hues — but note the aliases resolve to whichever token is correct
for the job (`--color-text-muted` → `--bark-deep`; `--color-accent` → raw `--terracotta`), so "use a
semantic alias" is the rule, not "everything points at a `-deep`".

`--color-accent` is reserved for the primary CTA and the wordmark. It is not a general-purpose
highlight.

### The logo

The delivered artwork is the three files in `fynbos-assets/Logo/` dated 2026-07-28 —
`fynbos-creative-mark.svg` (sunbird, 709x709), `fynbos-creative-logo.svg` (sunbird over the
"Fynbos / CREATIVE" wordmark, 1000x1080) and `favicon.svg` (the sunbird on a rounded tile). They are
the source of record and are **not** what the site loads. The earlier `fynbos-badge-olive.svg`
protea badge is the superseded identity; it is kept only as history.

`public/fynbos-mark.svg`, `public/fynbos-lockup.svg` and `public/favicon.svg` are derived from them
by `scripts/build-logo-assets.mjs`. That script is run **by hand**, not by `npm run build` — it
reads `fynbos-assets/`, which the Docker build excludes, so wiring it in would break the one build
that ships. Two things happen on the way out, and both matter if the artwork is ever redelivered —
rerun the script, do not hand-edit the output:

- **Retint.** The artwork ships `#263e2a` / `#c77560` / `#849475`, which are near but not equal to
  `--olive` / `--terracotta` / the sage. They are remapped onto `tokens.css` so the logo cannot sit
  two points off the CTA beside it. The sage could not map onto `--sage` (a 1.71:1 wash on Paper
  that would have erased the leaf tail and "CREATIVE"), so `--sage-deep` was added for it.
- **Rounding.** The bird is 3,460 absolute `M`/`L`/`Z` segments at 2dp; coordinates go to 1dp and
  the repeated `L`s are dropped, roughly halving the file. The generator **throws** if it meets any
  other path command, because rounding relative or curved commands is not safe.

`BrandMark` has two tones, because the artwork is three colours and the mask trick that let one file
serve every context only carries one:

- `colour` — an `<img>` of the artwork as delivered. Anywhere on Paper.
- `mono` — the *same file* as a CSS `mask-image` over `currentColor`, so the shape takes the colour
  of what it sits in. Used by the footer on Olive and by the header while it floats over hero media,
  where the artwork's own deep green measures 1.51:1 and would disappear.

One file serves both because **a mask samples alpha, not hue** — the coloured SVG masks exactly as a
fill-stripped one would, and a mono twin would only be a second copy free to drift from the first.
Note the header's `mono` path is currently unreachable: no page sets `data-hero-media` (see
`Hero.jsx`), so it exists for when hero media returns.

`public/favicon.svg` keeps the delivered tile composition with its fills **baked**, because a browser
tab gives the file no CSS context to inherit from. `public/favicon-192.png` is that file rasterised
for `apple-touch-icon`. The sunbird holds together far better small than the badge it replaced, but
the beak still thins out below about 20px.

**Stylesheet import order in `src/main.jsx` is load-bearing** and must stay above the `App` import:
component CSS is pulled in transitively by `App`, so importing `App` first put every component
stylesheet ahead of `base.css` in the bundle, and component rules that merely tied on specificity
silently lost.

### `src/lib/` — data modules

Content that appears in more than one place lives here as a plain export, not inline in JSX:
`tiers.js` (pricing), `services.js`, `faqs.js` (also feeds JSON-LD), `nav.js`, `whatsapp.js`.
Editing copy usually means editing one of these, not a component.

`motion.js` wraps anime.js. Both helpers no-op under `prefers-reduced-motion`, and `revealOnScroll`
is written so content is never gated on animation — elements near the viewport reveal immediately
and everything else has a bounded timeout, so a non-scrolling crawler or PDF capture still sees the
page.

### Contact form

`src/lib/contact.js` posts to Formspree using `VITE_FORMSPREE_ID`. Vite inlines `VITE_*` at **build**
time, so it must be set before `npm run build` — a runtime env var does nothing. Copy `.env.example`
to `.env` for local work.

Validation is deliberately permissive (the audience is non-technical; a rejected-but-valid phone
number is a lost enquiry). Submission never resolves quietly on failure — if the ID is missing it
throws so the UI shows the WhatsApp/email fallback rather than a false "thanks, we'll be in touch".
Preserve that property when touching this file.

### Deployment

Static build served by Nginx in Docker, behind a Caddy that already runs on the **host** via systemd:

- `Dockerfile` — multi-stage; fails the build loudly if `VITE_FORMSPREE_ID` is empty.
- `docker-compose.yml` — publishes on `127.0.0.1:8080` only. There is no Caddy service in the stack
  on purpose; a second Caddy would fight the host one for ports 80/443.
- `Caddyfile` — **not loaded by compose.** It is the vhost block to append to `/etc/caddy/Caddyfile`
  on the host. A syntax error there takes the other sites on that box down too, so
  `caddy validate` before reloading.
- `nginx.conf` — note the comment on `add_header`: nginx does not merge headers across levels, so a
  `location` block with any `add_header` discards inherited ones. The apparent duplication is
  required; deleting it silently drops security headers for that location.

## Product and design context

`PRODUCT.md` is the authority on audience, voice, anti-references, and the adopted moodboard
(palette, type stack, and what was superseded and when). Consult it before making design or copy
decisions — several constraints there are explicit rejections of defaults an agent would otherwise
reach for (no corporate "we", no invented testimonials or statistics, no generic SaaS look, prices
stated plainly and early rather than behind a "contact us").

`.impeccable/critique/` holds prior UI critique output, useful for knowing what has already been
flagged and addressed.

## Conventions

Commit messages in this repo are conventional-commit prefixed and unusually substantial: they
explain *why* alongside *what*, and state explicitly what was verified and what was **not**. Match
that — a commit here that hides an unverified claim is worse than one that admits the gap.

Comments in this codebase explain rationale and failure modes rather than restating the code. Match
that density and register; several of them document non-obvious traps (nginx headers, stylesheet
order, prerender throwing, Vite build-time inlining) that exist precisely because someone hit them.
