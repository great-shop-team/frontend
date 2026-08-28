'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductShowcase from '@/widgets/ProductShowcase/ProductShowcase';
import ProductReviews from '@/widgets/ProductReviews/ProductReviews';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { useParams, usePathname } from 'next/navigation';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import ClothingProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import {
  formatCatalogPrice,
  pickMainImageUrl,
  resolveVariantPrice,
} from '@/features/catalog/lib/resolveVariantOffer';
import {
  buildVariantColorOptions,
  buildVariantSizeOptions,
  findMatchingVariant,
  getImagesForVariant,
} from '@/features/product-card/lib/resolveSelectedVariant';
import { toImageUrl } from '@/store/api/mappers/products.mapper';
import {
  useGetColorsQuery,
  useGetCurrenciesQuery,
  useGetProductImagesQuery,
  useGetProductVariantsQuery,
  useGetSizesQuery,
} from '@/store/endpoints/catalogMetaEndpoints';
import {
  useGetProductDetailsBySlugOrIdQuery,
  useGetProductsRawQuery,
} from '@/store/endpoints/productsEndpoints';
import { useGetBrandByIdQuery } from '@/store/endpoints/brandsEndpoints';
import {
  useGetCategoryByIdQuery,
  useGetSubcategoryByIdQuery,
} from '@/store/endpoints/categoriesEndpoints';
import type { ProductImageRecord } from '@/store/types';

const formatMetaLabel = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const buildShowcaseImages = (params: {
  title: string;
  images: ProductImageRecord[];
  imageAlt: {
    front: string;
    back: string;
    gallery: string;
  };
}) => {
  const { title, images, imageAlt } = params;

  const allImageUrls = [...images]
    .sort((a, b) => {
      const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
      const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
      if (orderA !== orderB) return orderA - orderB;
      if (a.is_main === b.is_main) return 0;
      return a.is_main ? -1 : 1;
    })
    .map((item) => toImageUrl(item.image))
    .filter(Boolean);

  const uniqueImageUrls = allImageUrls.filter((src, index, array) => array.indexOf(src) === index);

  const frontImage = uniqueImageUrls[0] ?? '';
  const backImage = uniqueImageUrls[1] ?? frontImage;
  const galleryImages =
    uniqueImageUrls.slice(2).length > 0 ? uniqueImageUrls.slice(2) : uniqueImageUrls;

  return {
    main: {
      front: {
        src: frontImage,
        alt: formatMessage(imageAlt.front, { title }),
      },
      back: {
        src: backImage,
        alt: formatMessage(imageAlt.back, { title }),
      },
    },
    gallery: galleryImages.map((image, index) => ({
      src: image,
      alt: formatMessage(imageAlt.gallery, { title, n: index + 1 }),
    })),
  };
};

