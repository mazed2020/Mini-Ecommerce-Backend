
 import ApiResponse from "../utils/apiRespose.js";
import ApiError from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

/**
 * REGISTER USER
 * POST /api/v1/users/register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, role } = req.validated.body;

  // Check duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  // For assignment safety – don’t allow public admin creation
  const safeRole =
   role === "admin"?"admin":"customer"
  
  const user = await User.create({
    userName,
    email,
    password,
    role: safeRole,
  });

  const token = user.generateAccessToken();

  const safeUser = await User.findById(user._id);

  res.status(201).json(
    new ApiResponse(
      {
        user: safeUser,
        accessToken: token,
      },
      "User registered successfully"
    )
  );
});

/**
 * LOGIN USER
 * POST /api/v1/users/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Account active check
  if (!user.isActive) {
    throw new ApiError(403, "Account is disabled");
  }

  // Fraud block check
  if (user.isBlocked && user.isBlocked()) {
    throw new ApiError(
      403,
      `Account blocked until ${user.blockedUntil.toISOString()}`
    );
  }

  const isCorrect = await user.isPasswordCorrect(password);
  if (!isCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateAccessToken();

  const safeUser = await User.findById(user._id);

  res.status(200).json(
    new ApiResponse(
      {
        user: safeUser,
        accessToken: token,
      },
      "Login successful"
    )
  );
});
