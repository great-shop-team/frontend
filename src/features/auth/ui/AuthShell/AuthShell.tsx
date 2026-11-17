'use client';

import { useEffect } from 'react';

import { authForm } from '@/features/auth/ui/authClasses';

type AuthShellProps = {
  children: React.ReactNode;
  onBackdropClick?: () => void;
};

const backdropClass = 'bg-black/20 backdrop-blur-[10px]';

export default function AuthShell({ children, onBackdropClick }: AuthShellProps) {
  useEffect(() => {
    document.documentElement.classList.add('auth-overlay-open');
    document.body.classList.add('auth-overlay-open');

    return () => {
      document.documentElement.classList.remove('auth-overlay-open');
      document.body.classList.remove('auth-overlay-open');
    };
  }, []);

  return (
    <div
      className="pointer-events-auto fixed top-[var(--site-header-offset)] right-0 bottom-0 left-0 z-50 flex w-full max-md:flex-col"
      role="dialog"
      aria-modal
      aria-label="Account"
    >
      <button
        type="button"
        className={`relative z-1 min-w-0 shrink-0 cursor-pointer border-0 p-0 max-md:hidden md:w-[60%] md:flex-[0_0_60%] ${backdropClass}`}
        aria-label="Close"
        onClick={onBackdropClick}
      />
      <div className="auth-overlay-panel relative z-2 box-border flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col self-stretch overflow-hidden bg-white max-md:flex-1 md:w-[40%] md:max-w-none md:flex-[0_0_40%]">
        {onBackdropClick && (
          <button
            type="button"
            className={authForm.closeBtn}
            onClick={onBackdropClick}
            aria-label="Close"
          >
            ✕
          </button>
        )}
        <div className="auth-overlay-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
