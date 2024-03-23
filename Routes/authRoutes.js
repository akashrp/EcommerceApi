import express from "express"
import {login, VerifyUser, addUser, logout} from "../Controllers/authController.js";

const router = express.Router();

router.post("/addUers",addUser);
router.get("/verifyAccount",VerifyUser);
router.post("/login",login)
router.get("/logout",logout)
export default router