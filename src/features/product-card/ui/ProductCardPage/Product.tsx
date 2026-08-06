'use client';

import { useMemo } from 'react';
import ProductShowcase from '@/widgets/ProductShowcase/ProductShowcase';
import { useTranslation } from '@/i18n/useTranslation';
import { useParams, usePathname } from 'next/navigation';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import ClothingProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import {
  useGetBrandByIdQuery,
  useGetCategoryByIdQuery,
  useGetProductImagesQuery,
  useGetProductVariantsQuery,
  useGetProductsRawQuery,
  useGetSubcategoryByIdQuery,
} from '@/store/endpoints/productsEndpoints';
import type { ApiProductImage, ApiProductVariant } from '@/store/types';

const PRODUCT_IMAGE_PRESETS: Partial<Record<string, string[]>> = {
  'm-cloth-004': [
    '/images/frontViewhoodieBrown.png',
    '/images/backViewhoodieBrown.png',
    '/images/backViewhoodieBrownBotton.png',
    '/images/frontViewhoodieBrownColor.png',
  ],
};

const formatMetaLabel = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const DEFAULT_FALLBACK_IMAGE = '/images/product1.png';

const buildShowcaseImages = (params: {
  title: string;
  productSlugOrId: string;
  variants: ApiProductVariant[];
  images: ApiProductImage[];
}) => {
  const { title, productSlugOrId, variants, images } = params;

  // Presets (legacy/local mock) – keep as a fallback for known ids so the page is not blank.
  const presetImages = PRODUCT_IMAGE_PRESETS[productSlugOrId];

  const sortedImages = [...images].sort((a, b) => {
    const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
    const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
    if (orderA !== orderB) return orderA - orderB;
    if (a.is_main === b.is_main) return 0;
    return a.is_main ? -1 : 1;
  });

  const allImageUrls = [
    ...(presetImages ?? []),
    ...sortedImages.map((item) => item.image).filter(Boolean),
  ].filter(Boolean);

  const frontImage = allImageUrls[0] ?? DEFAULT_FALLBACK_IMAGE;
  const backImage = allImageUrls[1] ?? frontImage;
  const galleryImages = allImageUrls.slice(2).length > 0 ? allImageUrls.slice(2) : allImageUrls;

  const uniqueColors = Array.from(
    new Set(
      variants
        .map((variant) => variant.color)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0),
    ),
  );

  return {
    main: {
      front: { src: frontImage, alt: `${title} front` },
      back: { src: backImage, alt: `${title} back` },
    },
    gallery: galleryImages.map((image, index) => ({
      src: image,
      alt: `${title} gallery ${index + 1}`,
    })),
    colors: uniqueColors.map((color) => ({
      src: frontImage,
      alt: `${title} ${color}`,
    })),
  };
};

export default function Product() {
  const { t } = useTranslation();
  const params = useParams();
  const pathname = usePathname();
  const slugOrId = params.id as string;

  const { data: productsRaw = [], isLoading: isProductsLoading } = useGetProductsRawQuery();
  const { data: variantsRaw = [] } = useGetProductVariantsQuery();
  const { data: imagesRaw = [] } = useGetProductImagesQuery();

  const product = useMemo(() => {
    if (!slugOrId) return null;
    const numericId = Number(slugOrId);
    return (
      productsRaw.find((item) => item.slug === slugOrId) ??
      (Number.isFinite(numericId) ? productsRaw.find((item) => item.id === numericId) : undefined) ??
      null
    );
  }, [productsRaw, slugOrId]);

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
    return variantsRaw.filter((variant) => variant.product === product.id);
  }, [product, variantsRaw]);

  const productVariantIds = useMemo(() => new Set(productVariants.map((variant) => variant.id)), [
    productVariants,
  ]);

  const productImages = useMemo(() => {
    if (!product) return [];
    return imagesRaw.filter((image) => productVariantIds.has(image.product_variant));
  }, [imagesRaw, product, productVariantIds]);

  const showcaseImages = useMemo(() => {
    if (!product) return null;
    return buildShowcaseImages({
      title: product.name,
      productSlugOrId: slugOrId,
      variants: productVariants,
      images: productImages,
    });
  }, [product, productImages, productVariants, slugOrId]);

  const sizes = useMemo(() => {
    const values = productVariants
      .map((variant) => variant.size)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
    return Array.from(new Set(values));
  }, [productVariants]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    // Simple fallback: other products from the backend list.
    return productsRaw
      .filter((item) => item.id !== product.id)
      .slice(0, 3)
      .map((item): CatalogProduct => ({
        id: String(item.id),
        title: item.name,
        price: '—',
        image: {
          src: DEFAULT_FALLBACK_IMAGE,
          alt: item.name,
        },
        href: pathname ? `${pathname.split('/').slice(0, 3).join('/')}/${item.slug}` : '',
        slug: item.slug,
        description: item.description ?? '',
      }));
  }, [pathname, product, productsRaw]);

  const breadcrumbs = useMemo(() => {
    if (!product || !pathname) {
      return [];
    }

    const routeCategory = pathname.split('/')[2] ?? 'catalog';

    const categoryLabel = formatMetaLabel(category?.name || routeCategory);
    const subcategoryLabel = formatMetaLabel(subcategory?.name || '');

    return [
      { href: '/', label: 'Home' },
      { href: `/catalog/${routeCategory}`, label: categoryLabel },
      ...(subcategoryLabel ? [{ label: subcategoryLabel }] : []),
      { label: product.name, current: true },
    ];
  }, [category?.name, pathname, product, subcategory?.name]);

  if (isProductsLoading) {
    return <div>{t.common.loading}</div>;
  }

  if (!product || !showcaseImages) {
    return <div>{t.common.notFound}</div>;
  }

  return (
    <div>
      <ProductShowcase
        brand={formatMetaLabel(brand?.name || 'Brand')}
        title={product.name}
        description={product.description ? [product.description] : []}
        price={{
          current: 0,
          currency: 'USD',
        }}
        code={String(product.id)}
        size={sizes}
        rating={5}
        images={showcaseImages}
        breadcrumbs={breadcrumbs}
        link={{
          href: `/catalog/${pathname?.split('/')[2] ?? 'catalog'}/${slugOrId}`,
          label: product.name,
        }}
      />

      <div className="m-[2%]">
        <h2 className="m-[2%] text-[36px] font-normal">{t.product.youMayAlsoLike}</h2>

        <div className="relative flex gap-[2%]">
          {relatedProducts.map((item, key) => (
            <ClothingProductCard
              key={key}
              product={item as CatalogProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
