type ProductHrefSource = {
  id: string | number;
  slug?: string | null;
};

export function getProductUrlKey(product: ProductHrefSource): string {
  const slug = product.slug?.trim();
  return slug || String(product.id);
}

export function buildProductHref(category: string, product: ProductHrefSource): string {
  return `/catalog/${category}/${getProductUrlKey(product)}`;
}
