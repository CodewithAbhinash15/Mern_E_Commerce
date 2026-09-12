import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";

// ===================================
// CREATE ORDER / CHECKOUT
// ===================================

export const createOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;

        // =========================
        // VALIDATE ADDRESS
        // =========================

        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id,
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found",
            });
        }

        // =========================
        // GET USER CART
        // =========================

        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        // =========================
        // CREATE ORDER ITEMS
        // =========================

        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
        }));

        // =========================
        // CALCULATE TOTAL
        // =========================

        const totalAmount = orderItems.reduce(
            (total, item) => {
                return total + item.price * item.quantity;
            },
            0
        );

        // =========================
        // CREATE ORDER
        // =========================

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            address: address._id,
            totalAmount,
            paymentMethod: paymentMethod || "COD",
        });

        // =========================
        // CLEAR CART
        // =========================

        cart.items = [];

        await cart.save();

        // =========================
        // RESPONSE
        // =========================

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to place order",
            error: error.message,
        });
    }
};


// ===================================
// GET MY ORDERS
// ===================================

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        })
            .populate("address")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            orders,
        });

    } catch (error) {
        console.log("ORDER ERROR:", error);

        res.status(500).json({
            message: "Failed to get orders",
            error: error.message,
        });
    }
};


// ===================================
// ADMIN - GET ALL USERS ORDERS
// ===================================

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("address")
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All orders fetched successfully",
            totalOrders: orders.length,
            orders,
        });

    } catch (error) {
        console.log("GET ALL ORDERS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch all orders",
            error: error.message,
        });
    }
};


// ===================================
// ADMIN - UPDATE ORDER STATUS
// ===================================

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = [
            "PLACED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus: status,
            },
            {
                new: true,
            }
        )
            .populate("user", "name email")
            .populate("address")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.log("UPDATE ORDER STATUS ERROR:", error);

        res.status(500).json({
            message: "Failed to update order status",
            error: error.message,
        });
    }
};

