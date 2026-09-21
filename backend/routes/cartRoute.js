import express from "express";
import { getCart, saveCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.get("/", authMiddleware, getCart);
cartRouter.put("/", authMiddleware, saveCart);

export default cartRouter;