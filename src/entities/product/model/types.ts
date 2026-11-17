import type { CatalogCategory } from '@/features/catalog/model/catalogCategory';

export type ProductPrice = {
  amount: number;
  currency: string;
};

export type ProductColorOption = {
  name: string;
  hex: string;
};

export type ProductOptions = {
  colors: ProductColorOption[];
  sizes: string[];
};

/** Canonical product shape. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CatalogCategory;
  subcategory: string;
  type: string;
  description: string;
  price: ProductPrice;
  images: string[];
  options: ProductOptions;
  inStock: boolean;
};

export type ProductListItem = Pick<
  Product,
  'id' | 'slug' | 'name' | 'category' | 'subcategory' | 'type' | 'price' | 'images' | 'inStock'
> & {
  previewImage: string;
};
