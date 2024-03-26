import express from "express"
import { auth } from "../Middleware/authMiddleware.js"
import { addCategoery, editCategoery, getAllCategoeries } from "../Controllers/categoeryController.js"

const Router=express.Router()

Router.post("/addCategoery",auth,addCategoery)
Router.post("/editCategoery",auth,editCategoery)
Router.get("/getAllCategoeries",auth,getAllCategoeries);

export default Router