export type {
  Product,
  ProductColorOption,
  ProductListItem,
  ProductOptions,
  ProductPrice,
} from './model/types';
export {
  normalizeProduct,
  parseProducts,
  productMatchesCatalogCategory,
  productMatchesCatalogCollection,
} from './lib/normalizeProduct';
export {
  catalogProducts,
  getCatalogProductById,
  getProductDetailPath,
  getRelatedCatalogProducts,
} from './lib/catalogProducts';
export { formatProductPrice, mapProductToCatalogCard } from './lib/mapProductToCatalogCard';
