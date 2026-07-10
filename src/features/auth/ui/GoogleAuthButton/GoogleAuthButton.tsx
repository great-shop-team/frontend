'use client';

import { useEffect, useCallback } from 'react';
import { type IdConfiguration, type CredentialResponse } from '@react-oauth/google';
import Image from 'next/image';

import { extractApiError } from '@/features/auth/lib/apiError';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { useTranslation } from '@/i18n/useTranslation';

import googleLogo from '../../../../../public/icons/GoogleLogo.svg';

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface CustomIdConfiguration extends IdConfiguration {
  use_fedcm?: boolean;
}

declare global {
  interface Window {
    // Безопасно расширяем объект window, чтобы ESLint не ругался на any
    __googleGsiInitialized?: boolean;
    google?: {
      accounts: {
        id: {
          initialize: (config: CustomIdConfiguration) => void;
          prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
          requestCode: () => void;
        };
      };
    };
  }
}

type GoogleAuthButtonProps = {
  acceptTerms: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onTermsRequired?: () => void;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleAuthButton({
  acceptTerms,
  disabled = false,
  className,
  iconClassName,
  onSuccess,
  onError,
  onTermsRequired,
}: GoogleAuthButtonProps) {
  const { t } = useTranslation();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  const googleSignInFailedError = t.auth.errors.googleSignInFailed;

  const handleSuccess = useCallback(
    async (credential: string) => {
      try {
        await signInWithGoogle(credential, acceptTerms);
        onSuccess?.();
      } catch (error) {
        onError?.(extractApiError(error) ?? googleSignInFailedError);
      }
    },
    [signInWithGoogle, acceptTerms, onSuccess, onError, googleSignInFailedError],
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.accounts.id && googleClientId) {
      // Чистая проверка глобального флага без использования as any
      if (window.__googleGsiInitialized) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        use_fedcm: true,
        callback: (response: CredentialResponse) => {
          if (response.credential) {
            handleSuccess(response.credential);
          } else {
            onError?.(googleSignInFailedError);
          }
        },
      });

      window.__googleGsiInitialized = true;
    }
  }, [handleSuccess, onError, googleSignInFailedError]);

  const handleButtonClick = () => {
    if (!acceptTerms) {
      onTermsRequired?.();
      return;
    }

    if (typeof window !== 'undefined' && window.google?.accounts.id) {
      const googleAuthId = window.google.accounts.id;

      googleAuthId.prompt((notification: GooglePromptNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          googleAuthId.requestCode();
        }
      });
    } else {
      onError?.(googleSignInFailedError);
    }
  };

  const isBlocked = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={isBlocked}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
      aria-label="Google"
    >
      <Image src={googleLogo} alt="Google" className={iconClassName ?? 'h-6 w-6'} />
    </button>
  );
}

