import express from "express"
import {getAllProducts,getProductById ,createProduct,updateProduct,deleteProduct}from "../controllers/products.controllers.js"
import {requireAuth} from "../middleware/auth.middleware.js"
import {requireRole} from "../middleware/role.middleware.js"
const router =express.Router();


//public api 
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);

// only for admin
router.post("/createProduct", requireAuth, requireRole("admin"), createProduct);
router.put("/updateProductById/:id", requireAuth, requireRole("admin"), updateProduct);
router.delete("/deleteProductById/:id", requireAuth, requireRole("admin"), deleteProduct);

export default router;