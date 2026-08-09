import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';
import type { ProductColorOption } from '@/entities/product/model/types';

export type CatalogProduct = {
  id: string;
  title: string;
  price: string;
  image: {
    src: string;
    alt: string;
  };
  href: string;
  slug?: string;
  description: string;
  category?: CatalogCategory;
  subcategory?: string;
  type?: string;
  inStock?: boolean;
  sizes?: string[];
  colors?: ProductColorOption[];
  brandId?: number;
  brandName?: string;
  subcategoryId?: number;
  colorIds?: number[];
  sizeIds?: number[];
  priceValue?: number;
};
