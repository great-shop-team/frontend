'use client';

import { useState } from 'react';

import { validateEmail } from '@/features/auth/lib/validation';
import { useTranslation } from '@/i18n/useTranslation';

export default function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showSubmit = email.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = email.trim();
    if (!validateEmail(value)) {
      setMessage(t.newsletter.invalidEmail);
      setIsError(true);
      return;
    }

    setMessage(t.newsletter.success);
    setIsError(false);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-0">
      {message ? (
        <p className={`mb-4 text-xs leading-snug ${isError ? 'text-red-500' : 'text-success'}`}>
          {message}
        </p>
      ) : null}

      <div className="relative w-full border-b border-white pb-0">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (message) {
              setMessage('');
              setIsError(false);
            }
          }}
          placeholder="you@email.com"
          autoComplete="email"
          className="w-full border-0 bg-transparent pr-10 pb-4 text-base leading-normal text-white outline-none placeholder:text-white/50"
        />

        {showSubmit ? (
          <button
            type="submit"
            aria-label={t.footer.subscribeAria}
            className="absolute right-0 bottom-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-white transition-colors duration-200 hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        ) : null}
      </div>
    </form>
  );
}
