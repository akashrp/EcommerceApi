import express from "express"
import {VerifyUser, addUser} from "../Controllers/authController.js";

const router = express.Router();

router.post("/addUers",addUser);
router.get("/verifyAccount",VerifyUser);

export default router