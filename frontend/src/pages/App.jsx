import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ProductDetails from "./product_details";
import Profile from "./Profile";

import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import Orders from "./Orders";

import AdminRoute from "./AdminRoute";

import ProductList from "../admin/Productlist";
import Addproduct from "../admin/Addproduct";
import EditProduct from "../admin/Editproduct";
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import AdminOrders from "../admin/AdminOrders";

import VerifyOTP from "../components/VerifyOTP";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";


function App() {

    return (

        <Routes>


            {/* ========================= */}
            {/* USER ROUTES */}
            {/* ========================= */}

            <Route
                path="/"
                element={<Home />}
            />


            <Route
                path="/login"
                element={<Login />}
            />


            <Route
                path="/signup"
                element={<Signup />}
            />


            {/* ========================= */}
            {/* EMAIL OTP VERIFICATION */}
            {/* ========================= */}

            <Route
                path="/verify-otp"
                element={<VerifyOTP />}
            />


            <Route
                path="/profile"
                element={<Profile />}
            />


            <Route
                path="/product-details"
                element={<ProductDetails />}
            />


            <Route
                path="/cart"
                element={<Cart />}
            />


            <Route
                path="/checkout"
                element={<Checkout />}
            />


            <Route
                path="/order-success"
                element={<OrderSuccess />}
            />


            <Route
                path="/orders"
                element={<Orders />}
            />


            {/* ========================= */}
            {/* ADMIN LOGIN */}
            {/* ========================= */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />


            {/* ========================= */}
            {/* ADMIN DASHBOARD */}
            {/* ========================= */}

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />


            {/* ========================= */}
            {/* ADMIN PRODUCTS */}
            {/* ========================= */}

            <Route
                path="/admin/products"
                element={
                    <AdminRoute>
                        <ProductList />
                    </AdminRoute>
                }
            />


            {/* ========================= */}
            {/* ADD PRODUCT */}
            {/* ========================= */}

            <Route
                path="/admin/products/add"
                element={
                    <AdminRoute>
                        <Addproduct />
                    </AdminRoute>
                }
            />


            {/* ========================= */}
            {/* EDIT PRODUCT */}
            {/* ========================= */}

            <Route
                path="/admin/products/edit/:id"
                element={
                    <AdminRoute>
                        <EditProduct />
                    </AdminRoute>
                }
            />


            {/* ========================= */}
            {/* ADMIN ORDERS */}
            {/* ========================= */}

            <Route
                path="/admin/orders"
                element={
                    <AdminRoute>
                        <AdminOrders />
                    </AdminRoute>
                }
            />


            {/* ========================= */}
            {/* 404 PAGE */}
            {/* ========================= */}

            <Route
                path="*"
                element={
                    <div
                        style={{
                            textAlign: "center",
                            padding: "50px",
                        }}
                    >
                        <h1>
                            404 - Page Not Found
                        </h1>
                    </div>
                }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />


        </Routes>

    );

}


export default App;

