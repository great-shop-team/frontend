'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function CampaignBannerSection() {
  const { campaign } = useLandingData();

  return (
    <div className={landingSection.breakout}>
      <section className={`${landingSection.section} w-full`} aria-label={campaign.image.alt}>
        <div className="relative min-h-[480px] w-full overflow-hidden sm:min-h-[560px] md:h-[850px] md:min-h-0">
          <Image
            src={campaign.image.src}
            alt={campaign.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1440px"
            quality={80}
            priority
            className="z-0 object-cover object-[center_20%]"
          />
          <div className="layout-gutter absolute inset-0 z-10 flex flex-col justify-end pb-10 md:pb-20">
            <div className="flex max-w-[421px] flex-col items-start gap-3">
              <h2 className="m-0 font-(family-name:--font-unbounded) text-[20px] font-medium tracking-wide text-black uppercase md:text-[25px]">
                {campaign.title}
              </h2>
              <p className="m-0 font-(family-name:--font-pt-sans-caption) text-sm font-normal text-black md:text-base">
                {campaign.subtitle}
              </p>
              <Link
                href={campaign.href}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-black bg-transparent px-5 font-(family-name:--font-unbounded) text-sm font-normal text-black no-underline transition-opacity hover:opacity-85 md:px-[38px] md:text-base"
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
