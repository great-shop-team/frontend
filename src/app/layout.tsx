import type { Metadata } from 'next';
import { PT_Sans_Caption, Unbounded } from 'next/font/google';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: 'WEARLY',
    template: 'WEARLY',
  },
  description: 'WEARLY — online clothing store',
};

import Header from '@/widgets/Header/Header';
import Footer from '@/widgets/Footer/Footer';
import MainContent from '@/widgets/MainContent/MainContent';
import Providers from './providers';

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
          <Header />
          <div className="layout-container flex flex-1 flex-col">
            <div className="flex-1">
              <MainContent>{children}</MainContent>
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