export default function Product() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const pathname = usePathname();
  const slugOrId = params.id as string;

  const {
    data: product,
    error: productError,
    isError: isProductError,
    isLoading: isProductLoading,
    isFetching: isProductFetching,
    isUninitialized: isProductUninitialized,
  } = useGetProductDetailsBySlugOrIdQuery(slugOrId, {
    skip: !slugOrId,
  });
  const { data: productsRaw = [] } = useGetProductsRawQuery(undefined, {
    skip: !product,
  });
  const {
    data: variantsRaw = [],
    isLoading: isVariantsLoading,
    isFetching: isVariantsFetching,
  } = useGetProductVariantsQuery();
  const {
    data: imagesRaw = [],
    isLoading: isImagesLoading,
    isFetching: isImagesFetching,
  } = useGetProductImagesQuery();
  const { data: currenciesRaw = [] } = useGetCurrenciesQuery();
  const {
    data: sizesRaw = [],
    isLoading: isSizesLoading,
    isFetching: isSizesFetching,
  } = useGetSizesQuery();
  const {
    data: colorsRaw = [],
    isLoading: isColorsLoading,
    isFetching: isColorsFetching,
  } = useGetColorsQuery();

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  const { data: brand } = useGetBrandByIdQuery(product?.brand ?? 0, {
    skip: !product,
  });
  const { data: subcategory } = useGetSubcategoryByIdQuery(product?.subcategory ?? 0, {
    skip: !product,
  });
  const { data: category } = useGetCategoryByIdQuery(subcategory?.category ?? 0, {
    skip: !subcategory,
  });

  const productVariants = useMemo(() => {
    if (!product) return [];
    return variantsRaw.filter(
      (variant) => Number(variant.product) === Number(product.id) && variant.is_active !== false,
    );
  }, [product, variantsRaw]);

  const productVariantIds = useMemo(
    () => new Set(productVariants.map((variant) => Number(variant.id))),
    [productVariants],
  );

  const productImages = useMemo(() => {
    if (!product) return [];
    return imagesRaw.filter((image) => productVariantIds.has(Number(image.product_variant)));
  }, [imagesRaw, product, productVariantIds]);

  const selectedVariant = useMemo(() => {
    if (selectedVariantId != null) {
      const current = productVariants.find((variant) => Number(variant.id) === selectedVariantId);
      if (current) return current;
    }
    return findMatchingVariant({ variants: productVariants });
  }, [productVariants, selectedVariantId]);

  const selectedVariantImages = useMemo(
    () =>
      getImagesForVariant(productImages, selectedVariant ? Number(selectedVariant.id) : undefined),
    [productImages, selectedVariant],
  );

  const showcaseImages = useMemo(() => {
    if (!product) return null;
    return buildShowcaseImages({
      title: product.name,
      images: selectedVariantImages,
      imageAlt: t.product.imageAlt,
    });
  }, [product, selectedVariantImages, t]);

  const offerPrice = useMemo(
    () =>
      resolveVariantPrice({
        variants: selectedVariant ? [selectedVariant] : [],
        currencies: currenciesRaw,
      }),
    [currenciesRaw, selectedVariant],
  );

  const sizeOptions = useMemo(
    () => buildVariantSizeOptions({ variants: productVariants, sizes: sizesRaw }),
    [productVariants, sizesRaw],
  );

  const colorOptions = useMemo(() => {
    if (!product) return [];
    return buildVariantColorOptions({
      variants: productVariants,
      colors: colorsRaw,
      images: productImages,
    }).map((option) => ({
      ...option,
      alt: formatMessage(t.product.imageAlt.color, { title: product.name, color: option.name }),
    }));
  }, [colorsRaw, product, productImages, productVariants, t]);

  const handleSelectSize = useCallback(
    (sizeId: number) => {
      const nextVariant = findMatchingVariant({
        variants: productVariants,
        sizeId,
        colorId: selectedVariant ? Number(selectedVariant.color) : undefined,
        prefer: 'size',
      });
      if (nextVariant) setSelectedVariantId(Number(nextVariant.id));
    },
    [productVariants, selectedVariant],
  );

  const handleSelectColor = useCallback(
    (colorId: number) => {
      const nextVariant = findMatchingVariant({
        variants: productVariants,
        sizeId: selectedVariant ? Number(selectedVariant.size) : undefined,
        colorId,
        prefer: 'color',
      });
      if (nextVariant) setSelectedVariantId(Number(nextVariant.id));
    },
    [productVariants, selectedVariant],
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const sameSubcategoryProducts = productsRaw.filter(
      (item) => item.id !== product.id && item.subcategory === product.subcategory,
    );
    const fallbackProducts = productsRaw.filter(
      (item) =>
        item.id !== product.id &&
        !sameSubcategoryProducts.some((candidate) => candidate.id === item.id),
    );

    return [...sameSubcategoryProducts, ...fallbackProducts]
      .slice(0, 3)
      .map((item): CatalogProduct => {
        const itemVariants = variantsRaw.filter(
          (variant) => Number(variant.product) === Number(item.id) && variant.is_active,
        );
        const itemVariantIds = new Set(itemVariants.map((variant) => Number(variant.id)));
        const itemImages = imagesRaw.filter((image) =>
          itemVariantIds.has(Number(image.product_variant)),
        );
        const itemPrice = resolveVariantPrice({
          variants: itemVariants,
          currencies: currenciesRaw,
        });

        return {
          id: String(item.id),
          title: item.name,
          price: itemPrice ? formatCatalogPrice(itemPrice.amount, itemPrice.currency, locale) : '—',
          image: {
            src: pickMainImageUrl(itemImages) ?? '',
            alt: item.name,
          },
          href: pathname ? `${pathname.split('/').slice(0, 3).join('/')}/${item.id}` : '',
          slug: item.slug,
          description: item.description ?? '',
        };
      })
      .filter((item) => item.image.src);
  }, [currenciesRaw, imagesRaw, locale, pathname, product, productsRaw, variantsRaw]);

  const breadcrumbs = useMemo(() => {
    if (!product || !pathname) {
      return [];
    }

    const routeCategory = pathname.split('/')[2] ?? 'catalog';

    const categoryLabel = formatMetaLabel(category?.name || routeCategory);
    const subcategoryLabel = formatMetaLabel(subcategory?.name || '');

    return [
      { href: '/', label: t.common.home },
      { href: `/catalog/${routeCategory}`, label: categoryLabel },
      ...(subcategoryLabel ? [{ label: subcategoryLabel }] : []),
      { label: product.name, current: true },
    ];
  }, [category?.name, pathname, product, subcategory?.name, t.common.home]);

  const productErrorStatus =
    productError && typeof productError === 'object' && 'status' in productError
      ? productError.status
      : undefined;

  const isPending = !slugOrId || isProductUninitialized || isProductLoading || isProductFetching;

  const shouldRedirectToNotFound =
    !isPending && // бекенд повернув 404
    ((isProductError && productErrorStatus === 404) ||
      // queryFn повернув null, бо slug не знайдено (це НЕ помилка RTK Query)
      (!isProductError && product === null));

  const hasTriggeredNotFoundRedirect = useRef(false);

  useEffect(() => {
    if (!shouldRedirectToNotFound) return;
    if (hasTriggeredNotFoundRedirect.current) return;
    hasTriggeredNotFoundRedirect.current = true;

    // Робимо "жорсткий" редирект, щоб гарантовано відкривалась готова сторінка `/404`,
    // а не залишався порожній стан на URL товару.
    window.location.replace('/404');
  }, [shouldRedirectToNotFound]);

  if (isPending) {
    return <div>{t.common.loading}</div>;
  }

  // Поки йде редирект — нічого не рендеримо, щоб уникнути "миготіння" UI.
  if (shouldRedirectToNotFound) {
    return <div>{t.common.loading}</div>;
  }

  if (isProductError) {
    return null;
  }

  const isMetaPending =
    isVariantsLoading ||
    isVariantsFetching ||
    isImagesLoading ||
    isImagesFetching ||
    isSizesLoading ||
    isSizesFetching ||
    isColorsLoading ||
    isColorsFetching;

  // Якщо продукт існує, але мета-дані (варіанти/зображення) ще підтягуються — показуємо loading,
  // а не порожній екран.
  if (!product || isMetaPending || !showcaseImages) {
    return <div>{t.common.loading}</div>;
  }

  return (
    <div>
      <ProductShowcase
        brand={formatMetaLabel(brand?.name || 'Brand')}
        title={product.name}
        description={product.description ? [product.description] : []}
        price={{
          current: offerPrice?.amount ?? 0,
          currency: offerPrice?.currency ?? 'USD',
        }}
        code={selectedVariant?.sku || String(product.id)}
        sizes={sizeOptions}
        selectedSizeId={selectedVariant ? Number(selectedVariant.size) : undefined}
        onSelectSize={handleSelectSize}
        colors={colorOptions}
        selectedColorId={selectedVariant ? Number(selectedVariant.color) : undefined}
        onSelectColor={handleSelectColor}
        rating={5}
        images={showcaseImages}
        breadcrumbs={breadcrumbs}
        link={{
          href: `/catalog/${pathname?.split('/')[2] ?? 'catalog'}/${slugOrId}`,
          label: product.name,
        }}
      />

      <ProductReviews />

      <div className="mb-16">
        <h2 className="mb-6 text-[24px] font-normal md:mb-8 md:text-[36px]">
          {t.product.youMayAlsoLike}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {relatedProducts.map((item, key) => (
            <ClothingProductCard key={key} product={item as CatalogProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}
