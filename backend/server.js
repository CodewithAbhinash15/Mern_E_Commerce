
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routs/authRoutes.js";
import productRoutes from "./routs/productsRouts.js";
import cartRoutes from "./routs/CartRouts.js";
import addressRoutes from "./routs/addressRoutes.js";
import orderRoutes from "./routs/orderRoutes.js";


// LOAD ENVIRONMENT VARIABLES


dotenv.config();


// CHECK ENVIRONMENT VARIABLES


console.log("EMAIL_USER loaded:", process.env.EMAIL_USER ? "YES" : "NO");
console.log("EMAIL_PASS loaded:", process.env.EMAIL_PASS ? "YES" : "NO");
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES" : "NO");
console.log("MONGO_URI loaded:", process.env.MONGO_URI ? "YES" : "NO");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("<h1>Server is running successfully 🚀</h1>");
});

// ==========================================
// API TEST ROUTE
// ==========================================

app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working successfully",
    });
});

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// ==========================================
// SERVER PORT
// ==========================================

const PORT = process.env.PORT || 3200;

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log("");
    console.log("==============================");
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("==============================");
    console.log("");
});
