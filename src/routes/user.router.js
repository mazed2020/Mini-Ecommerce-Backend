import  express  from "express";
const router=express.Router();
import { registerUser,loginUser } from "../controllers/user.controllers.js";
import { validate } from "../validators/common.validators.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
    

export default router;