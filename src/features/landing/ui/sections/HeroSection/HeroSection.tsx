'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLandingData } from '@/features/landing/lib/useLandingData';
import { landingSection } from '../landingSectionClasses';

export default function HeroSection() {
  const { hero } = useLandingData();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slides = hero.slides;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {
            /* autoplay may be blocked until user gesture */
          });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  const handleVideoEnded = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  return (
    <section
      className={`${landingSection.breakout} relative mb-16 h-[700px] w-screen overflow-hidden md:mb-20 lg:mb-[100px]`}
      aria-roledescription="carousel"
      aria-label={hero.slidesAriaLabel}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? 'z-1 opacity-100' : 'z-0 opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover object-[center_top]"
              src={slide.video}
              muted
              playsInline
              preload={index === 0 || Math.abs(index - activeIndex) <= 1 ? 'auto' : 'metadata'}
              onEnded={isActive ? handleVideoEnded : undefined}
            />
            <div
              className="absolute inset-0 bg-linear-to-r from-black/45 via-black/20 to-transparent"
              aria-hidden
            />

            <div className="layout-gutter relative z-1 flex h-full items-center pt-[calc(var(--site-header-height)+16px)] pb-20">
              <div className="flex w-full max-w-[421px] flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <h1 className="m-0 font-(family-name:--font-unbounded) text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.15] font-semibold tracking-tight text-white">
                    {slide.title.split('\n').map((line, lineIndex) => (
                      <span key={`${slide.id}-${lineIndex}`} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="m-0 font-(family-name:--font-pt-sans-caption) text-sm leading-relaxed font-normal text-white/80 md:text-base">
                    {slide.description}
                  </p>
                </div>
                <Link
                  href={slide.href}
                  className="inline-flex h-12 w-fit items-center justify-center rounded-[8px] bg-white px-5 font-(family-name:--font-unbounded) text-base font-semibold text-black no-underline transition-opacity hover:opacity-85"
                >
                  {hero.cta}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div
        className="absolute bottom-5 left-1/2 z-2 flex -translate-x-1/2 items-center gap-2.5"
        role="tablist"
        aria-label={hero.slidesAriaLabel}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={hero.goToSlide.replace('{n}', String(index + 1))}
              className={`cursor-pointer rounded-full border-none transition-all duration-300 ${
                isActive
                  ? 'h-2.5 w-2.5 bg-white'
                  : 'h-2 w-2 bg-white/45 hover:bg-white/70'
              }`}
              onClick={() => goTo(index)}
            />
          );
        })}
      </div>
    </section>
  );
}
