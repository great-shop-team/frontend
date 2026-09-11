'use client';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';

const SHOW_AFTER_PX = 400;

export default function ScrollToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={t.common.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex size-12 cursor-pointer items-center justify-center rounded-full border-none bg-black text-white shadow-[0_8px_24px_rgb(0_0_0/18%)] transition-[opacity,transform] duration-200 hover:scale-105 md:right-6 md:bottom-8 md:size-14 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="size-6"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
