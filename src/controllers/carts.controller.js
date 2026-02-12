import mongoose from "mongoose";
import { Cart } from "../models/carts.model.js";
import { Product } from "../models/product.models.js";

import ApiResponse from "../utils/apiRespose.js";
import ApiError from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*
-----------------------------------------
GET CART
-----------------------------------------
*/
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart) {
    return res.status(200).json(
      new ApiResponse({ items: [], totalItems: 0, totalAmount: 0 }, "Cart is empty")
    );
  }

  return res.status(200).json(new ApiResponse(cart, "Cart fetched"));
});

/*
-----------------------------------------
ADD TO CART
Body:
{
  "productId": "...",
  "quantity": 2
}
-----------------------------------------
*/
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const qty = Number(quantity) || 1;

  if (qty < 1) throw new ApiError(400, "Quantity must be at least 1");

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < qty) {
    throw new ApiError(400, "Insufficient stock");
  }

  // find or create cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + qty;

    if (newQty > product.stock) {
      throw new ApiError(400, "Quantity exceeds available stock");
    }

    existingItem.quantity = newQty;
    existingItem.lineTotal = newQty * product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: qty,
      name: product.name,
      price: product.price,
      lineTotal: qty * product.price,
    });
  }

  cart.recalculateTotals();
  await cart.save();

  return res.status(200).json(new ApiResponse(cart, "Product added to cart"));
});

/*
-----------------------------------------
REMOVE PRODUCT FROM CART
-----------------------------------------
*/
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.recalculateTotals();
  await cart.save();

  return res.status(200).json(new ApiResponse(cart, "Item removed from cart"));
});

/*
-----------------------------------------
CLEAR CART
-----------------------------------------
*/
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json(
      new ApiResponse({ items: [], totalItems: 0, totalAmount: 0 }, "Cart already empty")
    );
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;

  await cart.save();

  return res.status(200).json(
    new ApiResponse(cart, "Cart cleared successfully")
  );
});
