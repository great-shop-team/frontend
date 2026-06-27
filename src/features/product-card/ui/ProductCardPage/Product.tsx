'use client';

import { useMemo } from 'react';
import ProductShowcase from '@/widgets/ProductShowcase/ProductShowcase';
import { useTranslation } from '@/i18n/useTranslation';
import { useParams } from 'next/navigation';
import type { CatalogProduct } from '@/features/catalog/model/catalogProduct';
import ClothingProductCard from '@/features/catalog/ui/CatalogProductCard/CatalogProductCard';
import type { Product as ProductEntity } from '@/entities/product';
import {
  getProductById,
  getRelatedCatalogProducts,
} from '@/features/catalog/lib/catalogProductsData';

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

const buildShowcaseImages = (product: ProductEntity) => {
  const sourceImages = PRODUCT_IMAGE_PRESETS[product.id] ?? product.images;
  const [frontImage = '', backImage = frontImage, ...galleryImages] = sourceImages;
  const fallbackGallery = galleryImages.length > 0 ? galleryImages : sourceImages.slice(0, 2);

  return {
    main: {
      front: {
        src: frontImage,
        alt: `${product.name} front`,
      },
      back: {
        src: backImage,
        alt: `${product.name} back`,
      },
    },
    gallery: fallbackGallery.map((image, index) => ({
      src: image,
      alt: `${product.name} gallery ${index + 1}`,
    })),
    colors: product.options.colors.map((color) => ({
      src: frontImage,
      alt: `${product.name} ${color.name}`,
    })),
  };
};

export default function Product() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const product = id ? getProductById(id) : null;

  const relatedProducts = useMemo(
    () => (product ? getRelatedCatalogProducts(product, locale) : []),
    [locale, product],
  );

  const showcaseImages = useMemo(() => (product ? buildShowcaseImages(product) : null), [product]);
  const breadcrumbs = useMemo(() => {
    if (!product) {
      return [];
    }

    const categoryLabel = formatMetaLabel(product.category);
    const subcategoryLabel = formatMetaLabel(product.subcategory);
    const typeLabel = formatMetaLabel(product.type);

    return [
      { href: '/', label: 'Home' },
      { href: `/catalog/${product.category}`, label: categoryLabel },
      { label: subcategoryLabel },
      { label: typeLabel },
      { label: product.name, current: true },
    ];
  }, [product]);

  if (!product || !showcaseImages) {
    return <div>{t.common.notFound}</div>;
  }

  return (
    <div>
      <ProductShowcase
        brand={formatMetaLabel(
          product.subcategory === 'fragrances' ? product.type : product.category,
        )}
        title={product.name}
        description={[product.description]}
        price={{
          current: product.price.amount,
          currency: product.price.currency,
        }}
        code={product.id.toUpperCase()}
        size={product.options.sizes}
        rating={product.inStock ? 5 : 4}
        images={showcaseImages}
        breadcrumbs={breadcrumbs}
        link={{
          href: `/catalog/${product.category}/${product.id}`,
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
              onAddToCart={(size) => console.log('Add to cart:', item.id, size)}
              onAddToWishlist={() => console.log('Add to wishlist:', item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
