import express from "express";

import {
    CreateProduct,
    getProducts,
    getMyProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==============================
// GET ALL PRODUCTS
// Anyone can see products
// ==============================
router.get("/", getProducts);


// ==============================
// ADD PRODUCT
// Login required 🔒
// ==============================
router.post("/add", protect, CreateProduct);


// ==============================
// MY PRODUCTS
// Login required 🔒
// ==============================
router.get("/my-products", protect, getMyProducts);


// ==============================
// UPDATE PRODUCT
// ==============================
router.put("/update/:id", updateProduct);


// ==============================
// DELETE PRODUCT
// ==============================
router.delete("/delete/:id", deleteProduct);


export default router;

