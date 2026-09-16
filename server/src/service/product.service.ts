import { productRepository, type ListProductsParams, type CreateProductInput, type UpdateProductInput } from "../repository/product.repository";
import { ApiError } from "../util/ApiError";
import { toPublicProduct, type PublicProduct } from "../util/serializeProduct";
import type { ProductStatus } from "../models/Product.model";

export interface PaginatedProducts {
  items: PublicProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export const productService = {
  async listProducts(params: ListProductsParams): Promise<PaginatedProducts> {
    const { items, total } = await productRepository.list(params);
    return { items: items.map(toPublicProduct), total, page: params.page, pageSize: params.pageSize };
  },

  async getProduct(id: string): Promise<PublicProduct> {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound("Product not found.");
    return toPublicProduct(product);
  },

  async createProduct(input: CreateProductInput): Promise<PublicProduct> {
    const existing = await productRepository.findBySku(input.sku);
    if (existing) throw ApiError.conflict(`A product with SKU "${input.sku.toUpperCase()}" already exists.`);

    const product = await productRepository.create(input);
    return toPublicProduct(product);
  },

  async updateProduct(id: string, updates: UpdateProductInput): Promise<PublicProduct> {
    if (updates.sku) {
      const existing = await productRepository.findBySku(updates.sku);
      if (existing && existing._id.toString() !== id) {
        throw ApiError.conflict(`A product with SKU "${updates.sku.toUpperCase()}" already exists.`);
      }
    }
    const product = await productRepository.updateById(id, updates);
    if (!product) throw ApiError.notFound("Product not found.");
    return toPublicProduct(product);
  },

  async setProductStatus(id: string, status: ProductStatus): Promise<PublicProduct> {
    const product = await productRepository.updateById(id, { status });
    if (!product) throw ApiError.notFound("Product not found.");
    return toPublicProduct(product);
  },
};
