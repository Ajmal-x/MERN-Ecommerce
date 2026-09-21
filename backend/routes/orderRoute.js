import express from "express";

import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// User
orderRouter.post("/", authMiddleware, placeOrder);
orderRouter.get("/", authMiddleware, getUserOrders);

// Admin
orderRouter.get("/admin", adminAuth, getAllOrders);
orderRouter.put(
  "/admin/:id",
  adminAuth,
  updateOrderStatus
);

export default orderRouter;