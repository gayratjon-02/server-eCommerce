import { ProductCollection, ProductStatus } from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume: number;
  productDesc?: string;
  productLikes?: number;
  productSoldCount: number;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productImages?: string[];
  productViews?: number;
}

export interface ProductUpdateInput {
  _id: string;

  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice: number;
  productLeftCount?: number;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
