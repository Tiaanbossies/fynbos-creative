import './Values.css'

/**
 * The mockup's three-up values row.
 *
 * All three cards were blocked as of 2026-07-22 and were cleared by the client
 * on 2026-07-23. Two of them make claims the rest of the site is not otherwise
 * allowed to make, so the clearance is what they rest on:
 *
 *   - "No hostage situations" states that the customer owns their domain from
 *     day one and keeps the design after 12 months. Both claims had previously
 *     been dropped as unverified.
 *   - "The Fynbos Network" describes real third-party photographers and social
 *     media partners. Brief §H forbids inventing third parties, so this card
 *     stands on the client's confirmation that the partners and their consent
 *     exist. It names no one, which keeps it truthful without exposing a
 *     partner who has not agreed to be listed.
 *
 * If either clearance is ever withdrawn, delete the card — do not soften it.
 */
const VALUES = [
  {
    id: 'local',
    title: 'Rooted in local. Built to grow.',
    body: 'Inspired by the Cape fynbos, we are a founder-led business that stays with you for the journey, not just the sale.',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" fill="var(--olive)" />
        <path
          d="M12 8V4M12 20v-4M8 12H4M20 12h-4"
          stroke="var(--terracotta)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: 'hostage',
    title: 'No “hostage” situations.',
    body: 'You own your domain from day one, and after 12 months, the website design is 100% yours to keep.',
    icon: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" fill="var(--olive)" />
        <path
          d="M8 11V7a4 4 0 118 0"
          stroke="var(--terracotta)"
          strokeWidth="2"
          fill="none"
        />
      </>
    ),
  },
  {
    id: 'network',
    title: 'The Fynbos Network.',
    body: 'Access a vetted local team of photographers and social media experts to scale your brand when you are ready.',
    icon: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="var(--terracotta)"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="6" r="2" fill="var(--olive)" />
        <circle cx="7" cy="15" r="2" fill="var(--olive)" />
        <circle cx="17" cy="15" r="2" fill="var(--olive)" />
      </>
    ),
  },
]

function Values() {
  return (
    <section className="section values" aria-label="How we work">
      <div className="container values-grid">
        {VALUES.map((value) => (
          <div className="value" key={value.id}>
            <svg
              className="value-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {value.icon}
            </svg>
            <h3 className="value-title">{value.title}</h3>
            <p className="value-body">{value.body}</p>
          </div>
        ))}

        {/* Closing protea mark — the row's full stop, per the mockup. */}
        <svg
          className="values-mark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z"
            fill="var(--terracotta)"
          />
          <path
            d="M12 6c-1.6 2.4-3 4.3-3 6.6A3 3 0 0012 16a3 3 0 003-3.4C15 10.3 13.6 8.4 12 6z"
            fill="var(--olive)"
          />
        </svg>
      </div>
    </section>
  )
}

export default Values
