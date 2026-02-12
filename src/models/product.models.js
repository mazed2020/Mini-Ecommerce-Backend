import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description too long"],
      default: ""
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

     
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

 
ProductSchema.index({ name: "text", description: "text" });

// Helper method – safe stock check
ProductSchema.methods.hasStock = function (qty) {
  return this.stock >= qty;
};

// Prevent model overwrite in dev reloads
export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
