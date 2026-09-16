import { productService } from "../service/product.service";
import { asyncHandler } from "../util/asyncHandler";
import { listProductsQuerySchema } from "../validation/product.validation";

export const productController = {
  list: asyncHandler(async (req, res) => {
    const query = listProductsQuerySchema.parse(req.query);
    const result = await productService.listProducts(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const product = await productService.getProduct(req.params.id);
    res.json({ product });
  }),

  create: asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ product });
  }),

  update: asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ product });
  }),

  setStatus: asyncHandler(async (req, res) => {
    const product = await productService.setProductStatus(req.params.id, req.body.status);
    res.json({ product });
  }),
};
