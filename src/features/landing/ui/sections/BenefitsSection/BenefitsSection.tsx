'use client';

import Image from 'next/image';

import { useTranslation } from '@/i18n/useTranslation';
import { landingSection } from '../landingSectionClasses';

const benefits = [
  {
    id: 'worldwideShipping',
    icon: '/icons/WorldwideShipping.svg',
  },
  {
    id: 'freeReturns',
    icon: '/icons/FreeReturns.svg',
  },
  {
    id: 'secureCheckout',
    icon: '/icons/SecureCheckout.svg',
  },
  {
    id: 'liveStyleAdvice',
    icon: '/icons/LiveStyleAdvice.svg',
  },
] as const;

export default function BenefitsSection() {
  const { t } = useTranslation();

  return (
    <section className={landingSection.section}>
      <div className="mx-auto grid w-full max-w-[584px] grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
        {benefits.map((item) => (
          <div key={item.id} className="flex min-w-0 flex-col items-center gap-2">
            <Image src={item.icon} alt="" width={28} height={28} aria-hidden />
            <p className="m-0 max-w-[140px] text-center font-(family-name:--font-pt-sans-caption) text-xs font-normal text-dark sm:max-w-none">
              {t.landing.benefits[item.id]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
