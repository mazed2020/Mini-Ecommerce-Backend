import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import ApiResponse from "../utils/apiRespose.js";
import ApiError from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /getAllProducts
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(products, "Products fetched successfully")
  );
});

// GET /getProductById/:id
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    new ApiResponse(product, "Product fetched successfully")
  );
});

// POST /createProduct  (Admin)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    throw new ApiError(400, "name, price and stock are required");
  }

  if (Number(price) < 0) {
    throw new ApiError(400, "price cannot be negative");
  }

  if (Number(stock) < 0) {
    throw new ApiError(400, "stock cannot be negative");
  }

  const product = await Product.create({
    name,
    description: description || "",
    price: Number(price),
    stock: Number(stock),
  });

  res.status(201).json(
    new ApiResponse(product, "Product created successfully")
  );
});

// PUT /updateProductById/:id  (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }

  const updateData = { ...req.body };

  if (updateData.price !== undefined && Number(updateData.price) < 0) {
    throw new ApiError(400, "price cannot be negative");
  }

  if (updateData.stock !== undefined && Number(updateData.stock) < 0) {
    throw new ApiError(400, "stock cannot be negative");
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    new ApiResponse(product, "Product updated successfully")
  );
});

// DELETE /deleteProductById/:id  (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    new ApiResponse(null, "Product deleted successfully")
  );
});
