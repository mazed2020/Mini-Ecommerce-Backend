import { z } from "zod";

// Mongo ObjectId check
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Generic validate middleware
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  req.validated = result.data;
  next();
};
