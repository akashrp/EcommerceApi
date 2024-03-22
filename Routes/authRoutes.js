import express from "express"
import {addUser} from "../Controllers/authController.js";

const router = express.Router();

router.post("/addUers",addUser);

export default router