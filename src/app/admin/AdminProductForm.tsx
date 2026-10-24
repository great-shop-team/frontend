'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import { useGetBrandsQuery } from '@/store/endpoints/brandsEndpoints';
import {
  useCreateProductImageMutation,
  useCreateProductVariantMutation,
  useDeleteProductImageMutation,
  useDeleteProductVariantMutation,
  useGetColorsQuery,
  useGetCurrenciesQuery,
  useGetProductImagesQuery,
  useGetProductVariantsQuery,
  useGetSizesQuery,
  usePatchProductImageMutation,
  usePatchProductVariantMutation,
} from '@/store/endpoints/catalogMetaEndpoints';
import { useGetSubcategoriesQuery } from '@/store/endpoints/categoriesEndpoints';
import {
  useCreateProductMutation,
  useGetProductRawByIdQuery,
  usePatchProductMutation,
} from '@/store/endpoints/productsEndpoints';
import type { ProductVariantGender, ProductWriteInput } from '@/store/types';

import AdminPhotoEditor, { type AdminPhoto } from './AdminPhotoEditor';
import { formErrorText } from './formError';

const fieldClass =
  'h-11 w-full rounded-xl border border-[#e7eaf0] bg-[#f8f9fc] px-4 text-sm text-[#1d2433] outline-none transition-colors focus:border-[#3d6bff] focus:bg-white';
const labelClass = 'mb-1.5 block text-xs font-semibold tracking-wide text-[#8b93a1] uppercase';
const cardClass = 'rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgb(30_41_59/6%)]';

