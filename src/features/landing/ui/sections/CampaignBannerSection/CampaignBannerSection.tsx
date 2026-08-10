'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function CampaignBannerSection() {
  const { campaign } = useLandingData();

  return (
    <div className={landingSection.breakout}>
      <section className={`${landingSection.section} w-screen`} aria-label={campaign.image.alt}>
        <div className="relative aspect-1440/850 w-full overflow-hidden md:h-[850px] md:aspect-auto">
          <Image
            src={campaign.image.src}
            alt={campaign.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1440px"
            quality={80}
            priority
            className="z-0 object-cover object-[center_20%]"
          />
          <div className="layout-gutter absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-20">
            <div className="flex max-w-[421px] flex-col items-start gap-3">
              <h2 className="m-0 font-(family-name:--font-unbounded) text-[25px] font-medium tracking-wide text-black uppercase">
                {campaign.title}
              </h2>
              <p className="m-0 font-(family-name:--font-pt-sans-caption) text-base font-normal text-black">
                {campaign.subtitle}
              </p>
              <Link
                href={campaign.href}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-black bg-transparent px-[38px] font-(family-name:--font-unbounded) text-base font-normal text-black no-underline transition-opacity hover:opacity-85"
              >
                {campaign.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
