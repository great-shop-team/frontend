export type InfoPageSlug =
  | 'about'
  | 'careers'
  | 'contacts'
  | 'shipping'
  | 'returns'
  | 'faq'
  | 'size-guide'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'instagram'
  | 'facebook'
  | 'tiktok';

export type InfoPageContent = {
  title: string;
  description: string;
  externalUrl?: string;
};

export const infoPages: Record<InfoPageSlug, InfoPageContent> = {
  about: {
    title: 'About Us',
    description:
      'WEARLY is an online clothing store focused on modern essentials. This page will be updated with our brand story soon.',
  },
  careers: {
    title: 'Careers',
    description:
      'We are growing our team. Open positions and application details will appear here soon.',
  },
  contacts: {
    title: 'Contacts',
    description:
      'Need help? Contact details and support hours will be published on this page soon.',
  },
  shipping: {
    title: 'Shipping',
    description:
      'Information about delivery options, timelines, and tracking will be available here soon.',
  },
  returns: {
    title: 'Returns',
    description: 'Our return and exchange policy will be described on this page soon.',
  },
  faq: {
    title: 'FAQ',
    description:
      'Answers to frequently asked questions about orders, payments, and account will appear here soon.',
  },
  'size-guide': {
    title: 'Size Guide',
    description: 'Measurement charts and fit recommendations will be added to this page soon.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal data will be outlined here soon.',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'Terms of use for the WEARLY website and services will be published here soon.',
  },
  cookies: {
    title: 'Cookies',
    description:
      'Details about cookies and similar technologies used on this site will appear here soon.',
  },
  instagram: {
    title: 'Instagram',
    description: 'Follow WEARLY on Instagram for new arrivals and style inspiration.',
    externalUrl: 'https://www.instagram.com/',
  },
  facebook: {
    title: 'Facebook',
    description: 'Join our community on Facebook for updates and announcements.',
    externalUrl: 'https://www.facebook.com/',
  },
  tiktok: {
    title: 'TikTok',
    description: 'Watch WEARLY on TikTok for looks, trends, and behind-the-scenes content.',
    externalUrl: 'https://www.tiktok.com/',
  },
};

export function isInfoPageSlug(slug: string): slug is InfoPageSlug {
  return slug in infoPages;
}
