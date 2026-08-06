'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { getNavLinkClass, headerNav } from './navigationClasses';

const CLOSE_DELAY_MS = 250;

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
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    cancelClose();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => () => cancelClose(), []);

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
      >
        {label}
      </Link>

      {isOpen ? (
        <div
          className={headerNav.megaMenuWrap}
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className={headerNav.megaMenuPanel} role="navigation" aria-label={panelLabel}>
            <div className={innerClassName ?? headerNav.megaMenuInner}>{panel}</div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
