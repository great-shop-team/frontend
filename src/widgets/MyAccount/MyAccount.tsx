'use client';

import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthOverlay } from '@/features/auth/context/AuthOverlayContext';
import { useSessionEmail } from '@/features/auth/hooks/useSessionEmail';
import { useTranslation } from '@/i18n/useTranslation';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/slices/userSlice';
import { getHeaderActionClass, isActivePath } from '@/widgets/Header/headerActionClasses';

export default function MyAccount({
  isHeaderTransparent = false,
}: {
  isHeaderTransparent?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { hasSession, initials: hookInitials, email: hookEmail } = useSessionEmail();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isOpen, openAuth } = useAuthOverlay();
  const currentUser = useSelector(selectCurrentUser);

  const isActive = isActivePath(pathname, '/profile') || isOpen;

  const toggle = () => {
    if (hasSession && isAuthenticated) {
      router.push('/profile');
      return;
    }

    openAuth('login');
  };

  // 1. Проверяем буквы из стандартного хука
  let firstLetter = hookInitials || (typeof hookEmail === 'string' ? hookEmail[0] : '') || '';

  // 2. Если хук пустой (как в случае с Google), достаем данные из вложенного объекта currentUser.user
  if (!firstLetter && currentUser && typeof currentUser === 'object' && 'user' in currentUser) {
    const nestedUser = currentUser.user as Record<string, unknown> | null;

    if (nestedUser && typeof nestedUser === 'object') {
      const googleEmail = typeof nestedUser.email === 'string' ? nestedUser.email : '';
      const googleName = typeof nestedUser.username === 'string' ? nestedUser.username : '';
      const googleFirstName =
        typeof nestedUser.first_name === 'string' ? nestedUser.first_name : '';

      firstLetter = googleFirstName[0] || googleName[0] || googleEmail[0] || '';
    }
  }

  const finalInitials = firstLetter.trim().toUpperCase();
  const showInitials = hasSession && isAuthenticated && Boolean(finalInitials);

  return (
    <button
      type="button"
      className={`${getHeaderActionClass(isActive)} cursor-pointer border-x-0 border-t-0 bg-transparent [&_svg]:block`}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="auth-overlay"
      aria-current={isActive ? 'page' : undefined}
      aria-label={hasSession && isAuthenticated ? t.account.profile : t.account.account}
    >
      {showInitials ? (
        <span
          className={`flex h-7 w-7 select-none items-center justify-center rounded-full font-(family-name:--font-unbounded) text-[11px] font-semibold leading-none tracking-wide uppercase ${
            isHeaderTransparent ? 'bg-white text-dark' : 'bg-dark text-white'
          }`}
          aria-hidden
        >
          {finalInitials}
        </span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      )}
    </button>
  );
}
