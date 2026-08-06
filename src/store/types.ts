export interface Category {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_hidden: boolean;
}

export interface CategoryCreateInput {
  slug: string;
  name: string;
  is_active: boolean;
  is_hidden: boolean;
}

export interface CategoryUpdateInput {
  slug?: string;
  name?: string;
  is_active?: boolean;
  is_hidden?: boolean;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface LoginInput {
  email_or_phone: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  email: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

export interface PasswordChangeInput {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  code: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileUser {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Profile {
  id: number;
  user: ProfileUser;
  first_name: string;
  last_name: string;
  surname: string;
  gender: number;
  clothing_size: number;
  shoe_size: number;
  birthday: string;
  phone: string;
}

export interface ProfileUpdateInput {
  first_name?: string;
  last_name?: string;
  surname?: string;
  gender?: number;
  clothing_size?: number;
  shoe_size?: number;
  birthday?: string;
  phone?: string;
}

export interface ActivationCodeInput {
  code: string;
  email: string;
}

export interface ResendActivationInput {
  email: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface WishlistItem {
  productId: number;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductPrice {
  current: number;
  currency: string;
}

export interface ProductLink {
  href: string;
  label: string;
}

export interface RelatedProductCard {
  id: string;
  image: ProductImage;
  title: string;
  price: string;
}

export interface ProductCardData {
  id: number;
  brand: string;
  title: string;
  description: string[];
  price: ProductPrice;
  code: string;
  rating: number;
  size: string[];
  images: {
    main: {
      front: ProductImage;
      back: ProductImage;
    };
    gallery: ProductImage[];
    colors: ProductImage[];
  };
  link: ProductLink;
  botonImages: RelatedProductCard[];
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  brand: number;
  subcategory: number;
  is_active: boolean;
  is_hidden: boolean;
}

export interface ApiProductVariant {
  id: number;
  product: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  gender: string;
  is_active: boolean;
}

export interface ApiProductImage {
  id: number;
  product_variant: number;
  image: string;
  is_main: boolean;
  sort_order: number;
}

export interface ApiBrand {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_hidden: boolean;
}

export interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_hidden: boolean;
}

export interface ApiSubcategory {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_hidden: boolean;
  category: number;
}
