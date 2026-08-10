'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function ShopBySection() {
  const { shopBy, labels } = useLandingData();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-category-card]');
    const gap = 20;
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.35) + gap;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <section className={landingSection.section}>
      <div className={`${landingSection.sectionContent} flex flex-col gap-8`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className={landingSection.sectionTitle}>{labels.shopByCategory}</h2>
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
          className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shopBy.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              data-category-card
              className="group relative aspect-413/603 w-[min(100%,380px)] shrink-0 overflow-hidden bg-[#f5f5f5] md:w-[calc((100%-40px)/3)]"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 768px) 80vw, 400px"
                quality={80}
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute right-5 bottom-5 left-5 z-1 inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-[#fafafa] bg-transparent px-[38px] py-3 font-(family-name:--font-unbounded) text-base font-normal text-[#fafafa]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
