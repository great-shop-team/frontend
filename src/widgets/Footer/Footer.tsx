'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import NewsletterForm from '@/widgets/Footer/NewsletterForm';

type FooterLinkItem = {
  label: string;
  href: string;
  icon?: string;
};

type FooterColumn = {
  title: string;
  links: FooterLinkItem[];
};

const linkClass =
  'cursor-pointer text-sm leading-normal font-normal text-white no-underline transition-opacity duration-200 hover:opacity-75 md:text-base';

function FooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = className ?? linkClass;
  const isExternal = href.startsWith('http');

  if (isExternal) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  const footerColumns: FooterColumn[] = useMemo(
    () => [
      {
        title: t.footer.columns.company.title,
        links: [
          { label: t.footer.columns.company.aboutUs, href: '/about' },
          { label: t.footer.columns.company.careers, href: '/careers' },
          { label: t.footer.columns.company.contacts, href: '/contacts' },
        ],
      },
      {
        title: t.footer.columns.helpCenter.title,
        links: [
          { label: t.footer.columns.helpCenter.shipping, href: '/shipping' },
          { label: t.footer.columns.helpCenter.returns, href: '/returns' },
          { label: t.footer.columns.helpCenter.faq, href: '/faq' },
          { label: t.footer.columns.helpCenter.sizeGuide, href: '/size-guide' },
        ],
      },
      {
        title: t.footer.columns.legal.title,
        links: [
          { label: t.footer.columns.legal.privacyPolicy, href: '/privacy' },
          { label: t.footer.columns.legal.terms, href: '/terms' },
          { label: t.footer.columns.legal.cookies, href: '/cookies' },
        ],
      },
      {
        title: t.footer.columns.social.title,
        links: [
          {
            label: t.footer.columns.social.instagram,
            href: '/instagram',
            icon: '/icons/Instagram.svg',
          },
          {
            label: t.footer.columns.social.facebook,
            href: '/facebook',
            icon: '/icons/Facebook.svg',
          },
          { label: t.footer.columns.social.tiktok, href: '/tiktok', icon: '/icons/TikTok.svg' },
        ],
      },
    ],
    [t],
  );

  const links = (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 md:gap-y-6">
      {footerColumns.map((column) => (
        <div key={column.title} className="flex flex-col gap-4">
          <h2 className="m-0 font-(family-name:--font-unbounded) text-lg leading-tight font-bold text-white md:text-xl">
            {column.title}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {column.links.map((link) => (
              <li key={link.label}>
                <FooterLink
                  href={link.href}
                  className={link.icon ? `${linkClass} inline-flex items-center gap-2` : linkClass}
                >
                  {link.icon ? (
                    <>
                      <Image src={link.icon} alt="" width={24} height={24} aria-hidden />
                      <span>{link.label}</span>
                    </>
                  ) : (
                    link.label
                  )}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <footer className="bg-[#121212] py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] font-(family-name:--font-pt-sans-caption) text-white md:py-12 md:pb-10">
      <div className="layout-container mx-auto box-border w-full max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto] lg:items-stretch lg:gap-x-24 lg:gap-y-0">
          <div className="order-1 flex flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:min-h-full lg:gap-0">
            <Link href="/" className="mb-0 inline-flex max-w-full lg:mb-20" aria-label="WEARLY — home">
              <img
                src="/icons/WEARLY.svg"
                alt="WEARLY Logo"
                width={270}
                height={50}
                className="block h-auto w-[min(100%,200px)] md:w-[270px]"
              />
            </Link>
            <h2 className="m-0 hidden font-(family-name:--font-unbounded) text-2xl leading-tight font-bold tracking-tight whitespace-nowrap lg:block">
              {t.footer.newsletterTitle}
            </h2>
            <div className="hidden min-h-6 flex-1 lg:block" aria-hidden />
          </div>

          <div className="order-2 lg:col-start-2 lg:row-start-1 lg:flex lg:min-h-full lg:flex-col lg:pl-8">
            {links}
            <div className="hidden min-h-6 flex-1 lg:block" aria-hidden />
          </div>

          <div className="order-3 flex flex-col gap-4 lg:col-span-2 lg:row-start-2 lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:items-end lg:gap-x-24 lg:gap-y-0">
            <div className="flex flex-col gap-4 lg:gap-0">
              <h2 className="m-0 font-(family-name:--font-unbounded) text-xl leading-tight font-bold tracking-tight lg:hidden">
                {t.footer.newsletterTitle}
              </h2>
              <NewsletterForm />
            </div>
            <div className="hidden h-0 w-full border-b border-white lg:block lg:pl-8" aria-hidden />
          </div>

          <div className="order-4 flex flex-col gap-6 lg:col-span-2 lg:row-start-3 lg:mt-4 lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center lg:gap-x-24">
            <p className="m-0 text-base leading-normal font-normal text-white">
              {t.footer.copyright}
            </p>
            <div className="flex items-center justify-start gap-3 lg:pl-8">
              <Image src="/icons/applepay.svg" alt="Apple Pay" width={40} height={40} />
              <Image src="/icons/master-card.svg" alt="Mastercard" width={40} height={40} />
              <Image src="/icons/visa-1.svg" alt="Visa" width={40} height={40} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
