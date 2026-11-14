/**
 * Organization facts. Only confirmed facts are rendered publicly.
 *
 * Nothing here has been independently verified. Registration details,
 * founding date, leadership, programs and contact channels are intentionally
 * absent until the foundation confirms them.
 */

export const organization = {
  name: 'FAIRCLAIM FOUNDATION',
  shortName: 'Fairclaim Foundation',
  tagline: 'A fairer future. Built together.',
  developerCredit: 'Website developed by Legendary One Technologies',
  statusNote:
    'Fairclaim Foundation’s registration status, leadership and programs are still being confirmed. This website describes its purpose and proposed directions only.',

  /** Confirmed public contact details. Leave empty until the foundation confirms them. */
  contact: {
    email: '' as string,
    phone: '' as string,
    address: '' as string,
  },

  /** Verified social profiles only. */
  social: [
    { platform: 'Instagram', url: 'https://www.instagram.com/fairclaimfoundations/' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@FairclaimFoundations' },
    { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61595937069935' },
  ],
};

/**
 * A provisional routing address was supplied in earlier drafts. It is kept
 * here for the handoff only and is NOT displayed anywhere on the website.
 */
export const provisionalContact = {
  email: 'contact@fairclaimfoundation.org',
  confirmed: false,
};

export const hasConfirmedContact = Boolean(
  organization.contact.email || organization.contact.phone || organization.contact.address,
);

export interface Principle {
  title: string;
  description: string;
}

/** Short principles shown in the “Why Fairclaim” section. */
export const purposePrinciples: Principle[] = [
  { title: 'Clarity', description: 'Make complex ideas easier to understand.' },
  { title: 'Dignity', description: 'Keep people and their perspectives at the center.' },
  { title: 'Participation', description: 'Create room for informed, constructive dialogue.' },
];

/** The four guiding principles. */
export const guidingPrinciples: Principle[] = [
  {
    title: 'Procedural fairness',
    description:
      'Fair processes begin with balanced consideration, clear reasoning, and the opportunity to be heard.',
  },
  {
    title: 'Community dignity',
    description: 'Every person deserves respect, understandable information, and room to participate.',
  },
  {
    title: 'Open collaboration',
    description: 'Progress grows through listening, shared learning, and constructive relationships.',
  },
  {
    title: 'Responsible stewardship',
    description: 'Careful decisions and clear communication are essential to earning confidence.',
  },
];

export const mission =
  'To advance understanding of fairness, encourage constructive civic dialogue, and support more informed participation in the processes that shape everyday life.';

export const vision =
  'A society where every person has a meaningful opportunity to be heard, understand their options, and be treated with dignity.';

export interface Step {
  title: string;
  description: string;
}

export const approachSteps: Step[] = [
  { title: 'Listen', description: 'Begin with people’s experiences, questions, and perspectives.' },
  {
    title: 'Understand',
    description: 'Explore the information, processes, and barriers that shape the issue.',
  },
  {
    title: 'Connect',
    description: 'Identify opportunities for learning, dialogue, and constructive collaboration.',
  },
];

export interface Faq {
  question: string;
  answer: string;
  links?: { label: string; to: string }[];
}

export const faqs: Faq[] = [
  {
    question: 'What is Fairclaim Foundation’s focus?',
    answer:
      'Its stated purpose centers on fairness, civic understanding, constructive dialogue, and equitable participation.',
  },
  {
    question: 'Are the listed initiatives currently active?',
    answer:
      'The areas presented on this website are proposed focus areas. Any confirmed program details should be published with their scope and availability.',
    links: [{ label: 'See the proposed focus areas', to: '/initiatives' }],
  },
  {
    question: 'How can I express interest in collaborating?',
    answer: 'Use the contact page to share your area of interest and a brief introduction.',
    links: [{ label: 'Go to the contact page', to: '/contact' }],
  },
  {
    question: 'Where can I learn more about the foundation’s direction?',
    answer:
      'Visit the About and Mission & Vision pages for more on its purpose and guiding principles.',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Mission & Vision', to: '/mission-vision' },
    ],
  },
];
