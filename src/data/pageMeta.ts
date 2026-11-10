/**
 * Single source of truth for every indexable route: its <title>, meta
 * description, schema.org page type and sitemap hints. Used by
 *  - the build-time prerenderer (static HTML head + sitemap.xml)
 *  - the client router (keeps the head correct on in-app navigation)
 *
 * Keep titles <= ~60 characters and descriptions <= ~160 characters.
 */

export type SchemaPageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export interface PageMeta {
  title: string;
  description: string;
}

export interface PageEntry extends PageMeta {
  /** Short label used in breadcrumbs */
  name: string;
  schemaType: SchemaPageType;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  priority: number;
  /** Source files whose git history determines the sitemap <lastmod> */
  sources: string[];
}

export const pages: Record<string, PageEntry> = {
  '/': {
    title: 'Fairclaim Foundation | A fairer future. Built together.',
    name: 'Home',
    description:
      'Fairclaim Foundation aims to make fairness easier to understand and pursue through public education, constructive dialogue and equitable opportunity.',
    schemaType: 'WebPage',
    changefreq: 'monthly',
    priority: 1.0,
    sources: ['src/pages/Home.tsx', 'src/data/organization.ts', 'src/data/initiatives.ts'],
  },
  '/about': {
    title: 'About Fairclaim Foundation | Purpose & Values',
    name: 'About',
    description:
      'Fairness is a shared responsibility. Learn about the purpose, guiding principles and intended direction of Fairclaim Foundation.',
    schemaType: 'AboutPage',
    changefreq: 'monthly',
    priority: 0.8,
    sources: ['src/pages/About.tsx', 'src/data/organization.ts'],
  },
  '/mission-vision': {
    title: 'Mission & Vision | Fairclaim Foundation',
    name: 'Mission & Vision',
    description:
      'Fairclaim Foundation’s mission and vision in plain language: informed participation, constructive dialogue and dignity for every person.',
    schemaType: 'WebPage',
    changefreq: 'monthly',
    priority: 0.8,
    sources: ['src/pages/MissionVision.tsx', 'src/data/organization.ts'],
  },
  '/initiatives': {
    title: 'Proposed Initiatives & Focus Areas | Fairclaim Foundation',
    name: 'Initiatives',
    description:
      'Explore the four proposed focus areas expressing Fairclaim Foundation’s commitment to fairness, civic understanding and constructive participation.',
    schemaType: 'CollectionPage',
    changefreq: 'monthly',
    priority: 0.8,
    sources: ['src/pages/Initiatives.tsx', 'src/data/initiatives.ts'],
  },
  '/donate': {
    title: 'Donate | Fairclaim Foundation',
    name: 'Donate',
    description:
      'Support Fairclaim Foundation. Give securely online with UPI, cards or net banking, or scan a UPI QR and confirm your gift on WhatsApp.',
    schemaType: 'WebPage',
    changefreq: 'monthly',
    priority: 0.9,
    sources: ['src/pages/Donate.tsx', 'src/data/donation.ts', 'src/components/donate/DonationWidget.tsx'],
  },
  '/contact': {
    title: 'Contact Fairclaim Foundation',
    name: 'Contact',
    description:
      'Share a question, an idea or an interest in collaborating with Fairclaim Foundation. Start a conversation through our contact page.',
    schemaType: 'ContactPage',
    changefreq: 'yearly',
    priority: 0.6,
    sources: ['src/pages/Contact.tsx'],
  },
  '/privacy-policy': {
    title: 'Privacy Policy (draft) | Fairclaim Foundation',
    name: 'Privacy Policy',
    description: 'Draft privacy information for visitors to the Fairclaim Foundation website.',
    schemaType: 'WebPage',
    changefreq: 'yearly',
    priority: 0.3,
    sources: ['src/pages/PrivacyPolicy.tsx'],
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions (draft) | Fairclaim Foundation',
    name: 'Terms & Conditions',
    description: 'Draft terms of use for visitors to the Fairclaim Foundation website.',
    schemaType: 'WebPage',
    changefreq: 'yearly',
    priority: 0.3,
    sources: ['src/pages/TermsConditions.tsx'],
  },
};

export const notFoundMeta: PageMeta = {
  title: 'Page not found | Fairclaim Foundation',
  description: 'The page you were looking for could not be found.',
};
