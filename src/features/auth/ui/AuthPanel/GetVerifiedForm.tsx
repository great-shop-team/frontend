'use client';

import Image from 'next/image';
import { useState } from 'react';

import AuthInput from '@/features/auth/ui/AuthInput/AuthInput';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { useTranslation } from '@/i18n/useTranslation';
import { useResendActivationCodeMutation } from '@/store/endpoints/authEndpoints';

import { authPanel } from '@/features/auth/ui/authClasses';

type GetVerifiedFormProps = {
  onBack?: () => void;
  onGetCode: (email: string) => void;
  onLogin: () => void;
};

export default function GetVerifiedForm({ onBack, onGetCode, onLogin }: GetVerifiedFormProps) {
  const { t, validators } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resendCode, { isLoading }] = useResendActivationCodeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validators.validateField('email', email);
    if (msg) {
      setError(msg);
      return;
    }

    try {
      await resendCode({ email: normalizeEmail(email) }).unwrap();
      onGetCode(email);
    } catch {
      setError(t.auth.getVerified.sendFailed);
    }
  };

  return (
    <div className={authPanel.root}>
      {onBack && (
        <button
          type="button"
          className={authPanel.back}
          onClick={onBack}
          aria-label={t.common.back}
        >
          ‹
        </button>
      )}

      <div className={authPanel.illustration}>
        <Image
          src="/images/float.jpg"
          alt={t.auth.getVerified.imageAlt}
          width={180}
          height={180}
          className="h-auto w-[180px] max-md:w-[120px]"
          priority
        />
      </div>

      <h1 className={authPanel.title}>{t.auth.getVerified.title}</h1>
      <p className={authPanel.subtitleLinkEmail}>{t.auth.getVerified.subtitle}</p>

      <form noValidate className={authPanel.form} onSubmit={handleSubmit}>
        <AuthInput
          id="verify-email"
          name="email"
          label={t.auth.labels.emailOrMobile}
          type="email"
          placeholder={t.auth.placeholders.email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(validators.validateField('email', e.target.value));
          }}
          error={error}
        />

        <button type="submit" className={authPanel.submitBtn} disabled={isLoading}>
          {isLoading ? t.common.sending : t.auth.getVerified.submit}
        </button>
      </form>

      <p className={authPanel.footerLink}>
        {t.auth.getVerified.alreadyHaveAccount}{' '}
        <button type="button" className={authPanel.linkButton} onClick={onLogin}>
          {t.auth.login.submit}
        </button>
      </p>
    </div>
  );
}
