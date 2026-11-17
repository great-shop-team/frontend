'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import LandingProductCard from '../LandingProductCard/LandingProductCard';
import { landingSection } from '../landingSectionClasses';

export default function FeaturedFramesSection() {
  const { featuredFrames } = useLandingData();
  const { lookEditorial, lookProduct, scentProduct, scentEditorial } = featuredFrames;

  return (
    <section className={landingSection.section}>
      <div className="mx-auto flex w-full max-w-[1270px] flex-col gap-5">
        <div className="flex flex-col items-center gap-6 md:h-[850px] md:flex-row md:items-center md:gap-[128px]">
          <Link
            href={lookEditorial.href}
            className="relative h-auto w-full max-w-[630px] aspect-630/850 shrink-0 overflow-hidden bg-[#f5f5f5] md:h-[850px] md:w-[630px] md:aspect-auto"
          >
            <Image
              src={lookEditorial.image.src}
              alt={lookEditorial.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 630px"
              quality={80}
              className="object-cover object-top"
            />
            <p className={`${landingSection.editorialTitle} text-white`}>
              {lookEditorial.title}
            </p>
          </Link>

          <div className="w-full max-w-[413px] shrink-0 md:w-[413px]">
            <LandingProductCard
              id={lookProduct.id}
              href={lookProduct.href}
              image={lookProduct.image}
              title={lookProduct.title}
              price={lookProduct.price}
              imageClassName="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 md:h-[850px] md:flex-row md:items-center md:justify-between md:gap-[128px]">
          <div className="w-full max-w-[413px] shrink-0 md:w-[413px]">
            <LandingProductCard
              id={scentProduct.id}
              href={scentProduct.href}
              image={scentProduct.image}
              title={scentProduct.title}
              price={scentProduct.price}
              imageClassName="object-contain"
            />
          </div>

          <Link
            href={scentEditorial.href}
            className="relative h-auto w-full max-w-[630px] aspect-630/850 shrink-0 overflow-hidden bg-[#1f4d3a] md:ml-auto md:h-[850px] md:w-[630px] md:aspect-auto"
          >
            <Image
              src={scentEditorial.image.src}
              alt={scentEditorial.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 630px"
              quality={80}
              className="object-cover"
            />
            <p className={`${landingSection.editorialTitle} text-white`}>
              {scentEditorial.title}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
