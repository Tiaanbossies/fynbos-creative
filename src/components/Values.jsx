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
 *
 * The mockup closed this row with a terracotta protea glyph. It is gone, for
 * two reasons that arrived together: at >=60rem it was a fourth grid column,
 * so it floated to the right of the three values, vertically centred against
 * nothing and squeezing the columns beside it — it read as an orphan, not as
 * punctuation. And a protea is the *superseded* identity (see CLAUDE.md — the
 * delivered artwork is a sunbird); echoing the retired badge on the homepage
 * is the one place that costs the most. Deleted rather than re-placed: the
 * hairline dividers already close the row.
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
      </div>
    </section>
  )
}

export default Values
