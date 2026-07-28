import './BrandMark.css'

/** Both variants are the same delivered artwork, cropped differently. */
const SOURCE = {
  mark: '/fynbos-mark.svg',
  lockup: '/fynbos-lockup.svg',
}

/**
 * The Fynbos Creative logo — the sunbird on its own (`mark`), or the sunbird
 * with "Fynbos / CREATIVE" beneath it (`lockup`).
 *
 * Two tones, because the 2026-07-28 artwork is three colours and the contexts it
 * sits in are not all light:
 *
 *   colour  the artwork as delivered, painted as an <img>. Anywhere on Paper.
 *   mono    the same file used as a CSS mask over `currentColor`, so the shape
 *           takes the colour of whatever it sits in. For the footer on Olive and
 *           for the header while it floats over the hero video — the artwork's
 *           own deep green is 1.51:1 on Olive and would simply disappear.
 *
 * One file serves both: a mask samples alpha, not hue, so the coloured SVG masks
 * exactly as a fill-stripped one would. A mono twin would only be a second copy
 * of the artwork free to drift from the first.
 *
 * Both variants are decorative in every current caller — the header link carries
 * an `aria-label`, the footer its adjacent tagline — so both render without an
 * accessible name rather than announcing the logo twice.
 */
function BrandMark({ variant = 'mark', tone = 'colour' }) {
  const className = `brand-mark brand-mark-${variant} brand-mark-${tone}`

  if (tone === 'mono') {
    return <span className={className} aria-hidden="true" />
  }

  return <img className={className} src={SOURCE[variant]} alt="" />
}

export default BrandMark
