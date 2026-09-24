'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductShowcase from '@/widgets/ProductShowcase/ProductShowcase';
import ProductReviews from '@/widgets/ProductReviews/ProductReviews';
import { formatMessage, useTranslation } from '@/i18n/useTranslation';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { isCatalogListingSlug } from '@/features/catalog/model/catalogCategory';
import ClothingProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import { buildProductHref } from '@/features/catalog/lib/buildProductHref';
import { mapApiProductToCatalogCard } from '@/features/catalog/lib/mapApiProductToCatalogCard';
import { resolveVariantPrice } from '@/features/catalog/lib/resolveVariantOffer';
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
  useGetSimilarProductsQuery,
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
  const router = useRouter();
  const slugOrId = (params.id ?? params.slug) as string;

  const {
    data: product,
    error: productError,
    isError: isProductError,
    isLoading: isProductLoading,
    isFetching: isProductFetching,
    isUninitialized: isProductUninitialized,
    refetch: refetchProduct,
  } = useGetProductDetailsBySlugOrIdQuery(slugOrId, {
    skip: !slugOrId,
    refetchOnMountOrArgChange: true,
  });
  const { data: similarRaw } = useGetSimilarProductsQuery(
    {
      productId: Number(product?.id),
      subcategoryId: Number(product?.subcategory),
    },
    { skip: !product },
  );
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
    if (!product || !similarRaw) return [];

    const routeCategory = pathname?.split('/')[2] ?? 'women';
    const cardCategory = isCatalogListingSlug(routeCategory) ? routeCategory : 'women';
    const currentGenders = new Set(
      similarRaw.variants
        .filter((variant) => Number(variant.product) === Number(product.id) && variant.is_active)
        .map((variant) => variant.gender),
    );

    const ranked = [...similarRaw.products].sort((left, right) => {
      const score = (itemId: number) => {
        if (currentGenders.size === 0) return 0;
        const genders = similarRaw.variants
          .filter((variant) => Number(variant.product) === itemId && variant.is_active)
          .map((variant) => variant.gender);
        return genders.some((gender) => currentGenders.has(gender)) ? 0 : 1;
      };

      return score(Number(left.id)) - score(Number(right.id));
    });

    return ranked.slice(0, 3).map((item) => {
      const card = mapApiProductToCatalogCard({
        product: item,
        category: cardCategory,
        locale,
        brandById: new Map(),
        subcategoryById: new Map(),
        variants: similarRaw.variants,
        colorsById: new Map(),
        sizesById: new Map(),
        images: similarRaw.images,
        currencies: currenciesRaw,
        categoryIdBySlug: new Map(),
      });

      return {
        ...card,
        href: buildProductHref(routeCategory, item),
      };
    });
  }, [currenciesRaw, locale, pathname, product, similarRaw]);

  const breadcrumbs = useMemo(() => {
    if (!product || !pathname) {
      return [];
    }

    const routeCategory = pathname.split('/')[2] ?? 'catalog';
    const categoryLabel = isCatalogListingSlug(routeCategory)
      ? t.catalog.categories[routeCategory].navLabel
      : formatMetaLabel(category?.name || routeCategory);

    return [
      { href: '/', label: t.common.home },
      { href: `/catalog/${routeCategory}`, label: categoryLabel },
      { label: product.name, current: true },
    ];
  }, [category?.name, pathname, product, t.catalog.categories, t.common.home]);

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

  const redirectedSlug = useRef<string | null>(null);
  const [trackedSlug, setTrackedSlug] = useState(slugOrId);
  const [productRetryCount, setProductRetryCount] = useState(0);

  if (trackedSlug !== slugOrId) {
    setTrackedSlug(slugOrId);
    setProductRetryCount(0);
  }

  useEffect(() => {
    if (!product?.slug || !pathname || !slugOrId) return;
    if (slugOrId === product.slug) return;

    const segments = pathname.split('/');
    const lastIndex = segments.length - 1;
    if (!segments[lastIndex]) return;

    segments[lastIndex] = product.slug;
    router.replace(segments.join('/'));
  }, [pathname, product, router, slugOrId]);

  useEffect(() => {
    if (!isProductError || !slugOrId || productRetryCount >= 2) return;

    const timer = window.setTimeout(() => {
      setProductRetryCount((count) => count + 1);
      refetchProduct();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [isProductError, productRetryCount, refetchProduct, slugOrId]);

  useEffect(() => {
    if (!shouldRedirectToNotFound || !slugOrId) return;
    if (redirectedSlug.current === slugOrId) return;
    redirectedSlug.current = slugOrId;

    // Робимо "жорсткий" редирект, щоб гарантовано відкривалась готова сторінка `/404`,
    // а не залишався порожній стан на URL товару.
    window.location.replace('/404');
  }, [shouldRedirectToNotFound, slugOrId]);

  if (isPending) {
    return <div>{t.common.loading}</div>;
  }

  // Поки йде редирект — нічого не рендеримо, щоб уникнути "миготіння" UI.
  if (shouldRedirectToNotFound) {
    return <div>{t.common.loading}</div>;
  }

  if (isProductError) {
    if (productRetryCount < 2) {
      return <div>{t.common.loading}</div>;
    }

    return (
      <button
        type="button"
        className="mx-auto block cursor-pointer border-0 bg-transparent py-16 text-center text-dark/70"
        onClick={() => refetchProduct()}
      >
        {t.catalog.loadError}
      </button>
    );
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
        productId={String(product.id)}
        link={{
          href: buildProductHref(pathname?.split('/')[2] ?? 'catalog', product),
          label: product.name,
        }}
      />

      <ProductReviews />

      {relatedProducts.length > 0 ? (
        <div className="mb-16">
          <h2 className="mb-6 text-[24px] font-normal md:mb-8 md:text-[36px]">
            {t.product.youMayAlsoLike}
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ClothingProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
