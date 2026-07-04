'use client';

import { useEffect } from 'react';

import { useTranslation } from '@/i18n/useTranslation';

type LoginRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}: LoginRequiredModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="login-required-title"
        className="relative w-full max-w-[560px] rounded-lg bg-white p-6 shadow-xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 cursor-pointer border-0 bg-transparent p-1 text-2xl leading-none text-black/70 transition-colors hover:text-black"
          onClick={onClose}
          aria-label={t.wishlist.closeModal}
        >
          ×
        </button>

        <h2
          id="login-required-title"
          className="mb-4 pr-8 text-xl font-bold text-black sm:text-2xl"
        >
          {t.wishlist.loginRequiredTitle}
        </h2>

        <p className="mb-8 text-base leading-relaxed text-black/80">{t.wishlist.loginRequiredText}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-black bg-black px-4 text-sm font-medium tracking-wide text-white uppercase transition-opacity hover:opacity-90"
            onClick={onLogin}
          >
            {t.wishlist.loginButton}
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-black bg-white px-4 text-sm font-medium tracking-wide text-black uppercase transition-colors hover:bg-black/5"
            onClick={onRegister}
          >
            {t.wishlist.registerButton}
          </button>
        </div>
      </div>
    </div>
  );
}
