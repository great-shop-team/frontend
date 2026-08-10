'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function PromoDuoSection() {
  const { promoDuo, labels } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-5 md:grid-cols-2">
        {promoDuo.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative block aspect-630/675 w-full overflow-hidden bg-[#f5f5f5] md:h-[675px] md:aspect-auto"
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 630px"
              quality={80}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 z-1 flex flex-col items-start gap-4 p-6 md:p-8">
              <h3 className="m-0 font-(family-name:--font-unbounded) text-[25px] font-medium text-white">
                {item.label}
              </h3>
              <span className="inline-flex h-11 items-center justify-center rounded-[10px] border-2 border-[#fafafa] bg-transparent px-[38px] font-(family-name:--font-unbounded) text-base font-normal text-[#fafafa] transition-opacity group-hover:opacity-85">
                {labels.shopNow}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
