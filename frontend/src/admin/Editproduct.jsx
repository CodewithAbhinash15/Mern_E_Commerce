import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../pages/Signup.css";

export default function EditProduct() {
const { id } = useParams();
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
const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);


// Load product details
useEffect(() => {
    const loadProduct = async () => {
        try {
            setLoading(true);
            setMsg("");

            const response = await api.get(`/products/${id}`);

            const product = response.data;

            console.log("PRODUCT:", product);

            setForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price ?? "",
                category: product.category || "",
                type: product.type || "",
                image: product.image || "",
                stock: product.stock ?? "",
            });

        } catch (error) {
            console.error("Error loading product:", error);

            setMsg(
                error.response?.data?.message ||
                "Failed to load product"
            );

        } finally {
            setLoading(false);
        }
    };

    loadProduct();

}, [id]);


// Handle input change
const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
};


// Update product
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setUpdating(true);
        setMsg("");

        console.log("UPDATED PRODUCT:", form);

        const response = await api.put(
            `/products/update/${id}`,
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

        console.log("UPDATE RESPONSE:", response.data);

        setMsg(
            response.data.message ||
            "Product updated successfully!"
        );

        setTimeout(() => {
            navigate("/admin/products");
        }, 1000);

    } catch (error) {
        console.error("Update error:", error);

        setMsg(
            error.response?.data?.message ||
            "Failed to update product"
        );

    } finally {
        setUpdating(false);
    }
};


if (loading) {
    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2 className="signup-title">
                    Loading Product...
                </h2>
            </div>
        </div>
    );
}


return (
    <div className="signup-page">

        <div className="signup-container">

            <h2 className="signup-title">
                Edit Product
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

                {/* Product Name */}
                <input
                    className="signup-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />


                {/* Description */}
                <textarea
                    className="signup-input"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Product Description"
                    rows="4"
                />


                {/* Price */}
                <input
                    className="signup-input"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    min="0"
                    required
                />


                {/* Category */}
                <input
                    className="signup-input"
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />


                {/* Type */}
                <input
                    className="signup-input"
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Type"
                />


                {/* Image URL */}
                <input
                    className="signup-input"
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                />


                {/* Stock */}
                <input
                    className="signup-input"
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    min="0"
                />


                {/* Update Button */}
                <button
                    type="submit"
                    className="signup-button"
                    disabled={updating}
                >
                    {updating
                        ? "Updating..."
                        : "Update Product"}
                </button>


                {/* Cancel Button */}
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
