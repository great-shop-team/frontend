'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import LandingProductCard from '../LandingProductCard/LandingProductCard';
import { landingSection } from '../landingSectionClasses';

export default function EyewearSection() {
  const { eyewear } = useLandingData();

  return (
    <section className={landingSection.section}>
      <div className="mx-auto flex w-full max-w-[1270px] flex-col items-center gap-6 bg-[#fafafa] md:h-[850px] md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="w-full max-w-[413px] shrink-0 md:w-[413px] md:px-0">
          <LandingProductCard
            id={eyewear.product.id}
            href={eyewear.product.href}
            image={eyewear.product.image}
            title={eyewear.product.title}
            price={eyewear.product.price}
            imageClassName="object-contain"
          />
        </div>

        <Link
          href={eyewear.editorial.href}
          className="relative h-auto w-full max-w-[630px] aspect-630/850 shrink-0 overflow-hidden bg-[#fafafa] md:h-[850px] md:w-[630px] md:aspect-auto"
        >
          <Image
            src={eyewear.editorial.src}
            alt={eyewear.editorial.alt}
            fill
            sizes="(max-width: 768px) 100vw, 630px"
            quality={80}
            className="object-cover object-top"
          />
          <p className={`${landingSection.editorialTitle} text-black`}>{eyewear.title}</p>
        </Link>
      </div>
    </section>
  );
}
