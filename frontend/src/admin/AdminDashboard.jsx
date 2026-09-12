import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const [loading, setLoading] = useState(true);


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =====================================
    // FETCH DASHBOARD DATA
    // =====================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);


            // =============================
            // GET PRODUCTS
            // =============================

            const productResponse = await api.get(
                "/products"
            );


            const products = Array.isArray(
                productResponse.data
            )

                ? productResponse.data

                : productResponse.data.products || [];


            setTotalProducts(
                products.length
            );


            // =============================
            // GET ALL ORDERS
            // =============================

            try {

                const orderResponse = await api.get(
                    "/orders/admin/all"
                );


                const orders =
                    orderResponse.data.orders || [];


                setTotalOrders(
                    orders.length
                );

            } catch (orderError) {

                console.error(
                    "ORDER DASHBOARD ERROR:",
                    orderError
                );

                setTotalOrders(0);

            }


        } catch (error) {

            console.error(
                "DASHBOARD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // LOAD DATA
    // =====================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        localStorage.removeItem("token");

        localStorage.removeItem("user");


        navigate("/admin/login");

    };


    // =====================================
    // PAGE
    // =====================================

    return (

        <div className="admin-page">


            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <aside className="admin-sidebar">


                {/* LOGO */}

                <div className="admin-logo">

                    <span className="logo-icon">
                        🛒
                    </span>


                    <div>

                        <h2>
                            MyStore
                        </h2>


                        <span>
                            ADMIN PANEL
                        </span>

                    </div>

                </div>


                {/* ========================= */}
                {/* NAVIGATION */}
                {/* ========================= */}

                <div className="admin-menu">


                    {/* DASHBOARD */}

                    <button
                        className="admin-menu-item active"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >

                        <span>
                            📊
                        </span>

                        Dashboard

                    </button>


                    {/* PRODUCTS */}

                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >

                        <span>
                            📦
                        </span>

                        Products

                    </button>


                    {/* ADD PRODUCT */}

                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate(
                                "/admin/products/add"
                            )
                        }
                    >

                        <span>
                            ➕
                        </span>

                        Add Product

                    </button>


                    {/* MANAGE ORDERS */}

                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >

                        <span>
                            📋
                        </span>

                        Manage Orders

                    </button>


                </div>


                {/* ========================= */}
                {/* SIDEBAR BOTTOM */}
                {/* ========================= */}

                <div className="sidebar-bottom">

                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >

                        🚪 Logout

                    </button>

                </div>


            </aside>


            {/* ========================= */}
            {/* MAIN CONTENT */}
            {/* ========================= */}

            <main className="admin-main">


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="admin-header">


                    <div>

                        <p className="welcome-text">

                            Welcome back 👋

                        </p>


                        <h1>

                            Admin Dashboard

                        </h1>


                        <p className="admin-header-text">

                            Manage your products and
                            customer orders from one place.

                        </p>

                    </div>


                    {/* ADMIN USER */}

                    <div className="admin-user">


                        <div className="admin-avatar">

                            {user?.name
                                ?.charAt(0)
                                .toUpperCase()
                                || "A"}

                        </div>


                        <div>

                            <strong>

                                {user?.name ||
                                    "Admin"}

                            </strong>


                            <p>

                                👑 Administrator

                            </p>

                        </div>

                    </div>


                </div>


                {/* ========================= */}
                {/* DASHBOARD OVERVIEW */}
                {/* ========================= */}

                <section className="dashboard-overview">


                    <div className="dashboard-section-title">

                        <div>

                            <p>
                                OVERVIEW
                            </p>


                            <h2>
                                Store Overview
                            </h2>

                        </div>


                        <button
                            className="refresh-btn"
                            onClick={
                                fetchDashboardData
                            }
                        >

                            🔄 Refresh

                        </button>

                    </div>


                    {/* ========================= */}
                    {/* DASHBOARD CARDS */}
                    {/* ========================= */}

                    <div className="dashboard-cards">


                        {/* TOTAL PRODUCTS */}

                        <div className="dashboard-card">

                            <div className="card-icon">

                                📦

                            </div>


                            <div className="card-content">

                                <p>
                                    Total Products
                                </p>


                                <h2>

                                    {loading
                                        ? "..."
                                        : totalProducts}

                                </h2>


                                <span>
                                    Products in your store
                                </span>

                            </div>

                        </div>


                        {/* TOTAL ORDERS */}

                        <div className="dashboard-card">

                            <div className="card-icon">

                                📋

                            </div>


                            <div className="card-content">

                                <p>
                                    Total Orders
                                </p>


                                <h2>

                                    {loading
                                        ? "..."
                                        : totalOrders}

                                </h2>


                                <span>
                                    Customer orders received
                                </span>

                            </div>

                        </div>


                        {/* ADD PRODUCT */}

                        <div className="dashboard-card">

                            <div className="card-icon">

                                ➕

                            </div>


                            <div className="card-content">

                                <p>
                                    Quick Action
                                </p>


                                <button
                                    className="small-action-btn"
                                    onClick={() =>

                                        navigate(
                                            "/admin/products/add"
                                        )

                                    }
                                >

                                    Add Product →

                                </button>


                                <span>
                                    Add a new item
                                </span>

                            </div>

                        </div>


                        {/* MANAGE ORDERS */}

                        <div className="dashboard-card">

                            <div className="card-icon">

                                🚚

                            </div>


                            <div className="card-content">

                                <p>
                                    Order Management
                                </p>


                                <button
                                    className="small-action-btn"
                                    onClick={() =>

                                        navigate(
                                            "/admin/orders"
                                        )

                                    }
                                >

                                    View Orders →

                                </button>


                                <span>
                                    Track customer orders
                                </span>

                            </div>

                        </div>


                    </div>


                </section>


                {/* ========================= */}
                {/* QUICK ACTIONS */}
                {/* ========================= */}

                <section className="quick-section">


                    <div className="section-title">

                        <div>

                            <p className="section-label">

                                QUICK ACTIONS

                            </p>


                            <h2>

                                Manage Your Store

                            </h2>


                            <p>

                                Quickly access important
                                store management tools.

                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">


                        {/* ADD PRODUCT */}

                        <div className="quick-card">


                            <div className="quick-icon">

                                ➕

                            </div>


                            <h3>

                                Add New Product

                            </h3>


                            <p>

                                Add new products
                                to your online store.

                            </p>


                            <button
                                onClick={() =>

                                    navigate(
                                        "/admin/products/add"
                                    )

                                }
                            >

                                Add Product →

                            </button>


                        </div>


                        {/* MANAGE PRODUCTS */}

                        <div className="quick-card">


                            <div className="quick-icon">

                                📦

                            </div>


                            <h3>

                                Manage Products

                            </h3>


                            <p>

                                View, edit or delete
                                your store products.

                            </p>


                            <button
                                onClick={() =>

                                    navigate(
                                        "/admin/products"
                                    )

                                }
                            >

                                Manage Products →

                            </button>


                        </div>


                        {/* MANAGE ORDERS */}

                        <div className="quick-card">


                            <div className="quick-icon">

                                📋

                            </div>


                            <h3>

                                Customer Orders

                            </h3>


                            <p>

                                View all customer orders
                                and update order status.

                            </p>


                            <button
                                onClick={() =>

                                    navigate(
                                        "/admin/orders"
                                    )

                                }
                            >

                                Manage Orders →

                            </button>


                        </div>


                    </div>


                </section>


                {/* ========================= */}
                {/* STORE SUMMARY */}
                {/* ========================= */}

                <section className="store-summary">


                    <div className="store-summary-header">

                        <div>

                            <p className="section-label">

                                STORE SUMMARY

                            </p>


                            <h2>

                                Your Store at a Glance

                            </h2>

                        </div>

                    </div>


                    <div className="summary-grid">


                        {/* PRODUCTS */}

                        <div className="summary-box">


                            <div className="summary-icon">

                                📦

                            </div>


                            <div>

                                <h3>

                                    {loading
                                        ? "..."
                                        : totalProducts}

                                </h3>


                                <p>

                                    Products Available

                                </p>

                            </div>


                            <button
                                onClick={() =>

                                    navigate(
                                        "/admin/products"
                                    )

                                }
                            >

                                View →

                            </button>


                        </div>


                        {/* ORDERS */}

                        <div className="summary-box">


                            <div className="summary-icon">

                                📋

                            </div>


                            <div>

                                <h3>

                                    {loading
                                        ? "..."
                                        : totalOrders}

                                </h3>


                                <p>

                                    Customer Orders

                                </p>

                            </div>


                            <button
                                onClick={() =>

                                    navigate(
                                        "/admin/orders"
                                    )

                                }
                            >

                                View →

                            </button>


                        </div>


                    </div>


                </section>


            </main>


        </div>

    );

}

