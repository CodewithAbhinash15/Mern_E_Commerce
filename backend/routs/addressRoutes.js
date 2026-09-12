import express from "express";

import {
    saveAddress,
    getMyAddresses,
    updateAddress,
    deleteAddress,
} from "../controllers/addressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================
// SAVE ADDRESS
// ==========================

router.post("/", protect, saveAddress);


// ==========================
// GET MY ADDRESSES
// ==========================

router.get("/", protect, getMyAddresses);


// ==========================
// UPDATE ADDRESS
// ==========================

router.put("/:id", protect, updateAddress);


// ==========================
// DELETE ADDRESS
// ==========================

router.delete("/:id", protect, deleteAddress);


export default router;