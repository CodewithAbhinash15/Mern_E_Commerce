import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AdminOrders.css";

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================
    // FETCH ALL ORDERS
    // =====================================

    const fetchAllOrders = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/orders/admin/all"
            );


            console.log(
                "ALL ORDERS:",
                response.data
            );


            setOrders(
                response.data.orders || []
            );

        } catch (error) {

            console.error(
                "FETCH ORDERS ERROR:",
                error
            );


            setError(

                error.response?.data?.message ||

                "Failed to load orders"

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // LOAD ORDERS
    // =====================================

    useEffect(() => {

        fetchAllOrders();

    }, []);


    // =====================================
    // UPDATE ORDER STATUS
    // =====================================

    const handleStatusChange = async (
        orderId,
        status
    ) => {

        try {

            const response = await api.put(

                `/orders/admin/${orderId}/status`,

                {
                    status,
                }

            );


            console.log(
                "STATUS UPDATED:",
                response.data
            );


            setOrders((previousOrders) =>

                previousOrders.map((order) =>

                    order._id === orderId

                        ? {
                            ...order,
                            orderStatus: status,
                        }

                        : order

                )

            );


        } catch (error) {

            console.error(
                "STATUS UPDATE ERROR:",
                error
            );


            alert(

                error.response?.data?.message ||

                "Failed to update order status"

            );

        }

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="admin-orders-loading">

                <div className="admin-loader"></div>

                <h2>
                    Loading Orders...
                </h2>

            </div>

        );

    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (

            <div className="admin-orders-error">

                <h2>
                    {error}
                </h2>


                <button
                    onClick={fetchAllOrders}
                >

                    Try Again

                </button>

            </div>

        );

    }


    return (

        <div className="admin-orders-page">


            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="admin-orders-header">

                <div>

                    <p>
                        ADMIN PANEL
                    </p>


                    <h1>
                        Customer Orders
                    </h1>


                    <span>

                        Manage and track all
                        customer orders

                    </span>

                </div>


                <div className="admin-order-count">

                    {orders.length}

                    <span>
                        Total Orders
                    </span>

                </div>

            </div>


            {/* ========================= */}
            {/* NO ORDERS */}
            {/* ========================= */}

            {orders.length === 0 ? (

                <div className="admin-no-orders">

                    <div>
                        📦
                    </div>


                    <h2>
                        No Orders Yet
                    </h2>


                    <p>
                        Customer orders will
                        appear here.
                    </p>

                </div>

            ) : (


                /* ========================= */
                /* ORDER LIST */
                /* ========================= */

                <div className="admin-orders-list">


                    {orders.map((order) => (

                        <div
                            className="admin-order-card"
                            key={order._id}
                        >


                            {/* ================= */}
                            {/* ORDER TOP */}
                            {/* ================= */}

                            <div className="admin-order-top">


                                <div>

                                    <p className="admin-order-id">

                                        Order ID

                                    </p>


                                    <strong>

                                        #{order._id.slice(-8)}

                                    </strong>

                                </div>


                                <div className="admin-order-date">

                                    📅

                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}

                                </div>


                                <div className="admin-order-status">

                                    <select

                                        value={
                                            order.orderStatus
                                        }

                                        onChange={(e) =>

                                            handleStatusChange(

                                                order._id,

                                                e.target.value

                                            )

                                        }

                                    >

                                        <option value="PLACED">

                                            PLACED

                                        </option>


                                        <option value="PROCESSING">

                                            PROCESSING

                                        </option>


                                        <option value="SHIPPED">

                                            SHIPPED

                                        </option>


                                        <option value="DELIVERED">

                                            DELIVERED

                                        </option>


                                        <option value="CANCELLED">

                                            CANCELLED

                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ================= */}
                            {/* CUSTOMER */}
                            {/* ================= */}

                            <div className="admin-order-customer">


                                <div className="admin-section-title">

                                    👤 Customer

                                </div>


                                <div className="admin-customer-info">


                                    <strong>

                                        {order.user?.name ||

                                            "Unknown User"}

                                    </strong>


                                    <span>

                                        📧

                                        {order.user?.email ||

                                            "No email"}

                                    </span>

                                </div>

                            </div>


                            {/* ================= */}
                            {/* ORDER ITEMS */}
                            {/* ================= */}

                            <div className="admin-order-items">


                                <div className="admin-section-title">

                                    📦 Ordered Products

                                </div>


                                <div className="admin-items-list">


                                    {order.items?.map(

                                        (item, index) => (

                                            <div

                                                className="admin-order-item"

                                                key={

                                                    item._id ||

                                                    index

                                                }

                                            >


                                                <img

                                                    src={

                                                        item.image ||

                                                        "https://via.placeholder.com/100?text=Product"

                                                    }

                                                    alt={

                                                        item.name

                                                    }

                                                />


                                                <div className="admin-item-info">


                                                    <strong>

                                                        {item.name}

                                                    </strong>


                                                    <span>

                                                        ₹

                                                        {Number(

                                                            item.price

                                                        ).toLocaleString(

                                                            "en-IN"

                                                        )}

                                                    </span>

                                                </div>


                                                <div className="admin-item-quantity">

                                                    Qty:

                                                    <strong>

                                                        {

                                                            item.quantity

                                                        }

                                                    </strong>

                                                </div>


                                                <div className="admin-item-total">

                                                    ₹

                                                    {Number(

                                                        item.price *

                                                        item.quantity

                                                    ).toLocaleString(

                                                        "en-IN"

                                                    )}

                                                </div>

                                            </div>

                                        )

                                    )}

                                </div>

                            </div>


                            {/* ================= */}
                            {/* DELIVERY ADDRESS */}
                            {/* ================= */}

                            <div className="admin-delivery-address">


                                <div className="admin-section-title">

                                    📍 Delivery Address

                                </div>


                                {order.address ? (

                                    <div className="admin-address-box">

                                        <strong>

                                            {

                                                order.address.fullName

                                            }

                                        </strong>


                                        <p>

                                            {

                                                order.address.address

                                            }

                                        </p>


                                        <p>

                                            {

                                                order.address.city

                                            },

                                            {" "}

                                            {

                                                order.address.state

                                            }

                                            {" - "}

                                            {

                                                order.address.pincode

                                            }

                                        </p>


                                        <p>

                                            📞

                                            {

                                                order.address.mobile

                                            }

                                        </p>

                                    </div>

                                ) : (

                                    <p>

                                        Address not available

                                    </p>

                                )}

                            </div>


                            {/* ================= */}
                            {/* ORDER SUMMARY */}
                            {/* ================= */}

                            <div className="admin-order-summary">


                                <div>

                                    <span>

                                        Payment Method

                                    </span>


                                    <strong>

                                        {

                                            order.paymentMethod

                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        Payment Status

                                    </span>


                                    <strong>

                                        {

                                            order.paymentStatus

                                        }

                                    </strong>

                                </div>


                                <div className="admin-total-amount">

                                    <span>

                                        Total Amount

                                    </span>


                                    <strong>

                                        ₹

                                        {Number(

                                            order.totalAmount

                                        ).toLocaleString(

                                            "en-IN"

                                        )}

                                    </strong>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

