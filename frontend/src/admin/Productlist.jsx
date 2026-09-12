import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../pages/Signup.css";

export default function ProductList() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
// Get all products
const loadProducts = async () => {
    try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        console.log("PRODUCTS:", response.data);

        if (Array.isArray(response.data)) {
            setProducts(response.data);
        } else if (response.data.products) {
            setProducts(response.data.products);
        } else {
            setProducts([]);
        }

    } catch (error) {
        console.error("Error loading products:", error);

        setError(
            error.response?.data?.message ||
            "Failed to load products"
        );

        setProducts([]);

    } finally {
        setLoading(false);
    }
};


// Delete product
const deleteProduct = async (id) => {
    try {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        await api.delete(`/products/delete/${id}`);

        alert("Product deleted successfully!");

        loadProducts();

    } catch (error) {
        console.error("Delete error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to delete product"
        );
    }
};


// Load products
useEffect(() => {
    loadProducts();
}, []);


return (
    <div className="signup-page product-page">

        <div className="product-container">

            {/* Header */}
            <div className="product-header">

                <h2>Product List</h2>

                <Link
                    to="/admin/products/add"
                    className="add-product-btn"
                >
                    + Add New Product
                </Link>

            </div>


            {/* Loading */}
            {loading && (
                <p>Loading products...</p>
            )}


            {/* Error */}
            {!loading && error && (
                <div className="home-error">
                    {error}
                </div>
            )}


            {/* Product Table */}
            {!loading && !error && (
                <div className="table-wrapper">

                    <table className="product-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>

                            {products.length > 0 ? (

                                products.map((product) => (

                                    <tr key={product._id}>

                                        <td>
                                            {product.name}
                                        </td>


                                        <td>
                                            {product.category || "-"}
                                        </td>


                                        <td>
                                            {product.type || "-"}
                                        </td>


                                        <td>
                                            ₹{product.price}
                                        </td>


                                        <td>
                                            {product.stock ?? 0}
                                        </td>


                                        <td className="action-buttons">

                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>


                                            <button
                                                onClick={() =>
                                                    deleteProduct(
                                                        product._id
                                                    )
                                                }
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="no-products"
                                    >
                                        No products found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>

    </div>
);


}
