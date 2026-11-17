import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import CheckoutPage from '@/features/checkout/ui/CheckoutPage';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-poppins',
});

export function generateMetadata(): Metadata {
  return { title: getDictionary(defaultLocale).checkout.metaTitle };
}

export default function Page() {
  return (
    <div className={poppins.variable}>
      <CheckoutPage />
    </div>
  );
}
