import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
  // Comma-separated list, e.g. "https://gk-india-solar-tech.vercel.app,https://gkindiasolartech.com"
  CLIENT_ORIGIN: z.string().min(1, "CLIENT_ORIGIN is required."),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required."),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  CLIENT_ORIGINS: parsed.CLIENT_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
