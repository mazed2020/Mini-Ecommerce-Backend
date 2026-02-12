import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

     
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// helper: recalculate totals
CartSchema.methods.recalculateTotals = function () {
  this.totalItems = this.items.reduce((sum, i) => sum + i.quantity, 0);
  this.totalAmount = this.items.reduce((sum, i) => sum + i.lineTotal, 0);
};

// Prevent OverwriteModelError
export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
