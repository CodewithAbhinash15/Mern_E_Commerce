import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {


const navigate = useNavigate();

const location = useLocation();

const order = location.state?.order;


// If user opens page directly

if (!order) {

    return (

        <div
            style={{
                textAlign: "center",
                padding: "50px",
            }}
        >

            <h2>
                No order information found.
            </h2>


            <button
                onClick={() =>
                    navigate("/")
                }
            >

                Go Home

            </button>

        </div>

    );

}


return (

    <div
        style={{
            maxWidth: "700px",
            margin: "50px auto",
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "10px",
        }}
    >

        <h1>
            🎉 Order Placed Successfully!
        </h1>


        <p>
            Thank you for your order.
        </p>


        <hr />


        <h3>
            Order ID
        </h3>

        <p>
            {order._id}
        </p>


        <h3>
            Total Amount
        </h3>

        <p>
            ₹{order.totalAmount}
        </p>


        <h3>
            Payment Method
        </h3>

        <p>
            {order.paymentMethod}
        </p>


        <h3>
            Order Status
        </h3>

        <p>
            {order.orderStatus}
        </p>


        <br />


        <button
            onClick={() =>
                navigate("/orders")
            }
        >

            📋 View My Orders

        </button>


        {" "}


        <button
            onClick={() =>
                navigate("/")
            }
        >

            🏠 Continue Shopping

        </button>

    </div>

);


}
