export interface NavItem {
  name: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Mission & Vision', href: '/mission-vision' },
  { name: 'Initiatives', href: '/initiatives' },
  { name: 'Contact', href: '/contact' },
];

/** Footer "Explore" list: the main pages plus Donate (Donate is the header's call-to-action button). */
export const footerNav: NavItem[] = [...mainNav, { name: 'Donate', href: '/donate' }];

export const policyNav: NavItem[] = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
];
