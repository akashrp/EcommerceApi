import asyncHandler from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
const SECRET = process.env.SECRET;

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).send("login to proceed");
  }
  jwt.verify(token, SECRET, (error, decode) => {
    if (error) {
      return res.status(400).send("token expired");
    } else {
      req.user = decode;
      next();
    }
  });
});
