import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,    
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      index: true,
    },

    refreshToken: {
      type: String,
    },

    // --- Fraud / cancellation protection ---
    blockedUntil: {
      type: Date,
      default: null,
    },

    cancelCount24h: {
      type: Number,
      default: 0,
    },

    cancelCount7d: {
      type: Number,
      default: 0,
    },

    lastCancelAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }    
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        userName: this.userName,
        email: this.email,
        role: this.role,
      },
      process.env.SECRETE_KEY,
      {
        expiresIn: process.env.EXPIERY_KEY,
      }
    );
  };

  UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRE,
      {
        expiresIn: process.env.REFRESH_EXPIERE,
      }
    );
  };

  UserSchema.methods.isBlocked = function () {
    return this.blockedUntil && this.blockedUntil > new Date();
  };

  export const User = mongoose.models.User || mongoose.model("User", UserSchema);
