export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface ProductVariation {
  color: string;
  size: string;
  skuCode: string;
  extraPrice: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images?: string[];
  thumbnail?: string;
  isLocal?: boolean;
  variations?: ProductVariation[];
  isFragile?: boolean;
  hazardousDisclaimer?: boolean;
  shippingNotes?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type ProductSortOption =
  | "price_asc"
  | "price_desc"
  | "title_asc"
  | "title_desc"
  | "rating_desc";

export type ProductViewMode = "table" | "card";
