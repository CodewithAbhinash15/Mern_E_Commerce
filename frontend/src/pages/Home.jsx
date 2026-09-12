import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Signup.css";

export default function Home() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Logged-in user
    const [user, setUser] = useState(null);

    // Search and filter
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // ==============================
    // LOAD LOGGED-IN USER
    // ==============================

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("USER PARSE ERROR:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // ==============================
    // FETCH ALL PRODUCTS
    // ==============================

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            console.log("PRODUCT RESPONSE:", response.data);

            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else if (response.data.products) {
                setProducts(response.data.products);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("PRODUCT FETCH ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load products"
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // LOAD PRODUCTS
    // ==============================

    useEffect(() => {
        fetchProducts();
    }, []);

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        navigate("/");
    };

    // ==============================
    // ADD PRODUCT TO CART
    // ==============================

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first to add products to cart.");
            navigate("/login");
            return;
        }

        try {
            const response = await api.post(
                "/cart/add",
                {
                    productId: productId,
                    quantity: 1,
                }
            );

            console.log(
                "CART RESPONSE:",
                response.data
            );

            alert(
                response.data.message ||
                "Product added to cart successfully"
            );
        } catch (error) {
            console.error(
                "ADD TO CART ERROR:",
                error
            );

            if (error.response?.status === 401) {
                alert(
                    error.response?.data?.message ||
                    "Please login first"
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);

                navigate("/login");

                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };

    // ==============================
    // GET CATEGORIES
    // ==============================

    const categories = useMemo(() => {
        const allCategories = products
            .map((product) => product.category)
            .filter(Boolean);

        return ["All", ...new Set(allCategories)];
    }, [products]);

    // ==============================
    // FILTER PRODUCTS
    // ==============================

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const productName =
                product.name?.toLowerCase() || "";

            const productCategory =
                product.category?.toLowerCase() || "";

            const productType =
                product.type?.toLowerCase() || "";

            const searchText = search.toLowerCase();

            const matchesSearch =
                productName.includes(searchText) ||
                productCategory.includes(searchText) ||
                productType.includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    // ==============================
    // SCROLL TO PRODUCTS
    // ==============================

    const scrollToProducts = () => {
        document
            .getElementById("products")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    // ==============================
    // SELECT CATEGORY
    // ==============================

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);

        setTimeout(() => {
            scrollToProducts();
        }, 100);
    };

    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="home-navbar">

                <div className="home-navbar-inner">

                    {/* LOGO */}

                    <div
                        className="home-logo"
                        onClick={() => navigate("/")}
                    >
                        <span className="logo-icon">
                            🛍️
                        </span>

                        MyStore
                    </div>


                    {/* NAVIGATION LINKS */}

                    <div className="home-desktop-links">

                        <button
                            onClick={() => navigate("/")}
                        >
                            Home
                        </button>

                        <button
                            onClick={scrollToProducts}
                        >
                            Products
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("categories")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            Categories
                        </button>

                    </div>


                    {/* USER ACTIONS */}

                    <div className="home-nav-links">

                        {user ? (
                            <>

                                {/* USER PROFILE */}

                                <div
                                    className="home-user-profile"
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >

                                    <div className="home-user-avatar">

                                        {user.name
                                            ? user.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}

                                    </div>


                                    <span className="home-user-name">

                                        {user.name || "User"}

                                    </span>

                                </div>


                                {/* CART */}

                                <button
                                    className="home-nav-btn cart-nav-btn"
                                    onClick={() =>
                                        navigate("/cart")
                                    }
                                >
                                    🛒
                                    <span>Cart</span>
                                </button>


                                {/* LOGOUT */}

                                <button
                                    className="home-nav-btn login-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </>
                        ) : (
                            <>

                                {/* LOGIN */}

                                <button
                                    className="home-nav-btn login-btn"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login
                                </button>


                                {/* SIGNUP */}

                                <button
                                    className="home-nav-btn signup-btn"
                                    onClick={() =>
                                        navigate("/signup")
                                    }
                                >
                                    Signup
                                </button>

                            </>
                        )}

                    </div>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <p className="home-hero-small">
                        ✨ WELCOME TO MYSTORE
                    </p>


                    <h1 className="home-hero-title">

                        Shop With Abhinash
                        <br />

                        <span>
                            Live Better
                        </span>

                    </h1>


                    <p className="home-hero-text">

                        Discover amazing products,
                        great quality and the best prices
                        — all in one place.

                    </p>


                    <div className="home-hero-buttons">

                        <button
                            className="home-shop-now-btn"
                            onClick={scrollToProducts}
                        >
                            Shop Now →

                        </button>


                        {!user && (

                            <button
                                className="home-explore-btn"
                                onClick={() =>
                                    navigate("/signup")
                                }
                            >
                                Create Account
                            </button>

                        )}

                    </div>


                    {/* HERO STATS */}

                    <div className="home-hero-stats">

                        <div>

                            <strong>
                                {products.length}+
                            </strong>

                            <span>
                                Products
                            </span>

                        </div>


                        <div>

                            <strong>
                                100%
                            </strong>

                            <span>
                                Quality
                            </span>

                        </div>


                        <div>

                            <strong>
                                24/7
                            </strong>

                            <span>
                                Support
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= SEARCH SECTION ================= */}

            <section className="home-search-section">

                <div className="home-search-container">

                    <div className="home-search-wrapper">

                        <span className="home-search-icon">
                            🔍
                        </span>


                        <input
                            type="text"
                            className="home-search"
                            placeholder="Search products, categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        className="home-select"
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    >

                        {categories.map((category) => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}

                            </option>

                        ))}

                    </select>

                </div>

            </section>


            {/* ================= CATEGORIES ================= */}

            <section
                className="home-categories-section"
                id="categories"
            >

                <div className="home-section-container">

                    <div className="home-section-heading">

                        <p className="home-section-label">

                            SHOP BY CATEGORY

                        </p>


                        <h2>

                            Find What You Love

                        </h2>


                        <p>

                            Explore products from different categories.

                        </p>

                    </div>


                    <div className="home-category-grid">

                        <button
                            className="home-category-card"
                            onClick={() =>
                                handleCategoryClick("All")
                            }
                        >

                            <div className="category-icon">
                                🛍️
                            </div>

                            <h3>
                                All Products
                            </h3>

                            <span>
                                Explore everything
                            </span>

                        </button>


                        {categories
                            .filter(
                                (category) =>
                                    category !== "All"
                            )
                            .slice(0, 7)
                            .map((category, index) => (

                                <button
                                    className="home-category-card"
                                    key={category}
                                    onClick={() =>
                                        handleCategoryClick(category)
                                    }
                                >

                                    <div className="category-icon">

                                        {
                                            [
                                                "📱",
                                                "👕",
                                                "💻",
                                                "🏠",
                                                "⌚",
                                                "🎧",
                                                "✨",
                                            ][index % 7]
                                        }

                                    </div>


                                    <h3>
                                        {category}
                                    </h3>


                                    <span>
                                        Shop Now →
                                    </span>

                                </button>

                            ))}

                    </div>

                </div>

            </section>


            {/* ================= MAIN PRODUCTS ================= */}

            <main
                className="home-main"
                id="products"
            >

                {/* PRODUCTS HEADER */}

                <div className="home-products-header">

                    <div>

                        <p className="home-section-label">

                            OUR COLLECTION

                        </p>


                        <h2 className="home-products-title">

                            Latest Products

                        </h2>


                        <p className="home-products-subtitle">

                            Discover products selected
                            especially for you.

                        </p>

                    </div>


                    <div className="home-product-count">

                        {filteredProducts.length} Products

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading && (

                    <div className="home-loading">

                        <div className="home-spinner"></div>

                        <p>
                            Loading amazing products...
                        </p>

                    </div>

                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (

                    <div className="home-error">

                        <p>
                            {error}
                        </p>


                        <button
                            className="home-details-btn"
                            onClick={fetchProducts}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ================= PRODUCTS ================= */}

                {!loading && !error && (

                    <div className="home-product-grid">

                        {filteredProducts.length > 0 ? (

                            filteredProducts.map((product) => (

                                <div
                                    className="home-product-card"
                                    key={product._id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <div className="home-product-image-box">

                                        <img
                                            src={
                                                product.image ||
                                                "https://via.placeholder.com/500x500?text=No+Image"
                                            }

                                            alt={
                                                product.name ||
                                                "Product"
                                            }

                                            className="home-product-image"
                                        />


                                        {product.category && (

                                            <span className="home-category-badge">

                                                {product.category}

                                            </span>

                                        )}

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="home-product-info">

                                        <p className="home-product-type">

                                            {product.type || "Product"}

                                        </p>


                                        <h3 className="home-product-name">

                                            {
                                                product.name ||
                                                "Unnamed Product"
                                            }

                                        </h3>


                                        <div className="home-product-bottom">

                                            <p className="home-product-price">

                                                ₹
                                                {Number(
                                                    product.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </p>

                                        </div>


                                        {/* PRODUCT ACTIONS */}

                                        <div className="home-product-actions">

                                            <button
                                                className="home-details-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/product-details?id=${product._id}`
                                                    )
                                                }
                                            >

                                                View Details

                                            </button>


                                            <button
                                                className="home-cart-btn"
                                                onClick={() =>
                                                    handleAddToCart(
                                                        product._id
                                                    )
                                                }
                                                title="Add to Cart"
                                            >

                                                🛒

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="home-no-products">

                                <div className="home-no-products-icon">

                                    🔍

                                </div>


                                <h3>

                                    No Products Found

                                </h3>


                                <p>

                                    Try searching with a different keyword
                                    or select another category.

                                </p>


                                <button
                                    className="home-reset-btn"
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedCategory("All");
                                    }}
                                >

                                    Reset Filters

                                </button>

                            </div>

                        )}

                    </div>

                )}

            </main>


            {/* ================= FEATURES ================= */}

            <section className="home-features-section">

                <div className="home-features-container">

                    <div className="home-feature-card">

                        <div className="feature-icon">
                            🚚
                        </div>


                        <div>

                            <h3>
                                Fast Delivery
                            </h3>

                            <p>
                                Quick and reliable delivery service.
                            </p>

                        </div>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            🔒
                        </div>


                        <div>

                            <h3>
                                Secure Shopping
                            </h3>

                            <p>
                                Your shopping experience is protected.
                            </p>

                        </div>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            ⭐
                        </div>


                        <div>

                            <h3>
                                Quality Products
                            </h3>

                            <p>
                                Carefully selected products for you.
                            </p>

                        </div>

                    </div>


                    <div className="home-feature-card">

                        <div className="feature-icon">
                            💬
                        </div>


                        <div>

                            <h3>
                                Customer Support
                            </h3>

                            <p>
                                We are here to help you anytime.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="home-footer-container">

                    <div className="home-footer-brand">

                        <h3>
                            🛍️ MyStore
                        </h3>

                        <p>
                            Your trusted online shopping destination.
                        </p>

                    </div>


                    <div className="home-footer-links">

                        <div>

                            <h4>
                                Shop
                            </h4>

                            <button
                                onClick={scrollToProducts}
                            >
                                Products
                            </button>


                            <button
                                onClick={() =>
                                    document
                                        .getElementById("categories")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                            >
                                Categories
                            </button>

                        </div>


                        <div>

                            <h4>
                                Account
                            </h4>


                            {user ? (

                                <>

                                    <button
                                        onClick={() =>
                                            navigate("/profile")
                                        }
                                    >
                                        Profile
                                    </button>


                                    <button
                                        onClick={() =>
                                            navigate("/cart")
                                        }
                                    >
                                        Cart
                                    </button>

                                </>

                            ) : (

                                <>

                                    <button
                                        onClick={() =>
                                            navigate("/login")
                                        }
                                    >
                                        Login
                                    </button>


                                    <button
                                        onClick={() =>
                                            navigate("/signup")
                                        }
                                    >
                                        Signup
                                    </button>

                                </>

                            )}

                        </div>

                    </div>

                </div>


                <div className="home-footer-bottom">

                    <small>

                        © 2026 MyStore.
                        All rights reserved.

                    </small>

                </div>

            </footer>

        </div>
    );
}