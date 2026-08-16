'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { getNavLinkClass, headerNav } from './navigationClasses';

const CLOSE_DELAY_MS = 160;
const MEGA_MENU_OPEN_EVENT = 'nav-mega-menu-open';

type NavMegaMenuItemProps = {
  label: string;
  href: string;
  isActive: boolean;
  panel: ReactNode;
  panelLabel: string;
  innerClassName?: string;
};

export default function NavMegaMenuItem({
  label,
  href,
  isActive,
  panel,
  panelLabel,
  innerClassName,
}: NavMegaMenuItemProps) {
  const pathname = usePathname();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    cancelClose();
    setHasOpened(true);
    setIsOpen(true);
    window.dispatchEvent(new CustomEvent(MEGA_MENU_OPEN_EVENT, { detail: panelId }));
  };

  const closeMenu = () => {
    cancelClose();
    setIsOpen(false);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    const onOtherOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== panelId) {
        closeMenu();
      }
    };

    window.addEventListener(MEGA_MENU_OPEN_EVENT, onOtherOpen);
    return () => window.removeEventListener(MEGA_MENU_OPEN_EVENT, onOtherOpen);
  }, [panelId]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <li
      className={headerNav.megaMenuTrigger}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <Link
        href={href}
        className={getNavLinkClass(isActive || isOpen)}
        aria-current={isActive ? 'page' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {label}
      </Link>

      {hasOpened ? (
        <div
          id={panelId}
          className={`${headerNav.megaMenuWrap} ${
            isOpen ? 'visible' : 'invisible pointer-events-none'
          }`}
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
          aria-hidden={!isOpen}
        >
          <div className={headerNav.megaMenuPanel} role="navigation" aria-label={panelLabel}>
            <div className={innerClassName ?? headerNav.megaMenuInner}>{panel}</div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
