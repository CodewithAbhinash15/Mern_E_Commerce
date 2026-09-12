import express from "express";

import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// =================================
// USER - GET MY ORDERS
// =================================

router.get("/", protect, getMyOrders);


// =================================
// USER - CREATE ORDER
// =================================

router.post("/", protect, createOrder);


// =================================
// ADMIN - GET ALL ORDERS
// =================================

router.get("/admin/all", protect, getAllOrders);


// =================================
// ADMIN - UPDATE ORDER STATUS
// =================================

router.put(
    "/admin/:id/status",
    protect,
    updateOrderStatus
);


export default router;

