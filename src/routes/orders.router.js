import express from "express"
import {
    checkoutOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
  } from "../controllers/orders.controller.js";
  
import {requireAuth} from "../middleware/auth.middleware.js"
import {checkBlocked} from "../middleware/block.middleware.js"
const router = express.Router();

router.use(requireAuth, checkBlocked); 
router.post("/checkoutOrder", checkoutOrder);
router.get("/getMyOrder", getMyOrders);
router.get("/getOrderById/:id", getOrderById);
router.patch("/:id/cancelOder", cancelOrder);
export default router;