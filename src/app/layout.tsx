import type { Metadata } from 'next';
import { PT_Sans_Caption, Unbounded } from 'next/font/google';

import '@/styles/global.css';
import AppShell from './AppShell';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'WEARLY',
    template: 'WEARLY',
  },
  description: 'WEARLY — online clothing store',
};

const ptSansCaption = PT_Sans_Caption({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-pt-sans-caption',
  weight: ['400', '700'],
});

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ptSansCaption.variable} ${unbounded.variable} ${ptSansCaption.className}`}
    >
      <body className="flex min-h-screen flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
