'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function PressMediaSection() {
  const { press, labels } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className={`${landingSection.sectionContent} flex flex-col gap-8`}>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="m-0 font-(family-name:--font-pt-sans-caption) text-[11px] font-normal tracking-[0.12em] text-black/60 uppercase">
            {labels.pressMedia}
          </p>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="m-0 font-(family-name:--font-unbounded) text-[20px] font-medium text-dark no-underline transition-opacity hover:opacity-70 md:text-[25px]"
          >
            {labels.pressHandle}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {press.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-305/264 overflow-hidden bg-[#f5f5f5]"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 305px"
                className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
