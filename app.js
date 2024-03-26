import 'dotenv/config'
import {Connect} from "./Config/dbConnect.js"
import express from 'express'
import cookieParser from "cookie-parser";
import authRouter from "./Routes/authRoutes.js"
import categoeryRouter from "./Routes/categoeryRoutes.js"
import productRouter from "./Routes/productRoutes.js"
Connect()
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/",authRouter);
app.use("/categoery",categoeryRouter)
app.use("/product",productRouter)
export default app