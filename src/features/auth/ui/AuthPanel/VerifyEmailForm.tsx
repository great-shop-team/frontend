'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { extractApiError } from '@/features/auth/lib/apiError';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import {
  useActivateUserPatchMutation,
  useResendActivationCodeMutation,
} from '@/store/endpoints/authEndpoints';

import { authForm, authPanel } from '@/features/auth/ui/authClasses';

const VERIFY_ILLUSTRATION_SRC: string | null = null;

type VerifyEmailFormProps = {
  email: string;
  onBack?: () => void;
  onVerified: () => void | Promise<void>;
};

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

function formatCooldown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VerifyEmailForm({ email, onBack, onVerified }: VerifyEmailFormProps) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SEC);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const [activateUser, { isLoading }] = useActivateUserPatchMutation();
  const [resendCode, { isLoading: isResending }] = useResendActivationCodeMutation();

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setErrorMessage('');

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    e.preventDefault();
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    setErrorMessage('');
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== CODE_LENGTH) return;

    setErrorMessage('');
    setResendMessage('');

    try {
      await activateUser({ code, email: normalizeEmail(email) }).unwrap();
    } catch (error) {
      setErrorMessage(extractApiError(error) ?? t.auth.verify.invalidCode);
      return;
    }

    await onVerified();
  };

  const handleResend = async () => {
    setErrorMessage('');
    setResendMessage('');

    try {
      await resendCode({ email: normalizeEmail(email) }).unwrap();
      setResendMessage(t.auth.verify.codeResent);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } catch {
      setErrorMessage(t.auth.verify.resendFailed);
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

      <h1 className={authPanel.title}>{t.auth.verify.title}</h1>
      <p className={authPanel.subtitleLinkEmail}>
        {formatMessage(t.auth.verify.subtitle, { email })}
      </p>

      {VERIFY_ILLUSTRATION_SRC && (
        <div className={authPanel.illustration}>
          <Image
            src={VERIFY_ILLUSTRATION_SRC}
            alt=""
            width={280}
            height={200}
            style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
            priority
          />
        </div>
      )}

      <form noValidate className={authPanel.form} onSubmit={handleSubmit}>
        <label className={authForm.fieldLabel}>{t.auth.labels.enterCode}</label>

        <div className={authPanel.codeRow}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              className={authPanel.codeInput}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={formatMessage(t.common.digit, { number: index + 1 })}
            />
          ))}
        </div>

        {errorMessage && <p className={authPanel.errorText}>{errorMessage}</p>}
        {resendMessage && <p className={authPanel.successText}>{resendMessage}</p>}

        <button
          type="submit"
          className={authPanel.submitBtn}
          disabled={digits.some((d) => !d) || isLoading}
        >
          {isLoading ? t.common.verifying : t.auth.verify.submit}
        </button>
      </form>

      <p className={authPanel.footerLink}>
        {t.auth.verify.didntSeeEmail}{' '}
        <button
          type="button"
          className={authPanel.linkButton}
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
        >
          {isResending ? (
            t.common.sending
          ) : resendCooldown > 0 ? (
            <span className={authPanel.resendTimer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {formatCooldown(resendCooldown)}
            </span>
          ) : (
            t.common.resend
          )}
        </button>
      </p>
    </div>
  );
}
