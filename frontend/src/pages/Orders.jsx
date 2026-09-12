import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Orders() {


const navigate = useNavigate();

const [orders, setOrders] = useState([]);

const [loading, setLoading] = useState(true);

const [message, setMessage] = useState("");


// ==============================
// GET MY ORDERS
// ==============================

const fetchOrders = async () => {

    try {

        const response = await api.get("/orders");

        setOrders(response.data.orders);

    } catch (error) {

        console.error(error);

        setMessage(
            error.response?.data?.message ||
            "Failed to load orders"
        );

    } finally {

        setLoading(false);

    }

};


useEffect(() => {

    fetchOrders();

}, []);


if (loading) {

    return (

        <div
            style={{
                textAlign: "center",
                padding: "50px",
            }}
        >

            <h2>
                Loading Orders...</h2>

        </div>

    );

}


return (

    <div
        style={{
            maxWidth: "900px",
            margin: "auto",
            padding: "30px",
        }}
    >

        <h1>
            📦 My Orders
        </h1>


        {message && (

            <p>
                {message}
            </p>

        )}


        {orders.length === 0 ? (

            <div>

                <h2>
                    No orders found.
                </h2>


                <button
                    onClick={() =>
                        navigate("/")
                    }
                >

                    Start Shopping

                </button>

            </div>

        ) : (

            orders.map((order) => (

                <div
                    key={order._id}

                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                    }}
                >

                    <h3>
                        Order ID: {order._id}
                    </h3>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        {" "}

                        {
                            new Date(
                                order.createdAt
                            ).toLocaleString()
                        }

                    </p>


                    <p>

                        <strong>
                            Total:
                        </strong>

                        {" "}

                        ₹{order.totalAmount}

                    </p>


                    <p>

                        <strong>
                            Payment:
                        </strong>

                        {" "}

                        {order.paymentMethod}

                    </p>


                    <p>

                        <strong>
                            Payment Status:
                        </strong>

                        {" "}

                        {order.paymentStatus}

                    </p>


                    <p>

                        <strong>
                            Order Status:
                        </strong>

                        {" "}

                        {order.orderStatus}

                    </p>


                    <hr />


                    <h3>
                        Products
                    </h3>


                    {order.items.map((item) => (

                        <div
                            key={item._id || item.product?._id}
                            style={{
                                marginBottom: "10px",
                            }}
                        >

                            <strong>
                                {item.name}
                            </strong>

                            {" — "}

                            ₹{item.price}

                            {" × "}

                            {item.quantity}

                        </div>

                    ))}

                </div>

            ))

        )}


        <br />


        <button
            onClick={() =>
                navigate("/")
            }
        >

            ← Continue Shopping

        </button>

    </div>

);


}
