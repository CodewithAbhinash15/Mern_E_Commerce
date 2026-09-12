import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Checkout.css";

export default function Checkout() {

    const navigate = useNavigate();

    // =========================
    // STATES
    // =========================

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Show Add / Edit Address Form
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Editing Address ID
    const [editingAddressId, setEditingAddressId] = useState(null);


    // =========================
    // ADDRESS FORM STATE
    // =========================

    const [newAddress, setNewAddress] = useState({
        fullName: "",
        mobile: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
        country: "India",
    });


    // =========================
    // GET SAVED ADDRESSES
    // =========================

    const fetchAddresses = async () => {

        try {

            const response = await api.get("/address");

            console.log("ADDRESSES:", response.data);

            setAddresses(
                response.data.addresses || []
            );

        } catch (error) {

            console.error(
                "ADDRESS ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load addresses"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // FETCH ADDRESSES ON LOAD
    // =========================

    useEffect(() => {

        fetchAddresses();

    }, []);


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleAddressChange = (e) => {

        const { name, value } = e.target;

        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =========================
    // RESET ADDRESS FORM
    // =========================

    const resetAddressForm = () => {

        setNewAddress({
            fullName: "",
            mobile: "",
            pincode: "",
            address: "",
            city: "",
            state: "",
            country: "India",
        });

        setEditingAddressId(null);

    };


    // =========================
    // ADD NEW ADDRESS
    // =========================

    const handleAddNewAddress = () => {

        resetAddressForm();

        setShowAddressForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =========================
    // CANCEL ADDRESS FORM
    // =========================

    const handleCancelAddress = () => {

        setShowAddressForm(false);

        resetAddressForm();

    };


    // =========================
    // EDIT ADDRESS
    // =========================

    const handleEditAddress = (address, e) => {

        // Prevent card click
        e.stopPropagation();


        // Fill form with existing address

        setNewAddress({

            fullName:
                address.fullName || "",

            mobile:
                address.mobile || "",

            pincode:
                address.pincode || "",

            address:
                address.address || "",

            city:
                address.city || "",

            state:
                address.state || "",

            country:
                address.country || "India",

        });


        // Set editing ID

        setEditingAddressId(
            address._id
        );


        // Show form

        setShowAddressForm(true);


        // Scroll to top

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =========================
    // DELETE ADDRESS
    // =========================

    const handleDeleteAddress = async (
        addressId,
        e
    ) => {

        // Prevent selecting card

        e.stopPropagation();


        const confirmDelete = window.confirm(
            "Are you sure you want to delete this address?"
        );


        if (!confirmDelete) {

            return;

        }


        try {

            setMessage("");


            // DELETE API

            await api.delete(
                `/address/${addressId}`
            );


            // If selected address deleted

            if (
                selectedAddress === addressId
            ) {

                setSelectedAddress("");

            }


            // Refresh address list

            await fetchAddresses();


            setMessage(
                "Address deleted successfully!"
            );


        } catch (error) {

            console.error(
                "DELETE ADDRESS ERROR:",
                error
            );


            setMessage(

                error.response?.data?.message ||

                "Failed to delete address"

            );

        }

    };


    // =========================
    // SAVE / UPDATE ADDRESS
    // =========================

    const handleSaveAddress = async (e) => {

        e.preventDefault();


        try {

            setMessage("");

            let response;

            // Save this before reset
            const isEditing =
                Boolean(editingAddressId);


            // =========================
            // UPDATE ADDRESS
            // =========================

            if (editingAddressId) {

                response = await api.put(

                    `/address/${editingAddressId}`,

                    newAddress

                );

            }


            // =========================
            // ADD NEW ADDRESS
            // =========================

            else {

                response = await api.post(

                    "/address",

                    newAddress

                );

            }


            const savedAddress =
                response.data.address;


            // Refresh addresses

            await fetchAddresses();


            // Automatically select address

            if (savedAddress?._id) {

                setSelectedAddress(
                    savedAddress._id
                );

            }


            // Close form

            setShowAddressForm(false);


            // Reset form

            resetAddressForm();


            // Success message

            setMessage(

                isEditing

                    ? "Address updated successfully!"

                    : "Address added successfully!"

            );


        } catch (error) {

            console.error(
                "SAVE ADDRESS ERROR:",
                error
            );


            setMessage(

                error.response?.data?.message ||

                "Failed to save address"

            );

        }

    };


    // =========================
    // PLACE ORDER
    // =========================

    const handlePlaceOrder = async () => {

        // Check selected address

        if (!selectedAddress) {

            setMessage(
                "Please select a delivery address"
            );

            return;

        }


        try {

            setMessage("");


            // CREATE ORDER

            const response = await api.post(

                "/orders",

                {

                    addressId:
                        selectedAddress,

                    paymentMethod:
                        "COD",

                }

            );


            console.log(
                "ORDER RESPONSE:",
                response.data
            );


            // GO TO SUCCESS PAGE

            navigate(

                "/order-success",

                {

                    state: {

                        order:
                            response.data.order,

                    },

                }

            );


        } catch (error) {

            console.error(
                "ORDER ERROR:",
                error
            );


            setMessage(

                error.response?.data?.message ||

                "Failed to place order"

            );

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="checkout-loading">

                <div className="loader"></div>

                <h2>
                    Loading Checkout...
                </h2>

            </div>

        );

    }


    // =========================
    // CHECKOUT PAGE
    // =========================

    return (

        <div className="checkout-page">

            <div className="checkout-container">


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="checkout-header">

                    <div>

                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Complete your order securely
                        </p>

                    </div>


                    <div className="secure-checkout">

                        🔒 Secure Checkout

                    </div>

                </div>


                {/* ========================= */}
                {/* MESSAGE */}
                {/* ========================= */}

                {message && (

                    <div

                        className={

                            message.includes("successfully")

                                ? "checkout-success"

                                : "checkout-error"

                        }

                    >

                        {message}

                    </div>

                )}


                {/* ========================= */}
                {/* DELIVERY ADDRESS */}
                {/* ========================= */}

                <section className="checkout-section">


                    <div className="section-header">

                        <div>

                            <span className="step-number">
                                1
                            </span>

                            <h2>
                                Delivery Address
                            </h2>

                        </div>


                        {!showAddressForm && (

                            <button

                                className="add-address-btn"

                                onClick={
                                    handleAddNewAddress
                                }

                            >

                                + Add New Address

                            </button>

                        )}

                    </div>


                    {/* ========================= */}
                    {/* ADD / EDIT ADDRESS FORM */}
                    {/* ========================= */}

                    {showAddressForm && (

                        <form

                            className="address-form"

                            onSubmit={
                                handleSaveAddress
                            }

                        >

                            <h3>

                                {editingAddressId

                                    ? "Edit Delivery Address"

                                    : "Add New Delivery Address"

                                }

                            </h3>


                            {/* NAME + MOBILE */}

                            <div className="form-grid">


                                <div className="form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input

                                        type="text"

                                        name="fullName"

                                        placeholder="Enter full name"

                                        value={
                                            newAddress.fullName
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Mobile Number
                                    </label>

                                    <input

                                        type="text"

                                        name="mobile"

                                        placeholder="10-digit mobile number"

                                        value={
                                            newAddress.mobile
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                            </div>


                            {/* FULL ADDRESS */}

                            <div className="form-group">

                                <label>
                                    Full Address
                                </label>

                                <textarea

                                    name="address"

                                    placeholder="House No., Street, Village / Area"

                                    value={
                                        newAddress.address
                                    }

                                    onChange={
                                        handleAddressChange
                                    }

                                    rows="4"

                                    required

                                />

                            </div>


                            {/* CITY + STATE */}

                            <div className="form-grid">


                                <div className="form-group">

                                    <label>
                                        City
                                    </label>

                                    <input

                                        type="text"

                                        name="city"

                                        placeholder="Enter city"

                                        value={
                                            newAddress.city
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State
                                    </label>

                                    <input

                                        type="text"

                                        name="state"

                                        placeholder="Enter state"

                                        value={
                                            newAddress.state
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                            </div>


                            {/* PINCODE + COUNTRY */}

                            <div className="form-grid">


                                <div className="form-group">

                                    <label>
                                        Pincode
                                    </label>

                                    <input

                                        type="text"

                                        name="pincode"

                                        placeholder="Enter pincode"

                                        value={
                                            newAddress.pincode
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Country
                                    </label>

                                    <input

                                        type="text"

                                        name="country"

                                        value={
                                            newAddress.country
                                        }

                                        onChange={
                                            handleAddressChange
                                        }

                                        required

                                    />

                                </div>


                            </div>


                            {/* FORM BUTTONS */}

                            <div className="form-actions">


                                {/* CANCEL */}

                                <button

                                    type="button"

                                    className="cancel-btn"

                                    onClick={
                                        handleCancelAddress
                                    }

                                >

                                    Cancel

                                </button>


                                {/* SAVE / UPDATE */}

                                <button

                                    type="submit"

                                    className="save-address-btn"

                                >

                                    {editingAddressId

                                        ? "Update Address"

                                        : "Save Address"

                                    }

                                </button>


                            </div>


                        </form>

                    )}


                    {/* ========================= */}
                    {/* SAVED ADDRESSES */}
                    {/* ========================= */}

                    <div className="addresses-list">


                        {addresses.length === 0 ? (

                            <div className="no-address">

                                <div className="location-icon">
                                    📍
                                </div>

                                <h3>
                                    No delivery address found
                                </h3>

                                <p>
                                    Add a delivery address
                                    to continue.
                                </p>

                            </div>

                        ) : (

                            addresses.map((address) => (

                                <div

                                    key={address._id}

                                    className={`address-card ${

                                        selectedAddress ===
                                        address._id

                                            ? "selected-address"

                                            : ""

                                    }`}


                                    onClick={() =>

                                        setSelectedAddress(
                                            address._id
                                        )

                                    }

                                >


                                    {/* RADIO */}

                                    <div className="address-radio">

                                        <input

                                            type="radio"

                                            name="address"

                                            checked={

                                                selectedAddress ===
                                                address._id

                                            }

                                            onChange={() =>

                                                setSelectedAddress(
                                                    address._id
                                                )

                                            }

                                        />

                                    </div>


                                    {/* ADDRESS DETAILS */}

                                    <div className="address-details">


                                        {/* NAME */}

                                        <div className="address-name">

                                            <strong>

                                                {address.fullName}

                                            </strong>


                                            {address.isDefault && (

                                                <span className="default-badge">

                                                    DEFAULT

                                                </span>

                                            )}

                                        </div>


                                        {/* FULL ADDRESS */}

                                        <p>

                                            {address.address}

                                        </p>


                                        {/* CITY */}

                                        <p>

                                            {address.city},

                                            {" "}

                                            {address.state}

                                            {" - "}

                                            {address.pincode}

                                        </p>


                                        {/* COUNTRY */}

                                        <p>

                                            {address.country}

                                        </p>


                                        {/* MOBILE */}

                                        <p className="mobile-number">

                                            📞 {" "}

                                            {address.mobile}

                                        </p>


                                        {/* ========================= */}
                                        {/* EDIT + DELETE BUTTONS */}
                                        {/* ========================= */}

                                        <div className="address-actions">


                                            {/* EDIT */}

                                            <button

                                                type="button"

                                                className="edit-address-btn"

                                                onClick={(e) =>

                                                    handleEditAddress(
                                                        address,
                                                        e
                                                    )

                                                }

                                            >

                                                ✏️ Edit

                                            </button>


                                            {/* DELETE */}

                                            <button

                                                type="button"

                                                className="delete-address-btn"

                                                onClick={(e) =>

                                                    handleDeleteAddress(
                                                        address._id,
                                                        e
                                                    )

                                                }

                                            >

                                                🗑 Delete

                                            </button>


                                        </div>


                                    </div>


                                    {/* SELECTED CHECK */}

                                    {selectedAddress ===
                                        address._id && (

                                        <div className="selected-check">

                                            ✓

                                        </div>

                                    )}


                                </div>

                            ))

                        )}


                    </div>


                </section>


                {/* ========================= */}
                {/* PAYMENT METHOD */}
                {/* ========================= */}

                <section className="checkout-section">


                    <div className="section-header">

                        <div>

                            <span className="step-number">
                                2
                            </span>

                            <h2>
                                Payment Method
                            </h2>

                        </div>

                    </div>


                    <div className="payment-card">


                        <div className="payment-icon">

                            💵

                        </div>


                        <div>

                            <strong>

                                Cash on Delivery

                            </strong>


                            <p>

                                Pay when your order arrives

                            </p>

                        </div>


                        <span className="payment-selected">

                            ✓

                        </span>


                    </div>


                </section>


                {/* ========================= */}
                {/* PLACE ORDER */}
                {/* ========================= */}

                <section className="place-order-section">


                    <div>

                        <h3>
                            Ready to place your order?
                        </h3>

                        <p>
                            Your order will be delivered
                            to the selected address.
                        </p>

                    </div>


                    <button

                        className="place-order-btn"

                        onClick={
                            handlePlaceOrder
                        }

                        disabled={
                            !selectedAddress
                        }

                    >

                        📦 Place Order

                    </button>


                </section>


                {/* ========================= */}
                {/* BACK TO CART */}
                {/* ========================= */}

                <button

                    className="back-cart-btn"

                    onClick={() =>

                        navigate("/cart")

                    }

                >

                    ← Back to Cart

                </button>


            </div>

        </div>

    );

}

