import express from "express"
import { auth } from "../Middleware/authMiddleware.js"
import { addProduct, addRating, addStock, editProduct, getAllProduct, getmyProduct } from "../Controllers/productController.js"

const Router= express.Router()

Router.get("/getAllProducts",auth,getAllProduct);
Router.get("/getMyProduct",auth,getmyProduct)
Router.post("/addProduct",auth,addProduct);
Router.post("/editProduct",auth,editProduct);
Router.post("/addRating",auth,addRating);
Router.post("/updateStock",auth,addStock);

export default Router;