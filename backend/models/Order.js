import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        image: {
            type: String,
        },
    },
    { _id: false }
);


const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING",
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
        },
    },
    {
        timestamps: true,
    }
);


const Order = mongoose.model("Order", orderSchema);

export default Order;