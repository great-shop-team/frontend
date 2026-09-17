'use client';

import Link from 'next/link';

import { AUTH_OVERLAY_CLOSE_EVENT } from '@/features/auth/lib/authOverlayEvents';

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center"
      aria-label="WEARLY — на главную"
      onClick={() => window.dispatchEvent(new CustomEvent(AUTH_OVERLAY_CLOSE_EVENT))}
    >
      <img
        src="/icons/Logo.svg"
        alt="WEARLY"
        width={132}
        height={30}
        className="header-logo block h-auto w-[132px] max-w-none"
      />
    </Link>
  );
}
