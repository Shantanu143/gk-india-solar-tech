import { z } from "zod";

export const projectTypeSchema = z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"]);
