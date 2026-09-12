import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login");
            return;

        }


        fetchMyProducts();

    }, []);


    const fetchMyProducts = async () => {

        try {

            const response = await api.get(
                "/products/my-products"
            );

            setProducts(response.data);

        } catch (error) {

            console.error(
                "GET MY PRODUCTS ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };


    if (loading) {

        return (
            <h2 style={{ textAlign: "center" }}>
                Loading...
            </h2>
        );

    }


    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1000px",
                margin: "auto",
            }}
        >

            <h1>My Profile 👤</h1>


            {/* USER INFORMATION */}

            {user && (

                <div
                    style={{
                        marginBottom: "30px",
                    }}
                >

                    <h2>{user.name}</h2>

                    <p>{user.email}</p>

                </div>

            )}


            <button
                onClick={() =>
                    navigate("/admin/products/add")
                }
            >
                Add New Product
            </button>


            <button
                onClick={handleLogout}
                style={{
                    marginLeft: "10px",
                }}
            >
                Logout
            </button>


            <hr />


            <h2>My Added Products</h2>


            {products.length === 0 ? (

                <p>
                    You haven't added any products yet.
                </p>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                    }}
                >

                    {products.map((product) => (

                        <div
                            key={product._id}
                            style={{
                                border:
                                    "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "10px",
                            }}
                        >

                            {product.image && (

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                    }}
                                />

                            )}


                            <h3>
                                {product.name}
                            </h3>


                            <p>
                                ₹ {product.price}
                            </p>


                            <p>
                                {product.description}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

