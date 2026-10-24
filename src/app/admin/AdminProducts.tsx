'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { buildProductHref } from '@/features/catalog/lib/buildProductHref';
import { useTranslation } from '@/i18n/useTranslation';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';
import { useGetProductImagesQuery, useGetProductVariantsQuery } from '@/store/endpoints/catalogMetaEndpoints';
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from '@/store/endpoints/categoriesEndpoints';
import { useGetProductsRawQuery, useDeleteProductMutation, usePatchProductMutation } from '@/store/endpoints/productsEndpoints';
import type { ApiProduct } from '@/store/types';

import { formErrorText } from './formError';

export default function AdminProducts() {
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');
  const [openActions, setOpenActions] = useState<number | null>(null);
  const products = useGetProductsRawQuery();
  const [patchProduct] = usePatchProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const brands = useGetBrandsQuery();
  const variants = useGetProductVariantsQuery();
  const images = useGetProductImagesQuery();
  const subcategories = useGetSubcategoriesQuery();
  const categories = useGetCategoriesQuery();

  const brandName = useMemo(
    () => new Map((brands.data ?? []).map((brand) => [brand.id, brand.name])),
    [brands.data],
  );
  const subcategoryName = useMemo(
    () => new Map((subcategories.data ?? []).map((item) => [item.id, item.name])),
    [subcategories.data],
  );
  const categoryBySubcategory = useMemo(() => {
    const categorySlug = new Map((categories.data ?? []).map((category) => [category.id, category.slug]));
    return new Map(
      (subcategories.data ?? []).map((item) => [item.id, item.category ? categorySlug.get(item.category) : undefined]),
    );
  }, [categories.data, subcategories.data]);
  const productExtras = useMemo(() => {
    const variantProduct = new Map<number, number>();
    const stock = new Map<number, number>();
    for (const variant of variants.data ?? []) {
      variantProduct.set(variant.id, variant.product);
      stock.set(variant.product, (stock.get(variant.product) ?? 0) + (Number(variant.stock) || 0));
    }
    const photo = new Map<number, { src: string; main: boolean; order: number }>();
    for (const image of images.data ?? []) {
      const productId = variantProduct.get(image.product_variant);
      if (!productId || !image.image) continue;
      const next = { src: toImageUrl(image.image), main: Boolean(image.is_main), order: image.sort_order ?? 0 };
      const current = photo.get(productId);
      const better =
        !current ||
        (next.main && !current.main) ||
        (next.main === current.main && next.order < current.order);
      if (better) photo.set(productId, next);
    }
    return { stock, photo };
  }, [images.data, variants.data]);

  const filtered = (products.data ?? []).filter((product) => {
    const haystack = `${product.name} ${product.slug}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const selectedIds = new Set(selected);
  const allSelected = filtered.length > 0 && filtered.every((product) => selectedIds.has(product.id));

  function toggle(id: number) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAll() {
    setSelected(allSelected ? [] : filtered.map((product) => product.id));
  }

  async function hideProducts(list: ApiProduct[]) {
    setActing(true);
    setError('');
    setOpenActions(null);
    try {
      await Promise.all(
        list.map((product) =>
          patchProduct({
            id: product.id,
            body: {
              name: product.name,
              slug: product.slug,
              description: product.description ?? '',
              brand: product.brand,
              subcategory: product.subcategory,
              is_active: product.is_active !== false,
              is_hidden: true,
            },
          }).unwrap(),
        ),
      );
      setSelected((current) => current.filter((id) => !list.some((product) => product.id === id)));
    } catch (submitError) {
      setError(formErrorText(submitError, t.admin.saveError));
    } finally {
      setActing(false);
    }
  }

  async function deleteProducts(ids: number[]) {
    setActing(true);
    setError('');
    setOpenActions(null);
    try {
      await Promise.all(ids.map((id) => deleteProduct(id).unwrap()));
      setSelected((current) => current.filter((id) => !ids.includes(id)));
    } catch (submitError) {
      setError(formErrorText(submitError, t.admin.saveError));
    } finally {
      setActing(false);
    }
  }

  async function hideSelected() {
    const chosen = (products.data ?? []).filter((product) => selectedIds.has(product.id));
    await hideProducts(chosen);
  }

  async function deleteSelected() {
    await deleteProducts(selected);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 text-[28px] leading-tight font-bold">{t.admin.products}</h1>
          <p className="m-0 mt-1 text-sm text-[#9aa1ad]">{t.admin.productsPending}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center rounded-xl bg-[#3d6bff] px-5 text-sm font-bold text-white no-underline shadow-[0_8px_18px_rgb(61_107_255/28%)]"
        >
          {t.admin.addProduct}
        </Link>
      </div>
      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgb(30_41_59/6%)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#f0f2f6] px-5 py-4">
          <div className="flex items-center gap-2">
            {selected.length > 0 ? (
              <>
                <button
                  type="button"
                  disabled={acting}
                  onClick={hideSelected}
                  className="cursor-pointer rounded-xl border-0 bg-[#fff3b0] px-4 py-2 text-sm font-bold text-[#1d2433] disabled:opacity-60"
                >
                  {t.admin.hide}
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={deleteSelected}
                  className="cursor-pointer rounded-xl border-0 bg-[#ff3b3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                >
                  {t.admin.delete}
                </button>
              </>
            ) : null}
            {error ? <p className="m-0 text-sm text-[#ef4444]">{error}</p> : null}
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.admin.search}
            aria-label={t.admin.search}
            className="h-11 w-full max-w-xs rounded-xl border border-[#e7eaf0] bg-[#f8f9fc] px-4 text-sm outline-none focus:border-[#3d6bff] focus:bg-white"
          />
        </div>
        {products.isLoading ? <p className="m-0 px-5 py-6 text-sm text-[#6b7280]">{t.common.loading}</p> : null}
        {products.isError ? <p className="m-0 px-5 py-6 text-sm text-[#ef4444]">{t.admin.loadError}</p> : null}
        {!products.isLoading && !products.isError && filtered.length === 0 ? (
          <p className="m-0 px-5 py-6 text-sm text-[#6b7280]">{t.admin.empty}</p>
        ) : null}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-[#9aa1ad] uppercase">
                  <th className="w-12 px-5 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label={t.admin.selectAll}
                      className="size-4 cursor-pointer accent-[#3d6bff]"
                    />
                  </th>
                  <th className="w-16 px-3 py-3 font-semibold">{t.admin.photo}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.name}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.stock}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.slug}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.brands}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.subcategories}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.status}</th>
                  <th className="px-5 py-3 font-semibold">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const status = product.is_hidden
                    ? t.admin.hidden
                    : product.is_active === false
                      ? t.admin.inactive
                      : t.admin.active;
                  const statusClass = product.is_hidden
                    ? 'bg-[#f3f4f6] text-[#6b7280]'
                    : product.is_active === false
                      ? 'bg-[#fff1f0] text-[#ef4444]'
                      : 'bg-[#e8f7ee] text-[#178a45]';
                  return (
                    <tr key={product.id} className={`border-t border-[#f3f4f6] ${selectedIds.has(product.id) ? 'bg-[#f5f8ff]' : ''}`}>
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggle(product.id)}
                          aria-label={product.name}
                          className="size-4 cursor-pointer accent-[#3d6bff]"
                        />
                      </td>
                      <td className="px-3 py-3">
                        {productExtras.photo.get(product.id)?.src ? (
                          <img
                            src={productExtras.photo.get(product.id)?.src}
                            alt=""
                            className="size-12 rounded-xl object-cover"
                          />
                        ) : (
                          <img
                            src={locale === 'uk' ? '/images/catalog/photo-placeholder-uk.svg' : '/images/catalog/photo-placeholder-en.svg'}
                            alt=""
                            className="size-12 rounded-xl bg-[#f3f4f6] object-cover"
                          />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/products/${product.id}`} className="font-medium text-[#1d2433] no-underline">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-semibold">{productExtras.stock.get(product.id) ?? 0}</td>
                      <td className="px-5 py-4 text-[#6b7280]">{product.slug}</td>
                      <td className="px-5 py-4">{brandName.get(product.brand) ?? '—'}</td>
                      <td className="px-5 py-4">{subcategoryName.get(product.subcategory) ?? '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <RowActions
                          open={openActions === product.id}
                          onToggle={() => setOpenActions((current) => (current === product.id ? null : product.id))}
                          onClose={() => setOpenActions(null)}
                          editHref={`/admin/products/${product.id}`}
                          viewHref={buildProductHref(categoryBySubcategory.get(product.subcategory) || 'catalog', product)}
                          disabled={acting}
                          onHide={() => hideProducts([product])}
                          onDelete={() => deleteProducts([product.id])}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function RowActions({
  open,
  onToggle,
  onClose,
  editHref,
  viewHref,
  disabled,
  onHide,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  editHref: string;
  viewHref: string;
  disabled: boolean;
  onHide: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [place, setPlace] = useState({ top: 0, left: 0 });
  const itemClass = 'block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-sm text-[#1d2433] no-underline hover:bg-[#f6f7fb]';

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Node && buttonRef.current?.parentElement?.contains(target)) return;
      onClose();
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [onClose, open]);

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPlace({ top: rect.bottom + 6, left: rect.right });
    onToggle();
  }

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={t.admin.actions}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#e7eaf0] bg-white text-[#1d2433]"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>
      {open ? (
        <div
          className="fixed z-30 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-[0_12px_32px_rgb(30_41_59/16%)]"
          style={{ top: place.top, left: place.left, transform: 'translateX(-100%)' }}
        >
          <Link href={editHref} className={itemClass} onClick={onClose}>
            {t.admin.edit}
          </Link>
          <button type="button" className={`${itemClass} text-[#ef4444]`} disabled={disabled} onClick={onDelete}>
            {t.admin.delete}
          </button>
          <button type="button" className={itemClass} disabled={disabled} onClick={onHide}>
            {t.admin.hide}
          </button>
          <Link href={viewHref} target="_blank" className={itemClass} onClick={onClose}>
            {t.admin.view}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
