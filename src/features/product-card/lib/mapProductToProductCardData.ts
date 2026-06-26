import type { Product } from '@/entities/product/model/types';
import { getProductDetailPath } from '@/entities/product/lib/catalogProducts';
import type { ProductCardData } from '@/store/types';

export function mapProductToProductCardData(product: Product, related: Product[]): ProductCardData {
  const mainImage = product.images[0] ?? '';
  const secondImage = product.images[1] ?? mainImage;

  return {
    id: product.id,
    brand: product.sourceCategory?.trim() || product.type,
    title: product.name,
    description: product.description ? [product.description] : [],
    price: {
      current: product.price.amount,
      currency: product.price.currency,
    },
    code: product.id,
    rating: 4,
    size: product.options.sizes,
    images: {
      main: {
        front: { src: mainImage, alt: product.name },
        back: { src: secondImage, alt: `${product.name} alternate view` },
      },
      gallery: product.images.slice(2).map((src) => ({ src, alt: product.name })),
      colors: product.options.colors.map((color) => ({
        src: mainImage,
        alt: color.name,
      })),
    },
    link: {
      href: getProductDetailPath(product),
      label: 'Shop now',
    },
    botonImages: related.map((item) => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory,
      href: getProductDetailPath(item),
      image: {
        src: item.images[0] ?? '',
        alt: item.name,
      },
      title: item.name,
      price: '',
      inStock: item.inStock,
    })),
  };
}
