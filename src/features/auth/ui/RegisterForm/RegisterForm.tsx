'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import AuthInput from '../AuthInput/AuthInput';
import GoogleAuthButton from '@/features/auth/ui/GoogleAuthButton/GoogleAuthButton';
import { normalizeEmail } from '@/features/auth/lib/normalizeEmail';
import { savePendingAuth } from '@/features/auth/lib/pendingAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { useRegisterUserMutation } from '@/store/endpoints/authEndpoints';

import facebookLogo from '../../../../../public/icons/FacebookLogo.svg';
import appleLogo from '../../../../../public/icons/AppleLogo.svg';
import { registerForm } from '@/features/auth/ui/authClasses';

type RegisterFormProps = {
  onLogin: () => void;
  onRegistered: (email: string) => void;
  onSuccess?: () => void;
};

export default function RegisterForm({ onLogin, onRegistered, onSuccess }: RegisterFormProps) {
  const { t, validators } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [registerUser, { isSuccess, isLoading }] = useRegisterUserMutation();
  const router = useRouter();

  useEffect(() => {
    if (!isSuccess) return;

    savePendingAuth(formData.email, formData.password);
    onRegistered(formData.email);
  }, [isSuccess, onRegistered, formData.email, formData.password]);

  const normalizeErrorData = (data: unknown): string[] => {
    if (typeof data === 'string') {
      return [data];
    }

    if (Array.isArray(data)) {
      return data.flatMap((item) => normalizeErrorData(item));
    }

    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).flatMap(([key, value]) => {
        const field = key === 'non_field_errors' ? '' : key.replace(/_/g, ' ');
        return normalizeErrorData(value).map((message) =>
          field ? `${field}: ${message}` : message,
        );
      });
    }

    return [t.auth.errors.registrationFailed];
  };

  const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
  };

  const getErrorMessages = (error: unknown): string[] => {
    if (isFetchBaseQueryError(error)) {
      if (error.data) {
        return normalizeErrorData(error.data);
      }
      return [t.auth.errors.requestFailed];
    }

    return [t.auth.errors.registrationFailed];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    const errors = validators.validateRegisterForm(formData, isChecked);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const email = normalizeEmail(formData.email);

    try {
      await registerUser({
        email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        accept_terms: isChecked,
      }).unwrap();
    } catch (error) {
      setErrorMessages(getErrorMessages(error));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    const msg = validators.validateField(name, value, { ...formData, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    setErrorMessages([]);
  };

  const handleGoogleSuccess = () => {
    onSuccess?.();
    router.push('/profile');
  };

  const handleGoogleTermsRequired = () => {
    setFieldErrors((prev) => ({
      ...prev,
      acceptTerms: t.validation.acceptTermsShort,
    }));
    document.getElementById('terms')?.focus();
  };

  return (
    <div className={registerForm.panel}>
      <div className={registerForm.content}>
        <h1 className={registerForm.title}>{t.auth.register.title}</h1>
        <h2 className={registerForm.subtitle}>{t.auth.register.subtitle}</h2>

        <form onSubmit={handleSubmit} className={registerForm.form}>
          <div className={registerForm.inputContainer}>
            <AuthInput
              id="email"
              name="email"
              label={t.auth.labels.email}
              type="email"
              placeholder={t.auth.placeholders.emailShort}
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />
          </div>
          <div className={registerForm.inputContainer}>
            <AuthInput
              id="password"
              name="password"
              label={t.auth.labels.password}
              type="password"
              placeholder={t.auth.placeholders.password}
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              togglePassword
            />
          </div>
          <div className={registerForm.inputContainer}>
            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              label={t.auth.labels.confirmPassword}
              type="password"
              placeholder={t.auth.placeholders.confirmPassword}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
              togglePassword
            />
          </div>
          {errorMessages.length > 0 && (
            <div className={registerForm.errorMessage}>
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          )}
          <div className="mt-2 inline-flex max-w-full flex-col gap-2 box-border [&_label]:max-w-full [&_label]:wrap-break-word">
            <div className="flex items-start gap-3">
              <label className="relative flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    setIsChecked(e.target.checked);
                    setFieldErrors((prev) => ({ ...prev, acceptTerms: '' }));
                  }}
                  className={registerForm.checkbox}
                  id="terms"
                />

                <span className={registerForm.checkboxIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              </label>

              <label htmlFor="terms" className="text-sm cursor-pointer select-none text-dark">
                {t.auth.register.agreeTerms}{' '}
                <Link href="/terms" className="font-semibold hover:text-gray-600 transition-colors">
                  {t.auth.register.termsLink}
                </Link>
              </label>
            </div>
            {fieldErrors.acceptTerms && (
              <p className="text-sm text-red-600">{fieldErrors.acceptTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isChecked || isLoading}
            className={registerForm.submitBtn}
          >
            {isLoading ? t.common.loading : t.auth.register.submit}
          </button>

          <p className="m-0 text-center text-xs text-gray">{t.auth.register.googleTermsHint}</p>

          <div className={registerForm.socialRow}>
            <GoogleAuthButton
              acceptTerms={isChecked}
              className={registerForm.socialBtn}
              iconClassName={registerForm.socialIcon}
              onSuccess={handleGoogleSuccess}
              onError={(message) => setErrorMessages([message])}
              onTermsRequired={handleGoogleTermsRequired}
            />

            <button type="button" className={registerForm.socialBtn}>
              <Image src={facebookLogo} alt="Facebook" className={registerForm.socialIcon} />
            </button>

            <button type="button" className={registerForm.socialBtn}>
              <Image src={appleLogo} alt="Apple" className={registerForm.socialIcon} />
            </button>
          </div>
        </form>
        <div className={registerForm.loginVariant}>
          {t.auth.register.alreadyHaveAccount}{' '}
          <button type="button" className={registerForm.loginLink} onClick={onLogin}>
            {t.auth.login.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
