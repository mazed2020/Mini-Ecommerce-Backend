import mongoose from "mongoose";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js"; 

import ApiResponse from "../utils/apiRespose.js";
import ApiError from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * POST /api/v1/orders/checkout
 * Body:
 * {
 *   "items": [
 *     { "productId": "...", "quantity": 2 },
 *     { "productId": "...", "quantity": 1 }
 *   ]
 * }
 *
 * This RESERVES stock (decrements stock).
 */
export const checkoutOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "items array is required");
  }

  // Validate input
  for (const it of items) {
    if (!it.productId || !mongoose.Types.ObjectId.isValid(it.productId)) {
      throw new ApiError(400, "Invalid productId in items");
    }
    if (!it.quantity || Number(it.quantity) < 1) {
      throw new ApiError(400, "quantity must be >= 1");
    }
  }

  // Reserve stock one by one
  const reserved = []; // to rollback if failure
  const orderItems = [];
  let totalAmount = 0;

  try {
    for (const it of items) {
      const qty = Number(it.quantity);

      // Reserve stock atomically
      const product = await Product.findOneAndUpdate(
        { _id: it.productId, isActive: true, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!product) {
        throw new ApiError(400, `Insufficient stock or product not found: ${it.productId}`);
      }

      reserved.push({ productId: product._id, qty });

      const price = Number(product.price);
      const lineTotal = price * qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: qty,
        lineTotal,
      });

      totalAmount += lineTotal;
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      status: "PENDING",
    });

    res.status(201).json(new ApiResponse(order, "Order placed (stock reserved)"));
  } catch (err) {
    // Manual rollback: restore reserved stock
    for (const r of reserved) {
      await Product.findByIdAndUpdate(r.productId, { $inc: { stock: r.qty } });
    }
    throw err;
  }
});


/**
 * GET /api/v1/orders/myOrders
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(orders, "My orders"));
});

/**
 * GET /api/v1/orders/orderById/:id
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.findById(id);

  if (!order) throw new ApiError(404, "Order not found");

  // user can see only own order (unless you add admin later)
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  res.status(200).json(new ApiResponse(order, "Order"));
});

/**
 * PATCH /api/v1/orders/cancel/:id
 * Cancels order + restores stock + increases cancellation counters + blocks if abuse.
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  if (order.status === "CANCELLED") {
    const user = await User.findById(req.user._id);
    return res.status(200).json(
      new ApiResponse(
        {
          order,
          cancelCount24h: user?.cancelCount24h ?? 0,
          cancelCount7d: user?.cancelCount7d ?? 0,
          blockedUntil: user?.blockedUntil ?? null,
        },
        "Order already cancelled"
      )
    );
  }

  if (order.status !== "PENDING") {
    throw new ApiError(400, `Cannot cancel order in status: ${order.status}`);
  }

  // ✅ restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  // ✅ update order
  order.status = "CANCELLED";
  order.cancelledAt = new Date();
  order.cancelReason = "User cancelled";
  await order.save();

  // ✅ Fraud tracking on user
  const user = await User.findById(req.user._id);
  const now = new Date();

  // reset counters if window passed
  if (!user.lastCancelAt || now - user.lastCancelAt > 24 * 60 * 60 * 1000) {
    user.cancelCount24h = 0;
  }
  if (!user.lastCancelAt || now - user.lastCancelAt > 7 * 24 * 60 * 60 * 1000) {
    user.cancelCount7d = 0;
  }

  user.cancelCount24h += 1;
  user.cancelCount7d += 1;
  user.lastCancelAt = now;

  // block rules
  if (user.cancelCount24h >= 3) {
    user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  } else if (user.cancelCount7d >= 5) {
    user.blockedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7d
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      {
        order,
        cancelCount24h: user.cancelCount24h,
        cancelCount7d: user.cancelCount7d,
        blockedUntil: user.blockedUntil,
      },
      "Order cancelled (stock restored)"
    )
  );
});
