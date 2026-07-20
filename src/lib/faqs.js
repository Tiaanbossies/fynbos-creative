/**
 * The questions a small business owner actually asks before saying yes.
 *
 * Every answer traces to an established fact — the build brief (§C, §G, §H),
 * the tiers in tiers.js, or copy already live on the site. Brief §H forbids
 * fabricated statistics and invented terms, so where a hard number isn't set
 * (build time, exact exit terms) the answer stays honest and points the person
 * at a conversation rather than inventing a policy.
 *
 * Answers are plain strings on purpose: the FAQ page keeps cross-links in its
 * own closing note rather than smuggling JSX into this data.
 */
export const FAQS = [
  {
    id: 'cost',
    question: 'How much does a website cost?',
    answer:
      'A standard website is R1,200 once-off to build. After that you pick a monthly plan that keeps it hosted, updated and growing — from R349/mo. The build fee and the monthly plan are separate, and the monthly plan only starts once your site is live.',
  },
  {
    id: 'monthly',
    question: 'Why a monthly plan and not just a once-off fee?',
    answer:
      'A website is not a "build it and forget it" thing. It needs hosting, backups, security updates and small changes over time to keep working and to keep being found on Google. The monthly plan covers all of that so you never have to think about it — and you can move up or down a plan as your business changes.',
  },
  {
    id: 'contract',
    question: 'Am I locked into a contract?',
    answer:
      'No. There is no lock-in contract — you can cancel your monthly plan whenever you like. The relationship works because you want to stay, not because you are stuck.',
  },
  {
    id: 'technical',
    question: 'Do I need to know anything technical?',
    answer:
      'Not a thing. You tell me about your business; I handle the rest — hosting, domains, Google, the lot. There is no jargon and no homework. I explain as much or as little of the technical side as you actually want to hear.',
  },
  {
    id: 'existing-site',
    question: 'I already have a website. Can you help?',
    answer:
      'Yes. That is exactly what Website Rescue & Rebuild is for — an old, broken or abandoned site that needs taking over. I keep what is worth keeping, rebuild the rest, and then look after it going forward. It is priced on how much work it needs, between R2,500 and R8,000.',
  },
  {
    id: 'changes',
    question: 'What if I need changes after it goes live?',
    answer:
      'You message me. Small changes and updates are part of your monthly plan, so you are not billed every time you want to tweak a price, swap a photo or update your hours. For bigger additions I will always give you a straight number first.',
  },
  {
    id: 'shop',
    question: 'Can you build an online shop or a booking system?',
    answer:
      'Yes. Those need more than a standard build, so they are quoted separately once I know what you need — no guesswork and no surprise invoice. Tell me what you are trying to do and I will give you an honest price.',
  },
  {
    id: 'content',
    question: 'Do I have to write all the words myself?',
    answer:
      'No. On the higher plans I take on the ongoing content — blog posts and newsletters that help people find you — and I help shape the copy on your site so it sounds like you and not like a template. You are always in control of what goes live.',
  },
  {
    id: 'who',
    question: 'Who do you work with?',
    answer:
      'Small South African businesses — the ones too small for a big agency and tired of freelancers who disappear. I work with businesses across the country, not just one town, and I am the one person you deal with from start to finish.',
  },
  {
    id: 'start',
    question: 'How do I get started?',
    answer:
      'Send a message on WhatsApp and tell me what you do and what you are stuck on. There is no form to fill in and no commitment — I will tell you honestly whether I can help and what it would look like.',
  },
]
