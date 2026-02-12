import { z } from "zod";
import { objectId } from "./common.js";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    description: z.string().max(2000).optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(2000).optional(),
    price: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});
