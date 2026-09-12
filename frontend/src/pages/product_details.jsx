import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetails() {
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const productId = searchParams.get("id");
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Fetch product details
useEffect(() => {
    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/products/${productId}`
            );

            setProduct(response.data);

        } catch (err) {
            console.error("PRODUCT DETAILS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load product details"
            );

        } finally {
            setLoading(false);
        }
    };

    if (productId) {
        fetchProduct();
    } else {
        setError("Product ID not found");
        setLoading(false);
    }

}, [productId]);


// Add product to cart
const handleAddToCart = async () => {
    try {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            alert("Please login first!");

            navigate("/login");

            return;
        }

        const response = await api.post("/cart/add", {
            userId: user._id,
            productId: product._id,
            quantity: 1,
        });

        alert(
            response.data.message ||
            "Product added to cart!"
        );

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Failed to add product to cart"
        );
    }
};


if (loading) {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Loading product...</h2>
        </div>
    );
}


if (error) {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>{error}</h2>

            <button onClick={() => navigate("/")}>
                Back to Home
            </button>
        </div>
    );
}


if (!product) {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Product not found</h2>
        </div>
    );
}


return (
    <div
        style={{
            minHeight: "100vh",
            padding: "40px",
            boxSizing: "border-box",
        }}
    >

        <button
            onClick={() => navigate("/")}
            style={{
                padding: "10px 18px",
                cursor: "pointer",
                marginBottom: "30px",
            }}
        >
            ← Back to Home
        </button>


        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
            }}
        >

            {/* Product Image */}

            <div>

                <img
                    src={
                        product.image ||
                        "https://via.placeholder.com/500x500?text=No+Image"
                    }
                    alt={product.name}
                    style={{
                        width: "100%",
                        maxHeight: "500px",
                        objectFit: "cover",
                        borderRadius: "12px",
                    }}
                />

            </div>


            {/* Product Information */}

            <div>

                <p>
                    {product.category}
                </p>


                <h1>
                    {product.name}
                </h1>


                <p>
                    Type: {product.type}
                </p>


                <h2>
                    ₹{product.price}
                </h2>


                {product.description && (

                    <p>
                        {product.description}
                    </p>

                )}


                <button
                    onClick={handleAddToCart}
                    style={{
                        padding: "14px 25px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>

    </div>
);


}
