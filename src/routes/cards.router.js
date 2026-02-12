import express from "express"
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
  } from "../controllers/carts.controller.js";
  import { requireAuth } from "../middleware/auth.middleware.js";
  import { checkBlocked } from "../middleware/block.middleware.js";
const router = express.Router();
router.use(requireAuth, checkBlocked);
router.get("/getAllCardItems", getCart);

 
router.post("/addToCardItems", addToCart);

 
router.delete("/deleteItemsByProductId/:productId", removeFromCart);

 
router.delete("/clearCart", clearCart);

export default router;