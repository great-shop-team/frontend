import type { Metadata } from 'next';

import StubPage from '@/features/stub/ui/StubPage/StubPage';
import { getDictionary } from '@/i18n/dictionaries';
import { defaultLocale } from '@/i18n/config';

export function generateMetadata(): Metadata {
  return { title: getDictionary(defaultLocale).stub.checkout.title };
}

export default function CheckoutPage() {
  return <StubPage pageKey="checkout" />;
}
