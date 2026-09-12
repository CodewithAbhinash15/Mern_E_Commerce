import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Signup.css";

export default function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");


    // ==============================
    // GET CART
    // ==============================

    const fetchCart = async () => {

        try {

            setLoading(true);

            const response = await api.get("/cart");

            console.log(
                "CART RESPONSE:",
                response.data
            );


            if (response.data.cart) {

                setCart(response.data.cart);

            } else {

                setCart({
                    items: [],
                });

            }

        } catch (error) {

            console.error(
                "GET CART ERROR:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");

                return;

            }


            setMessage(
                error.response?.data?.message ||
                "Failed to load cart"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // CHECK LOGIN
    // ==============================

    useEffect(() => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;

        }


        fetchCart();

    }, []);


    // ==============================
    // UPDATE QUANTITY
    // ==============================

    const updateQuantity = async (
        productId,
        quantity
    ) => {

        if (quantity < 1) {

            return;

        }


        try {

            const response = await api.put(

                "/cart/update-quantity",

                {
                    productId,
                    quantity,
                }

            );


            setCart(
                response.data.cart
            );


        } catch (error) {

            console.error(
                "UPDATE QUANTITY ERROR:",
                error
            );


            setMessage(
                error.response?.data?.message ||
                "Failed to update quantity"
            );

        }

    };


    // ==============================
    // REMOVE PRODUCT
    // ==============================

    const removeFromCart = async (
        productId
    ) => {

        try {

            const response = await api.delete(

                "/cart/remove",

                {
                    data: {
                        productId,
                    },
                }

            );


            setCart(
                response.data.cart
            );


            setMessage(
                "Product removed from cart"
            );


        } catch (error) {

            console.error(
                "REMOVE PRODUCT ERROR:",
                error
            );


            setMessage(
                error.response?.data?.message ||
                "Failed to remove product"
            );

        }

    };


    // ==============================
    // CALCULATE TOTAL
    // ==============================

    const calculateTotal = () => {

        if (!cart?.items) {

            return 0;

        }


        return cart.items.reduce(

            (total, item) => {

                const price =
                    item.product?.price || 0;


                const quantity =
                    item.quantity || 1;


                return (
                    total +
                    price * quantity
                );

            },

            0

        );

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div
                style={{
                    textAlign: "center",
                    padding: "50px",
                }}
            >

                <h2>
                    Loading Cart...
                </h2>

            </div>

        );

    }


    // ==============================
    // CART PAGE
    // ==============================

    return (

        <div
            style={{
                maxWidth: "1000px",
                margin: "auto",
                padding: "30px",
            }}
        >


            {/* ================= HEADER ================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >

                <h1>
                    🛒 My Cart
                </h1>


                <button
                    onClick={() =>
                        navigate("/")
                    }
                >

                    ← Continue Shopping

                </button>


            </div>


            {/* ============================= */}
            {/* MESSAGE */}
            {/* ============================= */}

            {message && (

                <p
                    style={{
                        marginBottom: "20px",
                        color: "red",
                    }}
                >

                    {message}

                </p>

            )}


            {/* ============================= */}
            {/* EMPTY CART */}
            {/* ============================= */}

            {!cart ||
            !cart.items ||
            cart.items.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "50px",
                    }}
                >

                    <h2>
                        Your cart is empty 🛒
                    </h2>


                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >

                        Start Shopping

                    </button>


                    {/* MY ORDERS BUTTON */}

                    <button
                        onClick={() =>
                            navigate("/orders")
                        }

                        style={{
                            marginLeft: "15px",
                        }}
                    >

                        📋 My Orders

                    </button>


                </div>

            ) : (

                <>


                    {/* ================= CART ITEMS ================= */}

                    {cart.items.map(
                        (item) => (

                            <div

                                key={item._id}

                                style={{

                                    display: "flex",

                                    gap: "20px",

                                    alignItems:
                                        "center",

                                    border:
                                        "1px solid #ddd",

                                    padding: "15px",

                                    marginBottom:
                                        "15px",

                                    borderRadius:
                                        "10px",

                                }}

                            >


                                {/* PRODUCT IMAGE */}

                                <img

                                    src={
                                        item.product?.image ||

                                        "https://via.placeholder.com/150"
                                    }

                                    alt={
                                        item.product?.name ||

                                        "Product"
                                    }

                                    style={{

                                        width: "100px",

                                        height: "100px",

                                        objectFit:
                                            "cover",

                                    }}

                                />


                                {/* PRODUCT DETAILS */}

                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                >

                                    <h3>

                                        {
                                            item.product?.name
                                        }

                                    </h3>


                                    <p>

                                        ₹
                                        {
                                            item.product?.price ||
                                            0
                                        }

                                    </p>

                                </div>


                                {/* QUANTITY */}

                                <div>

                                    <button

                                        onClick={() =>

                                            updateQuantity(

                                                item.product._id,

                                                item.quantity - 1

                                            )

                                        }

                                    >

                                        −

                                    </button>


                                    <span
                                        style={{
                                            margin:
                                                "0 15px",
                                        }}
                                    >

                                        {item.quantity}

                                    </span>


                                    <button

                                        onClick={() =>

                                            updateQuantity(

                                                item.product._id,

                                                item.quantity + 1

                                            )

                                        }

                                    >

                                        +

                                    </button>

                                </div>


                                {/* ITEM TOTAL */}

                                <div>

                                    ₹

                                    {
                                        (
                                            (
                                                item.product?.price ||
                                                0
                                            ) *

                                            item.quantity
                                        ).toFixed(2)
                                    }

                                </div>


                                {/* REMOVE */}

                                <button

                                    onClick={() =>

                                        removeFromCart(

                                            item.product._id

                                        )

                                    }

                                >

                                    🗑️ Remove

                                </button>


                            </div>

                        )

                    )}


                    {/* ================= CART TOTAL ================= */}

                    <div
                        style={{

                            marginTop: "30px",

                            padding: "20px",

                            borderTop:
                                "2px solid #ddd",

                            textAlign: "right",

                        }}
                    >

                        <h2>

                            Total: ₹
                            {
                                calculateTotal()
                                    .toFixed(2)
                            }

                        </h2>


                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "15px",
                                marginTop: "20px",
                            }}
                        >


                            {/* CHECKOUT */}

                            <button

                                onClick={() =>
                                    navigate("/checkout")
                                }

                                style={{
                                    padding:
                                        "12px 20px",

                                    cursor:
                                        "pointer",
                                }}

                            >

                                📦 Proceed to Checkout

                            </button>


                            {/* MY ORDERS */}

                            <button

                                onClick={() =>
                                    navigate("/orders")
                                }

                                style={{
                                    padding:
                                        "12px 20px",

                                    cursor:
                                        "pointer",
                                }}

                            >

                                📋 My Orders

                            </button>


                        </div>


                    </div>


                </>

            )}


        </div>

    );

}