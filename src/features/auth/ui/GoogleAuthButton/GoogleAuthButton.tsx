'use client';

import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import Image from 'next/image';

import { extractApiError } from '@/features/auth/lib/apiError';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
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

  if (!googleClientId) {
    return null;
  }

  const isBlocked = disabled || isLoading;
  const canUseGoogle = acceptTerms && !isBlocked;

  const handleTermsClick = () => {
    onTermsRequired?.();
  };

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.(t.auth.errors.googleSignInFailed);
      return;
    }

    try {
      await signInWithGoogle(response.credential, acceptTerms);
      onSuccess?.();
    } catch (error) {
      onError?.(extractApiError(error) ?? t.auth.errors.googleSignInFailed);
    }
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={!acceptTerms ? handleTermsClick : undefined}
        disabled={isBlocked}
        className="flex h-10 w-10 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Google"
      >
        <Image src={googleLogo} alt="Google" className={iconClassName ?? 'h-6 w-6'} />
      </button>

      {canUseGoogle && (
        <div className="absolute inset-0 overflow-hidden opacity-[0.01]">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => onError?.(t.auth.errors.googleSignInFailed)}
            type="icon"
            shape="circle"
            size="large"
            useOneTap={false}
          />
        </div>
      )}
    </div>
  );
}
