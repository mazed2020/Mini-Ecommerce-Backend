import { z } from "zod";
import { objectId } from "./common.js";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: objectId,
    quantity: z.number().int().min(1, "Minimum quantity is 1"),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: objectId,
  }),
});
