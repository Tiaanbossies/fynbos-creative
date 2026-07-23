/**
 * `summary` is the one-line condensation the homepage price cards show; the
 * full `includes` list is what the /pricing page renders. Both come from here
 * so the two presentations can never contradict each other.
 */
export const TIERS = [
  {
    name: 'Seed',
    whoFor: 'For businesses just getting started online',
    setup: 'R1,200 once-off',
    retainer: 'R349/mo',
    summary: 'Hosting · maintenance · Google Business · WhatsApp chat',
    includes: [
      'Your first website, built for you',
      'Hosting & maintenance handled',
      'Get found on Google',
      'WhatsApp chat button',
    ],
  },
  {
    name: 'Bloom',
    whoFor: 'For businesses ready to grow',
    setup: 'R1,200 once-off',
    retainer: 'R699/mo',
    featured: true,
    summary: 'Everything in Seed · monthly optimisation · 1 blog post a month',
    includes: [
      'More custom build',
      'Monthly improvements & updates',
      '1 blog post per month',
      'We keep your online presence tidy',
    ],
  },
  {
    name: 'Grove',
    whoFor: 'For businesses that want it all handled',
    setup: 'Custom quote (online shop/booking)',
    retainer: 'R1,500 – R2,000/mo',
    summary: 'Everything in Bloom · social media · light design · partner network',
    includes: [
      'Online shop or booking system',
      'Done-for-you newsletters',
      'Photography & social content',
      'Full presence management',
    ],
  },
]
