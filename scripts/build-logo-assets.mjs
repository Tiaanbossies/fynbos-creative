/**
 * One-shot: turns the delivered sunbird artwork into the four assets the site
 * loads. Supersedes the 2026-07-27 script of the same name, which was written
 * for the old 23-path VTracer badge — different artwork, different structure
 * (one fill, per-path translate), so nothing there survives reuse.
 *
 *   fynbos-assets/Logo/fynbos-creative-mark.svg   (709x709, 3 paths, 3 fills)
 *     -> public/fynbos-mark.svg      retinted, square viewBox
 *   fynbos-assets/Logo/fynbos-creative-logo.svg   (1000x1080, bird + wordmark)
 *     -> public/fynbos-lockup.svg    retinted, trimmed to its ink
 *   fynbos-assets/Logo/favicon.svg   (709x709 tile)
 *     -> public/favicon.svg          retinted, fills baked
 *
 * ONE FILE, TWO RENDERINGS. The logo is now three colours, and the mask trick
 * that let one file serve every context only carries one — so the site paints it
 * full colour on Paper, and keeps the mask for the two inverted contexts (the
 * footer on Olive, the header over the hero video) where the artwork's own deep
 * green measures 1.51:1 and would vanish. That needs no second file: a CSS mask
 * samples alpha, not hue, so these coloured files mask exactly as the old
 * fill-stripped ones did. Emitting a mono twin would only create something that
 * could drift from its colour original. See BrandMark.jsx.
 *
 * RETINT. The delivered fills are close to, but not, the tokens.css palette, and
 * a logo two points off the CTA beside it reads as a mistake. Mapped at the
 * user's direction (2026-07-28). The sage is the one that could not map onto its
 * obvious token: --sage is a 1.71:1 wash on Paper and the leaf tail would have
 * disappeared, so it maps to the new --sage-deep, which is --sage mixed 45%
 * toward --olive. Same split, same reason, as the --bark-grey/--bark-deep pair
 * tokens.css already documents.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/*
 * Run by hand — `node scripts/build-logo-assets.mjs` — and never from
 * `npm run build`. It reads fynbos-assets/, which the Docker build excludes, so
 * wiring it into the build would fail the one build that actually ships.
 */
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(REPO, 'fynbos-assets/Logo')
const OUT = join(REPO, 'public')

/** Delivered fill -> tokens.css value. Keys are exactly what the artwork ships. */
const RETINT = {
  '#c77560': '#a8503d', // -> --terracotta   protea wing and throat
  '#849475': '#819872', // -> --sage-deep    leaf tail, "CREATIVE"
  '#263e2a': '#3d5a3a', // -> --olive        bird body, "Fynbos"
  '#fffdf8': '#fafffb', // -> --paper        favicon tile only
}

/**
 * Where the composed lockup's ink actually sits inside its 1000x1080 canvas,
 * from getBBox() in Chrome. Measured rather than scanned: the two wordmark paths
 * are text converted to outlines and use relative q/v/h commands, so counting
 * coordinate pairs — which is exact for the bird's absolute polylines — would be
 * meaningless for them.
 *
 *   bird group  222.74, 52.24   548.47 x 537.29
 *   "Fynbos"     88.03, 666.96  821.90 x 254.00
 *   "CREATIVE"  274.52, 963.11  450.96 x  45.51
 */
const LOCKUP_BOX = { x: 88.03, y: 52.24, w: 821.9, h: 956.38 }

const round = (n) => Number(n.toFixed(1))

/**
 * Pulls <path> elements out in document order with their fill and geometry. The
 * delivered files write attributes in different orders (and Inkscape puts the
 * lockup's wordmark fill inside a style="" rather than a fill=""), so match the
 * element as a whole and dig the attributes out rather than assuming a shape.
 */
