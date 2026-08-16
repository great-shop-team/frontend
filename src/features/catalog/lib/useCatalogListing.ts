'use client';

import { useMemo } from 'react';

import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type {
  CatalogListingFilters,
  CatalogSortOption,
} from '@/features/catalog/model/catalogFilters';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import { getCatalogProducts } from '@/features/catalog/lib/catalogProductsData';
import { mapApiProductToCatalogCard } from '@/features/catalog/lib/mapApiProductToCatalogCard';
import { useTranslation } from '@/i18n/useTranslation';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from '@/store/endpoints/categoriesEndpoints';
import {
  useGetColorsQuery,
  useGetCurrenciesQuery,
  useGetProductImagesQuery,
  useGetProductVariantsQuery,
  useGetSizesQuery,
} from '@/store/endpoints/catalogMetaEndpoints';
import { useGetProductsRawQuery } from '@/store/endpoints/productsEndpoints';
import type { Brand, CatalogColor, CatalogSize, Subcategory } from '@/store/types';

function sortProducts(products: CatalogProduct[], sort: CatalogSortOption | undefined) {
  const next = [...products];

  switch (sort) {
    case 'price_asc':
      return next.sort(
        (a, b) =>
          (a.priceValue ?? Number.POSITIVE_INFINITY) - (b.priceValue ?? Number.POSITIVE_INFINITY),
      );
    case 'price_desc':
      return next.sort(
        (a, b) =>
          (b.priceValue ?? Number.NEGATIVE_INFINITY) - (a.priceValue ?? Number.NEGATIVE_INFINITY),
      );
    case 'name_asc':
      return next.sort((a, b) => a.title.localeCompare(b.title));
    case 'name_desc':
      return next.sort((a, b) => b.title.localeCompare(a.title));
    case 'featured':
    default:
      return next;
  }
}

