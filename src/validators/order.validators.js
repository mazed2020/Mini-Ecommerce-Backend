import { z } from "zod";
import { objectId } from "./common.js";

// for GET /orders/:id
export const orderIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

// optional future: admin update status
export const updateStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.enum(["PENDING", "SHIPPED", "DELIVERED"]),
  }),
});