const emptyProduct: ProductWriteInput = {
  name: '',
  slug: '',
  description: '',
  brand: 0,
  subcategory: 0,
  is_active: true,
  is_hidden: false,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type OfferRow = {
  key: string;
  remoteId?: number;
  price: string;
  size: string;
  color: string;
  sku?: string;
  stock?: number;
  gender?: ProductVariantGender;
};

function emptyOffer(): OfferRow {
  return { key: `offer-${Math.random().toString(36).slice(2)}`, price: '', size: '', color: '' };
}

function offerStarted(row: OfferRow) {
  return Boolean(row.price.trim() || row.size || row.color);
}

function ProductFields({ initial, productId }: { initial: ProductWriteInput; productId?: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const brands = useGetBrandsQuery();
  const subcategories = useGetSubcategoriesQuery();
  const [createProduct, createState] = useCreateProductMutation();
  const [patchProduct, patchState] = usePatchProductMutation();
  const variants = useGetProductVariantsQuery();
  const images = useGetProductImagesQuery(undefined, { skip: !productId });
  const colors = useGetColorsQuery();
  const sizes = useGetSizesQuery();
  const currencies = useGetCurrenciesQuery();
  const [createImage] = useCreateProductImageMutation();
  const [patchImage] = usePatchProductImageMutation();
  const [deleteImage] = useDeleteProductImageMutation();
  const [createVariant] = useCreateProductVariantMutation();
  const [patchVariant] = usePatchProductVariantMutation();
  const [deleteVariant] = useDeleteProductVariantMutation();
  const [form, setForm] = useState(initial);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [photosReady, setPhotosReady] = useState(!productId);
  const [offers, setOffers] = useState<OfferRow[]>([emptyOffer()]);
  const [offersReady, setOffersReady] = useState(!productId);
  const [slugEdited, setSlugEdited] = useState(Boolean(productId));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const saving = createState.isLoading || patchState.isLoading;

  const remotePhotos = useMemo(() => {
    if (!productId) return [];
    const variantIds = new Set(
      (variants.data ?? []).filter((variant) => variant.product === productId).map((variant) => variant.id),
    );
    return (images.data ?? [])
      .filter((image) => variantIds.has(image.product_variant))
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((image) => ({
        key: `image-${image.id}`,
        src: toImageUrl(image.image),
        remoteId: image.id,
      }));
  }, [images.data, productId, variants.data]);

  useEffect(() => {
    if (!productId || photosReady || variants.isLoading || images.isLoading) return;
    setPhotos(remotePhotos);
    setPhotosReady(true);
  }, [images.isLoading, photosReady, productId, remotePhotos, variants.isLoading]);

  const loadedOffers = useMemo(() => {
    if (!productId) return [];
    return (variants.data ?? [])
      .filter((variant) => variant.product === productId)
      .map((variant) => ({
        key: `variant-${variant.id}`,
        remoteId: variant.id,
        price: variant.price || currencies.data?.find((item) => item.product_variant === variant.id)?.amount || '',
        size: variant.size ? String(variant.size) : '',
        color: variant.color ? String(variant.color) : '',
        sku: variant.sku,
        stock: variant.stock,
        gender: variant.gender,
      }));
  }, [currencies.data, productId, variants.data]);

  useEffect(() => {
    if (!productId || offersReady || variants.isLoading || currencies.isLoading) return;
    setOffers(loadedOffers.length ? loadedOffers : [emptyOffer()]);
    setOffersReady(true);
  }, [currencies.isLoading, loadedOffers, offersReady, productId, variants.isLoading]);

  async function savePhotos(savedProductId: number, allowMissingVariant = false, variantId?: number) {
    const resolvedVariantId =
      variantId ?? (variants.data ?? []).find((variant) => variant.product === savedProductId)?.id;
    const kept = new Set(photos.map((photo) => photo.remoteId).filter((id): id is number => typeof id === 'number'));

    for (const photo of remotePhotos) {
      if (photo.remoteId && !kept.has(photo.remoteId)) {
        await deleteImage(photo.remoteId).unwrap();
      }
    }

    const sameOrder =
      photos.length === remotePhotos.length &&
      photos.every((photo, index) => photo.remoteId === remotePhotos[index]?.remoteId);

    for (const [order, photo] of photos.entries()) {
      const isMain = order === 0;
      if (photo.remoteId && photo.file) {
        await patchImage({ id: photo.remoteId, image: photo.file, is_main: isMain, sort_order: order }).unwrap();
      } else if (photo.remoteId && !sameOrder) {
        await patchImage({ id: photo.remoteId, is_main: isMain, sort_order: order }).unwrap();
      } else if (photo.file) {
        if (!resolvedVariantId) {
          if (allowMissingVariant) return;
          throw new Error('photo');
        }
        await createImage({
          product_variant: resolvedVariantId,
          image: photo.file,
          is_main: isMain,
          sort_order: order,
        }).unwrap();
      }
    }
  }

  function setName(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugEdited ? current.slug : slugify(value),
    }));
  }

  function setOffer(key: string, patch: Partial<OfferRow>) {
    setOffers((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  async function saveOffers(savedProductId: number) {
    let firstVariantId: number | undefined;
    const kept = new Set(offers.map((row) => row.remoteId).filter((id): id is number => typeof id === 'number'));

    for (const row of loadedOffers) {
      if (row.remoteId && !kept.has(row.remoteId)) {
        await deleteVariant(row.remoteId).unwrap();
      }
    }

    for (const row of offers) {
      if (!offerStarted(row)) continue;
      if (!row.size || !row.color || !row.price.trim()) throw new Error('offer');

      const body = {
        product: savedProductId,
        size: Number(row.size),
        color: Number(row.color),
        price: row.price.trim(),
        sku: row.sku || `${form.slug}-${row.size}-${row.color}`,
        stock: row.stock ?? 0,
        gender: row.gender || 'unisex',
        is_active: true,
      } as const;

      if (row.remoteId) {
        await patchVariant({ id: row.remoteId, body }).unwrap();
        firstVariantId ??= row.remoteId;
      } else {
        const created = await createVariant(body).unwrap();
        firstVariantId ??= created.id;
      }
    }

    return firstVariantId;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.name.trim() || !form.slug.trim() || !form.brand || !form.subcategory) {
      setError(t.admin.saveError);
      return;
    }

    if (offers.some((row) => offerStarted(row) && (!row.size || !row.color || !row.price.trim()))) {
      setError(t.admin.saveError);
      return;
    }

    const body: ProductWriteInput = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
    };

    try {
      if (productId) {
        await patchProduct({ id: productId, body }).unwrap();
        const variantId = await saveOffers(productId);
        await savePhotos(productId, false, variantId);
        setMessage(t.admin.saved);
        return;
      }

      const created = await createProduct(body).unwrap();
      const variantId = await saveOffers(created.id);
      await savePhotos(created.id, true, variantId);
      router.push(`/admin/products/${created.id}`);
    } catch (submitError) {
      setError(formErrorText(submitError, t.admin.saveError));
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <section className={cardClass}>
        <AdminPhotoEditor
          photos={photos}
          onChange={setPhotos}
          label={t.admin.photoAngles}
          hint={t.admin.photoAnglesHint}
        />
      </section>

      <section className={cardClass}>
        <h2 className="m-0 text-[17px] font-bold">{t.admin.details}</h2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>{t.admin.name}</span>
            <input className={fieldClass} value={form.name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="block">
            <span className={labelClass}>{t.admin.slug}</span>
            <input
              className={fieldClass}
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);
                setForm((current) => ({ ...current, slug: event.target.value }));
              }}
              required
            />
          </label>
          <label className="col-span-2 block">
            <span className={labelClass}>{t.admin.description}</span>
            <textarea
              className={`${fieldClass} h-28 resize-y py-3`}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className={labelClass}>{t.admin.brand}</span>
            <select
              className={fieldClass}
              value={form.brand || ''}
              onChange={(event) => setForm((current) => ({ ...current, brand: Number(event.target.value) }))}
              required
            >
              <option value="">{t.admin.choose}</option>
              {(brands.data ?? []).map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t.admin.subcategory}</span>
            <select
              className={fieldClass}
              value={form.subcategory || ''}
              onChange={(event) => setForm((current) => ({ ...current, subcategory: Number(event.target.value) }))}
              required
            >
              <option value="">{t.admin.choose}</option>
              {(subcategories.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="m-0 text-[17px] font-bold">{t.admin.variantsTitle}</h2>
        <div className="mt-5 flex flex-col gap-3">
          {offers.map((row, index) => {
            const swatch = (colors.data ?? []).find((color) => String(color.id) === row.color)?.hex_code || '#eef1f6';
            return (
              <article key={row.key} className="rounded-2xl bg-[#f6f7fb] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-[#9aa1ad]">{index + 1}</span>
                  <button
                    type="button"
                    aria-label={t.admin.removePhoto}
                    onClick={() =>
                      setOffers((current) => (current.length === 1 ? [emptyOffer()] : current.filter((item) => item.key !== row.key)))
                    }
                    className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#6b7280] shadow-sm"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className={labelClass}>{t.admin.price}</span>
                    <input
                      className={`${fieldClass} bg-white`}
                      inputMode="decimal"
                      value={row.price}
                      onChange={(event) => setOffer(row.key, { price: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>{t.admin.size}</span>
                    <select
                      className={`${fieldClass} bg-white`}
                      value={row.size}
                      onChange={(event) => setOffer(row.key, { size: event.target.value })}
                    >
                      <option value="">{t.admin.choose}</option>
                      {(sizes.data ?? []).map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={labelClass}>{t.admin.color}</span>
                    <span className="flex items-center gap-2">
                      <span className="size-9 shrink-0 rounded-full border border-black/10" style={{ background: swatch }} />
                      <select
                        className={`${fieldClass} bg-white`}
                        value={row.color}
                        onChange={(event) => setOffer(row.key, { color: event.target.value })}
                      >
                        <option value="">{t.admin.choose}</option>
                        {(colors.data ?? []).map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                </div>
              </article>
            );
          })}
          <button
            type="button"
            onClick={() => setOffers((current) => [...current, emptyOffer()])}
            className="cursor-pointer rounded-2xl border border-dashed border-[#c9d0dc] bg-[#f7f8fb] px-4 py-3 text-sm font-medium text-[#3d6bff]"
          >
            + {t.admin.addVariant}
          </button>
        </div>
      </section>

      <section className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap gap-2">
          <label
            className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium ${
              form.is_active ? 'bg-[#e8f1ff] text-[#3b82f6]' : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={form.is_active}
              onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
            />
            {t.admin.active}
          </label>
          <label
            className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium ${
              form.is_hidden ? 'bg-[#fff3b0] text-[#1d2433]' : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={form.is_hidden}
              onChange={(event) => setForm((current) => ({ ...current, is_hidden: event.target.checked }))}
            />
            {t.admin.hidden}
          </label>
        </div>
        <div className="flex items-center gap-4">
          {message ? <p className="m-0 text-sm text-[#16a34a]">{message}</p> : null}
          {error ? <p className="m-0 text-sm text-[#ef4444]">{error}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl border-0 bg-[#3d6bff] px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgb(61_107_255/28%)] disabled:opacity-60"
          >
            {saving ? t.common.saving : t.admin.save}
          </button>
        </div>
      </section>
    </form>
  );
}

export default function AdminProductForm({ productId }: { productId?: number }) {
  const { t } = useTranslation();
  const product = useGetProductRawByIdQuery(productId ?? skipToken);
  const isEdit = typeof productId === 'number';

  if (isEdit && product.isLoading) {
    return <p className="m-0 text-sm text-[#6b7280]">{t.common.loading}</p>;
  }

  if (isEdit && (product.isError || !product.data)) {
    return <p className="m-0 text-sm text-[#ef4444]">{t.admin.loadError}</p>;
  }

  const initial: ProductWriteInput = product.data
    ? {
        name: product.data.name ?? '',
        slug: product.data.slug ?? '',
        description: product.data.description ?? '',
        brand: product.data.brand ?? 0,
        subcategory: product.data.subcategory ?? 0,
        is_active: product.data.is_active !== false,
        is_hidden: Boolean(product.data.is_hidden),
      }
    : emptyProduct;

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div>
        <Link href="/admin/products" className="text-sm text-[#8b93a1] no-underline hover:text-[#1d2433]">
          ← {t.admin.backToProducts}
        </Link>
        <h1 className="m-0 mt-2 text-[28px] leading-tight font-bold">{isEdit ? t.admin.editProduct : t.admin.addProduct}</h1>
      </div>
      <ProductFields key={product.data?.id ?? 'new'} initial={initial} productId={productId} />
    </div>
  );
}
