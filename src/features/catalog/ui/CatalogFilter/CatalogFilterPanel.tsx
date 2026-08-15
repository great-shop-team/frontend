'use client';

import { useEffect } from 'react';

import type { Brand, CatalogColor, CatalogSize, Subcategory } from '@/store/types';
import { useTranslation } from '@/i18n/useTranslation';

type CatalogFilterPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  brands: Brand[];
  subcategories: Subcategory[];
  colors: CatalogColor[];
  sizes: CatalogSize[];
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  selectedSubcategory?: string;
  onChange: (next: {
    brand: string[];
    color: string[];
    size: string[];
    subcategory?: string;
  }) => void;
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function CatalogFilterPanel({
  isOpen,
  onClose,
  brands,
  subcategories,
  colors,
  sizes,
  selectedBrands,
  selectedColors,
  selectedSizes,
  selectedSubcategory,
  onChange,
}: CatalogFilterPanelProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const clearAll = () => {
    onChange({ brand: [], color: [], size: [], subcategory: undefined });
  };

  return (
    <div
      className={`fixed inset-0 z-120 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 border-none bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={t.catalog.closeFilters}
        onClick={onClose}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-full flex-col bg-white text-dark shadow-[-8px_0_32px_rgb(0_0_0/12%)] transition-transform duration-300 ease-out md:w-[min(100%,380px)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={t.catalog.filter}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-black/8 px-4 md:h-16 md:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent text-dark"
              onClick={onClose}
              aria-label={t.catalog.closeFilters}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="m-0 font-(family-name:--font-unbounded) text-base font-medium">
              {t.catalog.filter}
            </h2>
          </div>
          <button
            type="button"
            className="min-h-11 cursor-pointer border-none bg-transparent px-1 text-sm text-dark/70 underline"
            onClick={clearAll}
          >
            {t.catalog.clearFilters}
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain px-4 py-5 md:px-5 md:py-6">
          {subcategories.length > 0 ? (
            <section>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.12em] text-gray uppercase">
                {t.catalog.filterGroups.subcategory}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {subcategories.map((item) => {
                  const active = selectedSubcategory === item.slug;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`min-h-11 cursor-pointer border-none bg-transparent px-0 text-left text-sm ${
                          active ? 'font-medium text-dark' : 'text-dark/70'
                        }`}
                        onClick={() =>
                          onChange({
                            brand: selectedBrands,
                            color: selectedColors,
                            size: selectedSizes,
                            subcategory: active ? undefined : item.slug,
                          })
                        }
                      >
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {brands.length > 0 ? (
            <section>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.12em] text-gray uppercase">
                {t.catalog.filterGroups.brand}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {brands.map((brand) => {
                  const value = String(brand.id);
                  const checked = selectedBrands.includes(value);
                  return (
                    <li key={brand.id}>
                      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            onChange({
                              brand: toggleValue(selectedBrands, value),
                              color: selectedColors,
                              size: selectedSizes,
                              subcategory: selectedSubcategory,
                            })
                          }
                        />
                        {brand.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {colors.length > 0 ? (
            <section>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.12em] text-gray uppercase">
                {t.catalog.filterGroups.color}
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {colors.map((color) => {
                  const value = String(color.id);
                  const checked = selectedColors.includes(value);
                  return (
                    <li key={color.id}>
                      <button
                        type="button"
                        title={color.name}
                        className={`size-10 cursor-pointer rounded-full border-2 md:size-8 ${
                          checked ? 'border-dark' : 'border-black/15'
                        }`}
                        style={{ backgroundColor: color.hex_code }}
                        aria-pressed={checked}
                        onClick={() =>
                          onChange({
                            brand: selectedBrands,
                            color: toggleValue(selectedColors, value),
                            size: selectedSizes,
                            subcategory: selectedSubcategory,
                          })
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {sizes.length > 0 ? (
            <section>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.12em] text-gray uppercase">
                {t.catalog.filterGroups.size}
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {sizes.map((size) => {
                  const value = String(size.id);
                  const checked = selectedSizes.includes(value);
                  return (
                    <li key={size.id}>
                      <button
                        type="button"
                        className={`min-w-10 cursor-pointer rounded-sm border px-3 py-2 text-sm ${
                          checked
                            ? 'border-dark bg-dark text-white'
                            : 'border-black/20 bg-transparent text-dark'
                        }`}
                        onClick={() =>
                          onChange({
                            brand: selectedBrands,
                            color: selectedColors,
                            size: toggleValue(selectedSizes, value),
                            subcategory: selectedSubcategory,
                          })
                        }
                      >
                        {size.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {brands.length === 0 &&
          subcategories.length === 0 &&
          colors.length === 0 &&
          sizes.length === 0 ? (
            <p className="m-0 text-sm text-dark/60">{t.catalog.filtersEmpty}</p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-black/8 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-5">
          <button type="button" className="btn-primary w-full max-w-none" onClick={onClose}>
            {t.catalog.applyFilters}
          </button>
        </div>
      </aside>
    </div>
  );
}
