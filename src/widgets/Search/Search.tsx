'use client';

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { catalogRoutes } from '@/features/catalog/config/catalogRoutes';
import { useTranslation } from '@/i18n/useTranslation';
import { getHeaderActionClass } from '@/widgets/Header/headerActionClasses';
import { useSearchSuggestions } from '@/widgets/Search/useSearchSuggestions';

const CATALOG_CATEGORY_PATH = /^\/catalog\/(women|men|accessories|fragrances|shoes)/;

type SearchProps = {
  onOpen?: () => void;
};

function highlightMatch(text: string, query: string) {
  const needle = query.trim();
  if (!needle) return text;

  const index = text.toLowerCase().indexOf(needle.toLowerCase());
  if (index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-dark">{text.slice(index, index + needle.length)}</span>
      {text.slice(index + needle.length)}
    </>
  );
}

export default function Search({ onOpen }: SearchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { hits } = useSearchSuggestions(query, isOpen);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const open = () => {
    onOpen?.();
    setQuery('');
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [isOpen, close]);

  const catalogHref = (value: string) => {
    const target = CATALOG_CATEGORY_PATH.test(pathname) ? pathname : catalogRoutes.index;
    return `${target}?q=${encodeURIComponent(value)}`;
  };

  const goTo = (href: string) => {
    close();
    router.push(href);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    goTo(hits[0]?.href ?? catalogHref(value));
  };

  const showResults = query.trim().length > 0;

  return (
    <>
      <button
        type="button"
        className={getHeaderActionClass(isOpen)}
        aria-label={t.nav.search}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>

      {isOpen
        ? createPortal(
            <div className="fixed inset-0 z-130" role="presentation">
              <button
                type="button"
                className="absolute inset-0 cursor-default border-0 bg-black/45 p-0"
                aria-label={t.nav.closeSearch}
                onClick={close}
              />

              <div
                role="dialog"
                aria-modal
                aria-labelledby={titleId}
                className="relative z-1 mx-auto mt-[calc(var(--site-header-offset)+20px)] w-[min(100%-32px,520px)] sm:mt-[calc(var(--site-header-offset)+32px)]"
              >
                <form
                  className="flex items-center gap-2 rounded-[10px] border border-dark bg-white px-3 shadow-[0_12px_32px_rgb(0_0_0/12%)]"
                  onSubmit={handleSubmit}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 shrink-0 text-gray"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <label htmlFor="header-search-input" className="sr-only" id={titleId}>
                    {t.nav.search}
                  </label>
                  <input
                    ref={inputRef}
                    id="header-search-input"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t.nav.searchPlaceholder}
                    autoComplete="off"
                    enterKeyHint="search"
                    className="h-12 min-w-0 flex-1 border-0 bg-transparent text-base text-dark outline-none placeholder:text-gray [&::-webkit-search-cancel-button]:hidden"
                  />
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-xl leading-none text-black/50 transition-colors hover:bg-black/5 hover:text-black"
                    onClick={close}
                    aria-label={t.nav.closeSearch}
                  >
                    ×
                  </button>
                </form>

                {showResults ? (
                  <div className="mt-2 max-h-[min(60dvh,22rem)] overflow-y-auto rounded-[10px] border border-black/8 bg-white shadow-[0_12px_32px_rgb(0_0_0/12%)]">
                    {hits.length > 0 ? (
                      <ul className="py-1">
                        {hits.map((hit) => (
                          <li key={hit.id}>
                            <Link
                              href={hit.href}
                              className="flex flex-col gap-0.5 px-4 py-2.5 text-dark no-underline transition-colors hover:bg-black/5"
                              onClick={close}
                            >
                              <span className="text-base leading-snug">
                                {highlightMatch(hit.title, query)}
                              </span>
                              {hit.brandName ? (
                                <span className="text-sm text-gray">
                                  {highlightMatch(hit.brandName, query)}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-4 py-5 text-base text-gray">{t.nav.searchNoResults}</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
