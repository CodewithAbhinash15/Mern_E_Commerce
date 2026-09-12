import express from "express";

import {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart,
} from "../controllers/CartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==============================
// ADD PRODUCT TO CART
// Login required 🔒
// ==============================
router.post("/add", protect, addToCart);


// ==============================
// GET LOGGED-IN USER CART
// Login required 🔒
// ==============================
router.get("/", protect, getCart);


// ==============================
// UPDATE CART QUANTITY
// Login required 🔒
// ==============================
router.put(
    "/update-quantity",
    protect,
    updateQuantity
);


// ==============================
// REMOVE PRODUCT FROM CART
// Login required 🔒
// ==============================
router.delete(
    "/remove",
    protect,
    removeFromCart
);


export default router;

