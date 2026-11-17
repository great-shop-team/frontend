'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';

import { authPanel } from '@/features/auth/ui/authClasses';

type WelcomeAbroadPanelProps = {
  onGetStarted: () => void | Promise<void>;
};

export default function WelcomeAbroadPanel({ onGetStarted }: WelcomeAbroadPanelProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onGetStarted();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={authPanel.root}>
      <h1 className={authPanel.title}>{t.auth.welcome.title}</h1>
      <p className={authPanel.subtitleLinkEmail}>{t.auth.welcome.subtitle}</p>

      <div className={authPanel.illustration} aria-hidden>
        <Image
          src="/images/Illustration - dancing.jpg"
          alt={t.auth.welcome.imageAlt}
          width={280}
          height={300}
          className="h-auto w-full max-w-[240px] max-md:max-w-[168px]"
          priority
        />
      </div>

      <button
        type="button"
        className={authPanel.submitBtn}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? t.auth.welcome.signingIn : t.auth.welcome.submit}
      </button>

      <p className={authPanel.welcomeFooter}>
        {t.auth.welcome.goShopping}{' '}
        <Link href="/catalog" className={authPanel.linkButton}>
          {t.common.catalog}
        </Link>
      </p>
    </div>
  );
}
