'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  CATALOG_GENDER_FILTERS,
  CATALOG_GROUP_FILTERS,
  type CatalogGenderFilter,
  type CatalogGroupFilter,
  type CatalogSortOption,
} from '@/features/catalog/model/catalogFilters';
import { catalogFilterPanel } from '@/features/catalog/ui/catalogClasses';
import type { Brand, CatalogColor, CatalogSize, Subcategory } from '@/store/types';
import { useTranslation } from '@/i18n/useTranslation';

type FilterDraft = {
  sort: CatalogSortOption;
  gender: CatalogGenderFilter[];
  subcategory: string[];
  group: CatalogGroupFilter[];
  size: string[];
  color: string[];
  brand: string[];
};

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
  selectedSubcategories: string[];
  selectedGenders: CatalogGenderFilter[];
  selectedGroups: CatalogGroupFilter[];
  sort: CatalogSortOption;
  onApply: (next: FilterDraft) => void;
};

type AccordionId =
  | 'sort'
  | 'gender'
  | 'productType'
  | 'categories'
  | 'size'
  | 'color'
  | 'brand';

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function withAllSelected<T extends string>(selected: T[], all: readonly T[]): T[] {
  return selected.length === 0 ? [...all] : selected;
}

function isEverySelected(selected: readonly string[], all: readonly string[]) {
  return all.length > 0 && all.every((value) => selected.includes(value));
}

function toggleAllValues<T extends string>(selected: T[], all: readonly T[]): T[] {
  return isEverySelected(selected, all) ? [] : [...all];
}

function AccordionIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-7 shrink-0"
      aria-hidden
    >
      {open ? (
        <path strokeLinecap="round" d="M5 12h14" />
      ) : (
        <>
          <path strokeLinecap="round" d="M12 5v14" />
          <path strokeLinecap="round" d="M5 12h14" />
        </>
      )}
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      className="size-3.5"
      aria-hidden
    >
      <path
        d="M3.5 8.2 6.4 11.2 12.5 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckboxControl({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center border ${
        checked ? 'border-black bg-black text-white' : 'border-black/35 bg-white text-transparent'
      }`}
      aria-hidden
    >
      <CheckMark />
    </span>
  );
}

function RadioControl({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border ${
        checked ? 'border-black' : 'border-black/35'
      }`}
      aria-hidden
    >
      <span className={`size-2.5 rounded-full ${checked ? 'bg-black' : 'bg-transparent'}`} />
    </span>
  );
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
  selectedSubcategories,
  selectedGenders,
  selectedGroups,
  sort,
  onApply,
}: CatalogFilterPanelProps) {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<Record<AccordionId, boolean>>({
    sort: false,
    gender: false,
    productType: false,
    categories: false,
    size: false,
    color: false,
    brand: false,
  });
  const [draft, setDraft] = useState<FilterDraft>({
    sort,
    gender: selectedGenders,
    subcategory: selectedSubcategories,
    group: selectedGroups,
    size: selectedSizes,
    color: selectedColors,
    brand: selectedBrands,
  });

  const brandIds = useMemo(() => brands.map((item) => String(item.id)), [brands]);
  const colorIds = useMemo(() => colors.map((item) => String(item.id)), [colors]);
  const sizeIds = useMemo(() => sizes.map((item) => String(item.id)), [sizes]);
  const subcategoryIds = useMemo(
    () => subcategories.map((item) => item.slug || String(item.id)),
    [subcategories],
  );

  const wasOpenRef = useRef(false);

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

  useEffect(() => {
    const justOpened = isOpen && !wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (!justOpened) return;

    setDraft({
      sort,
      gender: withAllSelected(selectedGenders, CATALOG_GENDER_FILTERS),
      subcategory: withAllSelected(selectedSubcategories, subcategoryIds),
      group: withAllSelected(selectedGroups, CATALOG_GROUP_FILTERS),
      size: withAllSelected(selectedSizes, sizeIds),
      color: withAllSelected(selectedColors, colorIds),
      brand: withAllSelected(selectedBrands, brandIds),
    });
    setOpenSections({
      sort: false,
      gender: false,
      productType: false,
      categories: false,
      size: false,
      color: false,
      brand: false,
    });
  }, [
    isOpen,
    sort,
    selectedGenders,
    selectedSubcategories,
    selectedGroups,
    selectedSizes,
    selectedColors,
    selectedBrands,
    subcategoryIds,
    sizeIds,
    colorIds,
    brandIds,
  ]);

  const toggleSection = (id: AccordionId) => {
    setOpenSections((current) => ({ ...current, [id]: !current[id] }));
  };

  const setList = <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const clearAll = () => {
    setDraft({
      sort: 'featured',
      gender: [...CATALOG_GENDER_FILTERS],
      subcategory: subcategoryIds,
      group: [...CATALOG_GROUP_FILTERS],
      size: sizeIds,
      color: colorIds,
      brand: brandIds,
    });
  };

  const sortOptions: Array<{ value: CatalogSortOption; label: string }> = [
    { value: 'featured', label: t.catalog.sortOptions.recommended },
    { value: 'price_asc', label: t.catalog.sortOptions.priceAsc },
    { value: 'price_desc', label: t.catalog.sortOptions.priceDesc },
    { value: 'newest', label: t.catalog.sortOptions.newest },
    { value: 'bestsellers', label: t.catalog.sortOptions.bestsellers },
  ];

  const genderOptions: Array<{ value: CatalogGenderFilter; label: string }> = [
    { value: 'men', label: t.catalog.genderOptions.men },
    { value: 'women', label: t.catalog.genderOptions.women },
  ];

  const groupOptions: Array<{ value: CatalogGroupFilter; label: string }> = [
    { value: 'accessories', label: t.catalog.categoryGroups.accessories },
    { value: 'clothing', label: t.catalog.categoryGroups.clothing },
    { value: 'fragrances', label: t.catalog.categoryGroups.fragrances },
  ];

  return (
    <div
      className={`${catalogFilterPanel.overlay} ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`${catalogFilterPanel.backdrop} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-label={t.catalog.closeFilters}
        onClick={onClose}
      />

      <aside
        className={`${catalogFilterPanel.aside} ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal={isOpen}
        aria-label={t.catalog.filterAndSort}
      >
        <div className={catalogFilterPanel.header}>
          <h2 className={catalogFilterPanel.title}>{t.catalog.filterAndSort}</h2>
          <button
            type="button"
            className={catalogFilterPanel.closeBtn}
            onClick={onClose}
            aria-label={t.catalog.closeFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={catalogFilterPanel.body}>
          <section>
            <button
              type="button"
              className={catalogFilterPanel.accordionBtn}
              aria-expanded={openSections.sort}
              onClick={() => toggleSection('sort')}
            >
              {t.catalog.filterGroups.sortBy}
              <AccordionIcon open={openSections.sort} />
            </button>
            {openSections.sort ? (
              <ul className={catalogFilterPanel.optionList} role="radiogroup">
                {sortOptions.map((option) => (
                  <li key={option.value}>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="radio"
                        name="catalog-sort"
                        className="sr-only"
                        checked={draft.sort === option.value}
                        onChange={() => setList('sort', option.value)}
                      />
                      <RadioControl checked={draft.sort === option.value} />
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section>
            <button
              type="button"
              className={catalogFilterPanel.accordionBtn}
              aria-expanded={openSections.gender}
              onClick={() => toggleSection('gender')}
            >
              {t.catalog.filterGroups.gender}
              <AccordionIcon open={openSections.gender} />
            </button>
            {openSections.gender ? (
              <ul className={catalogFilterPanel.optionList}>
                <li>
                  <label className={catalogFilterPanel.optionLabel}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isEverySelected(draft.gender, CATALOG_GENDER_FILTERS)}
                      onChange={() => setList('gender', toggleAllValues(draft.gender, CATALOG_GENDER_FILTERS))}
                    />
                    <CheckboxControl checked={isEverySelected(draft.gender, CATALOG_GENDER_FILTERS)} />
                    {t.catalog.genderAll}
                  </label>
                </li>
                {genderOptions.map((option) => (
                  <li key={option.value}>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={draft.gender.includes(option.value)}
                        onChange={() => setList('gender', toggleValue(draft.gender, option.value))}
                      />
                      <CheckboxControl checked={draft.gender.includes(option.value)} />
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {subcategories.length > 0 ? (
            <section>
              <button
                type="button"
                className={catalogFilterPanel.accordionBtn}
                aria-expanded={openSections.productType}
                onClick={() => toggleSection('productType')}
              >
                {t.catalog.filterGroups.productType}
                <AccordionIcon open={openSections.productType} />
              </button>
              {openSections.productType ? (
                <ul className={catalogFilterPanel.optionList}>
                  <li>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEverySelected(draft.subcategory, subcategoryIds)}
                        onChange={() =>
                          setList('subcategory', toggleAllValues(draft.subcategory, subcategoryIds))
                        }
                      />
                      <CheckboxControl checked={isEverySelected(draft.subcategory, subcategoryIds)} />
                      {t.catalog.selectAll}
                    </label>
                  </li>
                  {subcategories.map((item) => {
                    const value = item.slug || String(item.id);
                    return (
                      <li key={item.id}>
                        <label className={catalogFilterPanel.optionLabel}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={draft.subcategory.includes(value)}
                            onChange={() =>
                              setList('subcategory', toggleValue(draft.subcategory, value))
                            }
                          />
                          <CheckboxControl checked={draft.subcategory.includes(value)} />
                          {item.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          ) : null}

          <section>
            <button
              type="button"
              className={catalogFilterPanel.accordionBtn}
              aria-expanded={openSections.categories}
              onClick={() => toggleSection('categories')}
            >
              {t.catalog.filterGroups.categories}
              <AccordionIcon open={openSections.categories} />
            </button>
            {openSections.categories ? (
              <ul className={catalogFilterPanel.optionList}>
                <li>
                  <label className={catalogFilterPanel.optionLabel}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isEverySelected(draft.group, CATALOG_GROUP_FILTERS)}
                      onChange={() => setList('group', toggleAllValues(draft.group, CATALOG_GROUP_FILTERS))}
                    />
                    <CheckboxControl checked={isEverySelected(draft.group, CATALOG_GROUP_FILTERS)} />
                    {t.catalog.selectAll}
                  </label>
                </li>
                {groupOptions.map((option) => (
                  <li key={option.value}>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={draft.group.includes(option.value)}
                        onChange={() => setList('group', toggleValue(draft.group, option.value))}
                      />
                      <CheckboxControl checked={draft.group.includes(option.value)} />
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {sizes.length > 0 ? (
            <section>
              <button
                type="button"
                className={catalogFilterPanel.accordionBtn}
                aria-expanded={openSections.size}
                onClick={() => toggleSection('size')}
              >
                {t.catalog.filterGroups.size}
                <AccordionIcon open={openSections.size} />
              </button>
              {openSections.size ? (
                <ul className={catalogFilterPanel.optionList}>
                  <li>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEverySelected(draft.size, sizeIds)}
                        onChange={() => setList('size', toggleAllValues(draft.size, sizeIds))}
                      />
                      <CheckboxControl checked={isEverySelected(draft.size, sizeIds)} />
                      {t.catalog.selectAll}
                    </label>
                  </li>
                  {sizes.map((item) => {
                    const value = String(item.id);
                    return (
                      <li key={item.id}>
                        <label className={catalogFilterPanel.optionLabel}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={draft.size.includes(value)}
                            onChange={() => setList('size', toggleValue(draft.size, value))}
                          />
                          <CheckboxControl checked={draft.size.includes(value)} />
                          {item.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          ) : null}

          {colors.length > 0 ? (
            <section>
              <button
                type="button"
                className={catalogFilterPanel.accordionBtn}
                aria-expanded={openSections.color}
                onClick={() => toggleSection('color')}
              >
                {t.catalog.filterGroups.color}
                <AccordionIcon open={openSections.color} />
              </button>
              {openSections.color ? (
                <ul className={catalogFilterPanel.optionList}>
                  <li>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEverySelected(draft.color, colorIds)}
                        onChange={() => setList('color', toggleAllValues(draft.color, colorIds))}
                      />
                      <CheckboxControl checked={isEverySelected(draft.color, colorIds)} />
                      {t.catalog.selectAll}
                    </label>
                  </li>
                  {colors.map((item) => {
                    const value = String(item.id);
                    return (
                      <li key={item.id}>
                        <label className={catalogFilterPanel.optionLabel}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={draft.color.includes(value)}
                            onChange={() => setList('color', toggleValue(draft.color, value))}
                          />
                          <CheckboxControl checked={draft.color.includes(value)} />
                          {item.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          ) : null}

          {brands.length > 0 ? (
            <section>
              <button
                type="button"
                className={catalogFilterPanel.accordionBtn}
                aria-expanded={openSections.brand}
                onClick={() => toggleSection('brand')}
              >
                {t.catalog.filterGroups.brand}
                <AccordionIcon open={openSections.brand} />
              </button>
              {openSections.brand ? (
                <ul className={catalogFilterPanel.optionList}>
                  <li>
                    <label className={catalogFilterPanel.optionLabel}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEverySelected(draft.brand, brandIds)}
                        onChange={() => setList('brand', toggleAllValues(draft.brand, brandIds))}
                      />
                      <CheckboxControl checked={isEverySelected(draft.brand, brandIds)} />
                      {t.catalog.selectAll}
                    </label>
                  </li>
                  {brands.map((item) => {
                    const value = String(item.id);
                    return (
                      <li key={item.id}>
                        <label className={catalogFilterPanel.optionLabel}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={draft.brand.includes(value)}
                            onChange={() => setList('brand', toggleValue(draft.brand, value))}
                          />
                          <CheckboxControl checked={draft.brand.includes(value)} />
                          {item.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          ) : null}
        </div>

        <div className={catalogFilterPanel.footer}>
          <button
            type="button"
            className={catalogFilterPanel.applyBtn}
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            {t.catalog.applyFilters}
          </button>
          <button type="button" className={catalogFilterPanel.clearBtn} onClick={clearAll}>
            {t.catalog.clearFilters}
          </button>
        </div>
      </aside>
    </div>
  );
}
