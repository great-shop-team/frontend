'use client';

import { ChangeEvent, useId, useState } from 'react';

import { authForm } from '@/features/auth/ui/authClasses';
import { useTranslation } from '@/i18n/useTranslation';

type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

interface AuthInputProps {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: InputType;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  togglePassword?: boolean;
  autoComplete?: string;
}

export default function AuthInput({
  id,
  name,
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  error,
  hint,
  togglePassword = false,
  autoComplete,
}: AuthInputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === 'password' && togglePassword ? (showPassword ? 'text' : 'password') : type;

  const reactId = useId();
  const inputId = id ?? `auth-input-${reactId}`;
  const resolvedAutoComplete =
    autoComplete ??
    (type === 'email' ? 'email' : type === 'password' ? 'current-password' : undefined);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className={authForm.fieldLabel}>
        {label}
      </label>
      <div
        className={`relative rounded-[10px] border bg-white ${
          error ? 'border-error' : 'border-dark'
        }`}
      >
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={resolvedAutoComplete}
          autoCapitalize={type === 'email' ? 'none' : undefined}
          autoCorrect={type === 'email' ? 'off' : undefined}
          spellCheck={type === 'email' || type === 'password' ? false : undefined}
          className="box-border w-full rounded-[10px] border-none bg-transparent px-4 py-4 pr-12 text-base text-dark outline-none focus:shadow-none focus-visible:shadow-none placeholder:text-gray max-md:py-3.5"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {togglePassword && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent text-gray"
            aria-label={showPassword ? t.common.hidePassword : t.common.showPassword}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3l18 18" />
                <path d="M10.5 10.5A2.5 2.5 0 0 0 13.5 13.5" />
                <path d="M9.1 5.18A10.8 10.8 0 0 1 12 5c5.4 0 9.79 3.44 11 7-1.08 3.1-3.74 5.71-7.12 6.82" />
                <path d="M6.12 6.12A16.95 16.95 0 0 0 2 12c1.31 3.31 4.48 6 10 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {hint && <p className="text-sm leading-5 text-gray">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="text-sm leading-5 text-error">
          {error}
        </p>
      )}
    </div>
  );
}
