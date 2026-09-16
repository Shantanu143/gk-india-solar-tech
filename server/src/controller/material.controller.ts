import { materialService } from "../service/material.service";
import { asyncHandler } from "../util/asyncHandler";
import { listMaterialsQuerySchema } from "../validation/material.validation";

export const materialController = {
  list: asyncHandler(async (req, res) => {
    const query = listMaterialsQuerySchema.parse(req.query);
    const result = await materialService.listMaterials(query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const material = await materialService.getMaterial(req.params.id);
    res.json({ material });
  }),

  create: asyncHandler(async (req, res) => {
    const material = await materialService.createMaterial(req.body);
    res.status(201).json({ material });
  }),

  update: asyncHandler(async (req, res) => {
    const material = await materialService.updateMaterial(req.params.id, req.body);
    res.json({ material });
  }),

  setStatus: asyncHandler(async (req, res) => {
    const material = await materialService.setMaterialStatus(req.params.id, req.body.status);
    res.json({ material });
  }),

  transactions: asyncHandler(async (req, res) => {
    const transactions = await materialService.getTransactionsForMaterial(req.params.id);
    res.json(transactions);
  }),

  recordTransaction: asyncHandler(async (req, res) => {
    const material = await materialService.recordTransaction({ materialId: req.params.id, ...req.body, createdBy: req.user!.name });
    res.status(201).json({ material });
  }),
};
