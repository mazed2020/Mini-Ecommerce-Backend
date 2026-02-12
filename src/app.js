import express from "express"
import cookiesParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.router.js"
import productRouter from "./routes/products.router.js"
import cardRouter from "./routes/cards.router.js"
import orderRoutes from "./routes/orders.router.js"


const app=express();
//checking for cors origin basic set up

/*+++++++++++++++basic configaration start here+++++++++++++++++ */
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));
//json body limit accept
app.use(express.json({limit:'16kb'}));
// request for url
app.use(express.urlencoded({
    extended:true,
    limit:'16kb',
}));
//uploaded file will be store the folder
app.use(express.static("public"));
app.use(cookiesParser());
/*+++++++++++++++basic configaration end here+++++++++++++++ */
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/carts",cardRouter);
app.use("/api/v1/orders",orderRoutes)
//http://localhost:5000/api/v1/users/register
export default app;