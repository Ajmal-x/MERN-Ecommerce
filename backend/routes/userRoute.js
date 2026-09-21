import express from "express";

import {
  loginUser,
  registerUser,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/userController.js";

import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Admin login
userRouter.post("/admin", loginAdmin);

// Admin profile
userRouter.get(
  "/admin/profile",
  adminAuth,
  getAdminProfile
);

userRouter.put(
  "/admin/profile",
  adminAuth,
  updateAdminProfile
);

// Admin password
userRouter.put(
  "/admin/password",
  adminAuth,
  changeAdminPassword
);

export default userRouter;