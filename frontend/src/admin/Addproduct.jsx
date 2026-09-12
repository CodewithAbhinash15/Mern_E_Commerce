import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../pages/Signup.css";

export default function Addproduct() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
        image: "",
        stock: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        // ============================
        // CHECK IF USER IS LOGGED IN
        // ============================

        const token = localStorage.getItem("token");


        if (!token) {

            setMsg("Please login first to add a product.");

            setTimeout(() => {

                navigate("/Login");

            }, 1500);

            return;

        }


        try {

            setLoading(true);
            setMsg("");


            const response = await api.post(
                "/products/add",
                {
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    category: form.category,
                    type: form.type,
                    image: form.image,
                    stock: Number(form.stock),
                }
            );


            console.log(
                "PRODUCT ADDED:",
                response.data
            );


            setMsg(
                response.data.message ||
                "Product added successfully!"
            );


            // Go to My Products/Profile
            setTimeout(() => {

                navigate("/Profile");

            }, 1000);


        } catch (error) {

            console.error(
                "ADD PRODUCT ERROR:",
                error
            );


            // Token invalid or expired
            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setMsg(
                    "Session expired. Please login again."
                );


                setTimeout(() => {

                    navigate("/Login");

                }, 1500);

                return;

            }


            setMsg(
                error.response?.data?.message ||
                "Failed to add product"
            );

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="signup-page">

            <div className="signup-container">


                <h2 className="signup-title">
                    Add New Product
                </h2>


                {msg && (

                    <div className="success-message">
                        {msg}
                    </div>

                )}


                <form
                    className="signup-form"
                    onSubmit={handleSubmit}
                >


                    <input
                        className="signup-input"
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    <input
                        className="signup-input"
                        type="text"
                        name="description"
                        placeholder="Product Description"
                        value={form.description}
                        onChange={handleChange}
                    />


                    <input
                        className="signup-input"
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />


                    <input
                        className="signup-input"
                        type="text"
                        name="category"
                        placeholder="Category (Men, Women, Electronics)"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />


                    <input
                        className="signup-input"
                        type="text"
                        name="type"
                        placeholder="Type (Clothing, Shoes, Mobile)"
                        value={form.type}
                        onChange={handleChange}
                    />


                    <input
                        className="signup-input"
                        type="url"
                        name="image"
                        placeholder="Paste Image URL"
                        value={form.image}
                        onChange={handleChange}
                    />


                    <input
                        className="signup-input"
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                    />


                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Adding Product..."
                            : "Add Product"}

                    </button>


                    <button
                        type="button"
                        className="signup-button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        Cancel
                    </button>


                </form>

            </div>

        </div>

    );

}