function readPaths(file) {
  const svg = readFileSync(join(SRC, file), 'utf8')
  const paths = [...svg.matchAll(/<path\s([^>]*?)\/?>/gs)].map((m) => {
    const attrs = m[1]
    return {
      fill: (attrs.match(/\bfill(?::|=")\s*(#[0-9a-f]{6})/i) ?? [])[1] ?? null,
      d: (attrs.match(/\bd="([^"]+)"/) ?? [])[1] ?? '',
    }
  })
  return { svg, paths }
}

/**
 * Rewrites the bird's polylines to 1dp and drops the repeated `L` commands that
 * an implicit lineto already implies. Roughly a two-thirds saving on a file that
 * ships 3,460 segments at 2dp. At the largest size the mark is ever drawn —
 * 8.5rem in the footer — one viewBox unit is 0.021px, so a tenth of one is three
 * orders of magnitude below a device pixel.
 *
 * Throws on anything that is not M/L/Z. Rounding is only safe because these are
 * absolute commands: with relative ones the error would accumulate along the
 * path, and if the artwork is ever redelivered with curves this must fail rather
 * than quietly emit something that no longer traces the same shape.
 */
function compress(d) {
  const alphabet = new Set(d.match(/[A-Za-z]/g))
  for (const letter of alphabet) {
    if (!'MLZ'.includes(letter)) {
      throw new Error(
        `compress: expected absolute M/L/Z polylines, found "${letter}". ` +
          `The artwork's shape changed — rounding is not safe here, rework this first.`,
      )
    }
  }

  const out = []
  let pending = null // the command letter still to be written, or null once implicit
  for (const token of d.match(/[MLZ]|-?\d+(?:\.\d+)?[,\s]+-?\d+(?:\.\d+)?/g)) {
    if (token === 'Z') {
      out.push('Z')
      pending = null
    } else if (token === 'M' || token === 'L') {
      pending = token
    } else {
      const [x, y] = token.split(/[,\s]+/).map((n) => round(Number(n)))
      out.push(`${pending ?? ''}${x} ${y}`)
      // After an explicit M the next pairs are implicitly L, not M — so only an
      // L may be dropped, and an M has to hand over to one.
      pending = pending === 'M' ? 'L' : null
    }
  }
  return out.join(' ').replace(/\s+([LZ])/g, '$1')
}

/** Square viewBox centred on the mark's ink, so callers never see its real ratio. */
function squareBox(paths) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const { d } of paths) {
    const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
    for (let i = 0; i + 1 < nums.length; i += 2) {
      x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i])
      y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1])
    }
  }
  const side = Math.max(x1 - x0, y1 - y0)
  return [
    round(x0 - (side - (x1 - x0)) / 2),
    round(y0 - (side - (y1 - y0)) / 2),
    round(side),
    round(side),
  ].join(' ')
}

const retint = (fill) => {
  const mapped = RETINT[fill?.toLowerCase()]
  if (!mapped) throw new Error(`retint: artwork ships an unmapped fill "${fill}"`)
  return mapped
}

/* --- read and check the two sources -------------------------------------- */

const { paths: markPaths } = readPaths('fynbos-creative-mark.svg')
const { svg: logoSvg, paths: logoPaths } = readPaths('fynbos-creative-logo.svg')
const { svg: faviconSvg } = readPaths('favicon.svg')

if (markPaths.length !== 3) {
  throw new Error(`Expected 3 paths in the mark, found ${markPaths.length}`)
}
if (logoPaths.length !== 5) {
  throw new Error(`Expected 5 paths in the lockup (3 bird + 2 wordmark), found ${logoPaths.length}`)
}
for (const { fill } of [...markPaths, ...logoPaths]) retint(fill) // fail before writing

/** The bird sits in a transformed group inside the lockup; keep it verbatim. */
const groupTransform = logoSvg.match(/transform="([^"]+)"/)[1]

const bird = markPaths.map(({ d }) => compress(d))
const wordmark = logoPaths.slice(3) // "Fynbos" then "CREATIVE" — curves, left as delivered

const MARK_BOX = squareBox(markPaths)

/* --- emit ----------------------------------------------------------------- */

const ATTRS = 'fill-rule="evenodd" clip-rule="evenodd"'
// evenodd is load-bearing: the bird's eye is a hole in the body path, not a
// white shape drawn over it. Under the default nonzero rule it fills in.

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_BOX}" role="img" aria-label="Fynbos Creative">
<title>Fynbos Creative</title>
<g ${ATTRS}>
${markPaths.map(({ fill }, i) => `<path fill="${retint(fill)}" d="${bird[i]}"/>`).join('\n')}
</g>
</svg>
`

const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOCKUP_BOX.x} ${LOCKUP_BOX.y} ${LOCKUP_BOX.w} ${LOCKUP_BOX.h}" role="img" aria-label="Fynbos Creative">
<title>Fynbos Creative</title>
<g ${ATTRS} transform="${groupTransform}">
${markPaths.map(({ fill }, i) => `<path fill="${retint(fill)}" d="${bird[i]}"/>`).join('\n')}
</g>
${wordmark.map(({ fill, d }) => `<path fill="${retint(fill)}" d="${d}"/>`).join('\n')}
</svg>
`

/**
 * The favicon keeps its delivered composition — the bird on a rounded tile,
 * uncropped. Only the four fills move onto the palette. A browser tab gives the
 * file no CSS to inherit from, so these are baked and cannot use currentColor.
 */
const favicon = faviconSvg
  .replace(/fill="(#[0-9a-fA-F]{6})"/g, (_, fill) => `fill="${retint(fill)}"`)
  .replace(/d="([^"]+)"/g, (whole, d) => (/^[MLZ\d\s.,]+$/.test(d) ? `d="${compress(d)}"` : whole))

const outputs = [
  ['fynbos-mark.svg', mark],
  ['fynbos-lockup.svg', lockup],
  ['favicon.svg', favicon],
]

for (const [name, contents] of outputs) {
  writeFileSync(join(OUT, name), contents, 'utf8')
  console.log(`${name.padEnd(24)} ${(contents.length / 1024).toFixed(1)} KB`)
}

console.log(`\nmark viewBox   ${MARK_BOX}`)
console.log(`lockup viewBox ${LOCKUP_BOX.x} ${LOCKUP_BOX.y} ${LOCKUP_BOX.w} ${LOCKUP_BOX.h}`)
console.log(`lockup ratio   ${round(LOCKUP_BOX.w)} / ${round(LOCKUP_BOX.h)}`)
