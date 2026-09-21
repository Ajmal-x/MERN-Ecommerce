import express from "express";

import {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Add Product
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Remove Product
productRouter.post(
  "/remove",
  adminAuth,
  removeProduct
);

// Update Product
productRouter.put(
  "/update/:id",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

// Get Single Product
productRouter.post(
  "/single",
  getSingleProduct
);

// Get All Products
productRouter.get(
  "/list",
  listProducts
);

export default productRouter;