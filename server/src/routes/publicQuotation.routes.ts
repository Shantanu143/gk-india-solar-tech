import { Router } from "express";
import rateLimit from "express-rate-limit";
import { quotationController } from "../controller/quotation.controller";

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });

router.get("/quotations/:token/pdf", limiter, quotationController.publicPdf);

export default router;
