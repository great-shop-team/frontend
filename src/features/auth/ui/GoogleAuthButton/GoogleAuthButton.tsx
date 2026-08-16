'use client';

import { useCallback } from 'react';
import Image from 'next/image';

import { buildGoogleAuthUrl, saveGoogleOAuthPending } from '@/features/auth/lib/googleOAuth';
import { useTranslation } from '@/i18n/useTranslation';

import googleLogo from '../../../../../public/icons/GoogleLogo.svg';

type GoogleAuthButtonProps = {
  acceptTerms: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onTermsRequired?: () => void;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

export default function GoogleAuthButton({
  acceptTerms,
  disabled = false,
  className,
  iconClassName,
  onError,
  onTermsRequired,
}: GoogleAuthButtonProps) {
  const { t } = useTranslation();
  const googleSignInFailedError = t.auth.errors.googleSignInFailed;

  const handleClick = useCallback(() => {
    if (!acceptTerms) {
      onTermsRequired?.();
      return;
    }

    if (!googleClientId) {
      onError?.(googleSignInFailedError);
      return;
    }

    const returnTo = `${window.location.pathname}${window.location.search}`;
    saveGoogleOAuthPending({ acceptTerms, returnTo: returnTo || '/' });

    const redirectUri = `${window.location.origin}/google-callback`;
    // Full-page redirect — AdGuard/uBlock almost never block this (unlike popups)
    window.location.assign(buildGoogleAuthUrl(googleClientId, redirectUri));
  }, [acceptTerms, googleSignInFailedError, onError, onTermsRequired]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ${className ?? 'h-10 w-10'}`}
      aria-label="Google"
    >
      <Image src={googleLogo} alt="Google" className={iconClassName ?? 'h-6 w-6'} />
    </button>
  );
}