function matchesRouteCategory(
  category: CatalogCategory,
  productName: string,
  subcategory: Subcategory | undefined,
  categoryIdBySlug: Map<string, number>,
  genders: Array<'male' | 'female' | 'unisex'>,
) {
  if (category === 'accessories') {
    return subcategory?.category === categoryIdBySlug.get('accessories');
  }

  const clothingId = categoryIdBySlug.get('clothing');
  const shoesId = categoryIdBySlug.get('shoes');
  const isApparel =
    subcategory?.category === clothingId ||
    subcategory?.category === shoesId ||
    subcategory == null;

  if (!isApparel) return false;

  if (genders.length > 0) {
    if (category === 'men') return genders.some((g) => g === 'male' || g === 'unisex');
    if (category === 'women') return genders.some((g) => g === 'female' || g === 'unisex');
  }

  const name = productName.toLowerCase();
  if (category === 'men') {
    if (/\bwom[ae]n'?s?\b|\bfemale\b|\bladies\b/.test(name)) return false;
    return /\bmen'?s?\b|\bmale\b|\bman\b/.test(name) || !/\bwom/.test(name);
  }
  if (category === 'women') {
    if (genders.length > 0) {
      return genders.some((g) => g === 'female' || g === 'unisex');
    }
    if (/\bmen'?s?\b|\bmale\b/.test(name) && !/\bwom/.test(name)) return false;
    return /\bwom[ae]n'?s?\b|\bfemale\b|\bladies\b/.test(name);
  }

  return true;
}

export function useCatalogListing(category: CatalogCategory, filters: CatalogListingFilters = {}) {
  const { locale } = useTranslation();

  const productsQuery = useGetProductsRawQuery();
  const brandsQuery = useGetBrandsQuery();
  const categoriesQuery = useGetCategoriesQuery();
  const subcategoriesQuery = useGetSubcategoriesQuery();
  const colorsQuery = useGetColorsQuery();
  const sizesQuery = useGetSizesQuery();
  const variantsQuery = useGetProductVariantsQuery();
  const imagesQuery = useGetProductImagesQuery();
  const currenciesQuery = useGetCurrenciesQuery();

  const isLoading =
    productsQuery.isLoading ||
    brandsQuery.isLoading ||
    categoriesQuery.isLoading ||
    subcategoriesQuery.isLoading ||
    colorsQuery.isLoading ||
    sizesQuery.isLoading ||
    variantsQuery.isLoading ||
    imagesQuery.isLoading ||
    currenciesQuery.isLoading;

  const isError = Boolean(productsQuery.isError);

  const facetData = useMemo(() => {
    const brands = (brandsQuery.data ?? []).filter((item) => {
      const active = 'is_active' in item ? (item as { is_active?: boolean }).is_active : true;
      const hidden = 'is_hidden' in item ? (item as { is_hidden?: boolean }).is_hidden : false;
      return active !== false && !hidden;
    });

    const categories = categoriesQuery.data ?? [];
    const categoryIdBySlug = new Map(categories.map((item) => [item.slug, item.id]));
    const clothingId = categoryIdBySlug.get('clothing');
    const shoesId = categoryIdBySlug.get('shoes');
    const accessoriesId = categoryIdBySlug.get('accessories');

    const subcategories = (subcategoriesQuery.data ?? [])
      .filter((item) => {
        const active = 'is_active' in item ? (item as { is_active?: boolean }).is_active : true;
        const hidden = 'is_hidden' in item ? (item as { is_hidden?: boolean }).is_hidden : false;
        return active !== false && !hidden;
      })
      .filter((item) => {
        if (category === 'accessories') return item.category === accessoriesId;
        return item.category === clothingId || item.category === shoesId;
      });

    const colors = (colorsQuery.data ?? []).filter((item) => {
      const active = 'is_active' in item ? (item as { is_active?: boolean }).is_active : true;
      return active !== false;
    });

    const sizes = [...(sizesQuery.data ?? [])].sort((a, b) => a.sort_order - b.sort_order);

    return { brands, subcategories, colors, sizes };
  }, [
    brandsQuery.data,
    categoriesQuery.data,
    subcategoriesQuery.data,
    colorsQuery.data,
    sizesQuery.data,
    category,
  ]);

  const products = useMemo(() => {
    // Безопасная фильтрация продуктов (проверяет наличие полей is_active / is_hidden)
    const apiProducts = (productsQuery.data ?? []).filter((product) => {
      const p = product as unknown as { is_active?: boolean; is_hidden?: boolean };
      const isActive = p.is_active !== undefined ? p.is_active : true;
      const isHidden = p.is_hidden !== undefined ? p.is_hidden : false;
      return isActive && !isHidden;
    });

    const brandById = new Map<number, Brand>(
      (brandsQuery.data ?? []).map((brand) => [brand.id, brand]),
    );
    const subcategoryById = new Map<number, Subcategory>(
      (subcategoriesQuery.data ?? []).map((item) => [item.id, item]),
    );
    const colorsById = new Map<number, CatalogColor>(
      (colorsQuery.data ?? []).map((item) => [item.id, item]),
    );
    const sizesById = new Map<number, CatalogSize>(
      (sizesQuery.data ?? []).map((item) => [item.id, item]),
    );
    const categoryIdBySlug = new Map(
      (categoriesQuery.data ?? []).map((item) => [item.slug, item.id]),
    );
    const variants = variantsQuery.data ?? [];
    const images = imagesQuery.data ?? [];
    const currencies = currenciesQuery.data ?? [];

    const mapped = apiProducts
      .filter((product) => {
        const subcategory = subcategoryById.get(product.subcategory);
        const productVariants = variants.filter((variant) => variant.product === product.id);
        const genders = productVariants.map((variant) => variant.gender);

        return matchesRouteCategory(category, product.name, subcategory, categoryIdBySlug, genders);
      })
      .map((product) =>
        mapApiProductToCatalogCard({
          product,
          category,
          locale,
          brandById,
          subcategoryById,
          variants,
          colorsById,
          sizesById,
          images,
          currencies,
        }),
      );

    const source =
      mapped.length > 0
        ? mapped
        : getCatalogProducts(category, locale, {
            subcategory: filters.subcategory,
            type: filters.type,
          });

    const brandFilters = new Set(filters.brand ?? []);
    const colorFilters = new Set(filters.color ?? []);
    const sizeFilters = new Set(filters.size ?? []);

    const filtered = source.filter((product) => {
      if (filters.q) {
        const needle = filters.q.toLowerCase();
        const haystack = [product.title, product.description, product.brandName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      if (filters.subcategory && product.subcategory !== filters.subcategory) return false;
      if (filters.type && product.type !== filters.type) return false;

      if (brandFilters.size > 0) {
        const brandKey = product.brandId != null ? String(product.brandId) : product.brandName;
        if (!brandKey || !brandFilters.has(brandKey)) return false;
      }

      if (colorFilters.size > 0) {
        const ids = (product.colorIds ?? []).map(String);
        const names = (product.colors ?? []).map((color) => color.name.toLowerCase());
        const hit = [...colorFilters].some(
          (value) => ids.includes(value) || names.includes(value.toLowerCase()),
        );
        if (!hit) return false;
      }

      if (sizeFilters.size > 0) {
        const ids = (product.sizeIds ?? []).map(String);
        const names = (product.sizes ?? []).map((size) => size.toLowerCase());
        const hit = [...sizeFilters].some(
          (value) => ids.includes(value) || names.includes(value.toLowerCase()),
        );
        if (!hit) return false;
      }

      return true;
    });

    return sortProducts(filtered, filters.sort);
  }, [
    productsQuery.data,
    brandsQuery.data,
    subcategoriesQuery.data,
    categoriesQuery.data,
    colorsQuery.data,
    sizesQuery.data,
    variantsQuery.data,
    imagesQuery.data,
    currenciesQuery.data,
    category,
    locale,
    filters.q,
    filters.subcategory,
    filters.type,
    filters.brand,
    filters.color,
    filters.size,
    filters.sort,
  ]);

  return {
    products,
    facets: facetData,
    isLoading,
    isError,
    isFetching: productsQuery.isFetching,
  };
}
