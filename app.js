import 'dotenv/config'
import {Connect} from "./Config/dbConnect.js"
import express from 'express'
import cookieParser from "cookie-parser";
import authRouter from "./Routes/authRoutes.js"
import categoeryRouter from "./Routes/categoeryRoutes.js"
Connect()
const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/",authRouter);
app.use("/categoery",categoeryRouter)
export default app