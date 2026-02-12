import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: { type: String, required: true },  
    price: { type: Number, required: true }, 
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least 1 item"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "COMPLETED"],
      default: "PENDING",
      index: true,
    },

    cancelledAt: { type: Date, default: null },
    cancelReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
