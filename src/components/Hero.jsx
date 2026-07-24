import { useEffect, useState } from 'react'
import { buildWhatsAppLink, trackWhatsAppClick } from '../lib/whatsapp.js'
import './Hero.css'

const POSTER = '/video/preview-frame.jpg'
const VIDEO = '/video/idea1-compressed.mp4'
const FOUNDER = '/team/tiaan.jpeg'

/**
 * Two reasons to never fetch the 847 KB video.
 *
 * Reduced-motion is brief §B.9. Save-Data matters more than it looks here: the
 * audience is 85%+ mobile on South African data, and a visitor who has asked
 * their browser to conserve data has told us not to spend ~850 KB on
 * decoration. Both cases still get the poster frame, so the hero panel still
 * reads as cinematic — it just doesn't move.
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
 * Split hero — the "Fynbos Home" mockup composition: copy left (1.3fr), media
 * right (1fr), founder strip under the CTA.
 *
 * This replaced the full-bleed video hero on 2026-07-23. Two consequences are
 * load-bearing:
 *
 *   1. The media is now a bounded panel, NOT a full-screen backdrop, so the
 *      hero deliberately does not carry `data-hero-media`. That attribute is
 *      what puts Header into its transparent Parchment state; with no dark
 *      footage behind the header, that state would be Parchment-on-Parchment.
 *      Measured before the change, the transparent nav links ran 3.74–3.87:1
 *      over the poster frame, under the 4.5:1 that 14px text needs. The solid
 *      header is both the correct treatment and the accessible one.
 *   2. The video keeps every guard it had. Poster paints first as a CSS
 *      background; the video mounts after first paint and only when allowed.
 *
 * Brief §B.1 still holds: headline, subheadline and CTA are plain markup, so
 * the conversion path is untouched if the video is slow, blocked or absent.
 */
function Hero() {
  const [showVideo, setShowVideo] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    if (shouldSkipVideo()) return
    setShowVideo(true)
  }, [])

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-headline">
            Your business,
            <br />
            <span className="hero-headline-accent">finally</span> online.
          </h1>
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

          {/* The mockup's trust move: the founder is named and shown at the
              top of the page, not held back for /about. */}
          <div className="hero-founder">
            <img
              className="hero-founder-photo"
              src={FOUNDER}
              alt="Tiaan, founder of Fynbos Creative"
              width="112"
              height="112"
              decoding="async"
            />
            <div>
              <p className="hero-founder-name">
                Hi, I&rsquo;m Tiaan — founder of Fynbos Creative.
              </p>
              <p className="hero-founder-blurb">
                Working with small businesses right across South Africa.
                You&rsquo;ll talk to me directly — no call centre, no jargon.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-media-wrap">
          <div
            className="hero-media"
            style={{ backgroundImage: `url(${POSTER})` }}
          >
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
          </div>

          {/* The mockup's sage leaf, tucked over the panel's top-right corner. */}
          <svg
            className="hero-leaf"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z"
              fill="var(--sage)"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Hero
