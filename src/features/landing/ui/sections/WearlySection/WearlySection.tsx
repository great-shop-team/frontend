'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function WearlySection() {
  const { wearly, labels } = useLandingData();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-wearly-card]');
    const gap = 32;
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.35) + gap;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <section className={landingSection.section}>
      <div className={`${landingSection.sectionContent} flex flex-col gap-8`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className={landingSection.sectionTitle}>{labels.wearly}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-dark transition-colors hover:bg-[#f5f5f5]"
              aria-label={labels.prev}
              onClick={() => scrollByCard(-1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="size-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-dark transition-colors hover:bg-[#f5f5f5]"
              aria-label={labels.next}
              onClick={() => scrollByCard(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="size-4"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {wearly.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              data-wearly-card
              className="group relative aspect-413/603 w-[min(100%,413px)] shrink-0 overflow-hidden bg-[#f5f5f5]"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="413px"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
