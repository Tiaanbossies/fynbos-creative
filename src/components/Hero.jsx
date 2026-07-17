import { useEffect, useState } from 'react'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import './Hero.css'

const POSTER = '/video/preview-frame.jpg'
const VIDEO = '/video/idea1-compressed.mp4'

/**
 * Two reasons to never fetch the 847 KB video.
 *
 * Reduced-motion is brief §B.9. Save-Data matters more than it looks here: the
 * audience is 85%+ mobile on South African data, and a visitor who has asked
 * their browser to conserve data has told us not to spend ~850 KB on
 * decoration. Both cases still get the poster frame, so the hero still reads
 * as cinematic — it just doesn't move.
 */
function shouldSkipVideo() {
  if (typeof window === 'undefined') return true

  const reducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const saveData = navigator.connection?.saveData === true

  return Boolean(reducedMotion || saveData)
}

/**
 * Full-screen cinematic hero — the bugatti.com treatment named in
 * questionnaire §08, over the warm fynbos footage.
 *
 * Load order is deliberate and is the whole point of this component:
 *   1. Headline, subheadline and CTA are plain markup — they paint first.
 *   2. The poster frame (78 KB) is a CSS background, so the hero looks
 *      finished immediately.
 *   3. The video (847 KB) mounts only after first paint, and only if allowed.
 *
 * Brief §B.1 requires the CTA to render "not blocked by other components or
 * animations loading". So the video can be slow, blocked, or absent and the
 * conversion path is untouched.
 */
function Hero() {
  const [showVideo, setShowVideo] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    if (shouldSkipVideo()) return
    setShowVideo(true)
  }, [])

  return (
    <section className="hero" data-hero-media>
      <div className="hero-media" style={{ backgroundImage: `url(${POSTER})` }}>
        {showVideo && (
          <video
            className={isVideoReady ? 'hero-video is-ready' : 'hero-video'}
            src={VIDEO}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setIsVideoReady(true)}
          />
        )}
        <div className="hero-scrim" />
      </div>

      <div className="container hero-content">
        <h1 className="hero-headline">Your business, finally online.</h1>
        <p className="hero-sub">
          Done-for-you websites for small South African businesses — from
          R1,200, with ongoing support so you never have to think about it
          again.
        </p>
        <a
          className="hero-cta btn-accent"
          data-primary-cta
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('hero')}
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </section>
  )
}

export default Hero
