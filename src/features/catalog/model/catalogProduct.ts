import type {
  CatalogListingSlug,
  CatalogProductGroup,
} from '@/features/catalog/model/catalogCategory';
import type { ProductColorOption } from '@/entities/product/model/types';
import type { ProductVariantGender } from '@/store/types';

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
  category?: CatalogListingSlug;
  subcategory?: string;
  type?: string;
  group?: CatalogProductGroup;
  genders?: ProductVariantGender[];
  stockTotal?: number;
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
