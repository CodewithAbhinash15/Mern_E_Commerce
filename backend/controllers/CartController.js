import Cart from "../models/Cart.js";


// ========================================
// ADD PRODUCT TO CART
// LOGIN REQUIRED
// ========================================

export const addToCart = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        // Logged-in user ID from JWT
        const userId = req.user._id;


        if (!productId) {

            return res.status(400).json({
                message: "Product ID is required",
            });

        }


        // Find logged-in user's cart
        let cart = await Cart.findOne({
            user: userId,
        });


        // If cart does not exist
        if (!cart) {

            cart = new Cart({

                user: userId,

                items: [
                    {
                        product: productId,
                        quantity: quantity || 1,
                    },
                ],

            });

        } else {

            // Check if product already exists
            const existingItem = cart.items.find(

                (item) =>
                    item.product.toString() ===
                    productId

            );


            if (existingItem) {

                // Increase quantity
                existingItem.quantity +=
                    quantity || 1;

            } else {

                // Add new product
                cart.items.push({

                    product: productId,
                    quantity: quantity || 1,

                });

            }

        }


        await cart.save();


        // Populate product details
        await cart.populate(

            "items.product",

            "name price image description category"

        );


        res.status(200).json({

            message:
                "Product added to cart successfully",

            cart,

        });


    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to add product to cart",

            error: error.message,

        });

    }

};



// ========================================
// GET LOGGED-IN USER CART
// ========================================

export const getCart = async (req, res) => {

    try {

        // Get user from JWT
        const userId = req.user._id;


        const cart = await Cart.findOne({

            user: userId,

        }).populate(

            "items.product",

            "name price image description category"

        );


        if (!cart) {

            return res.status(200).json({

                message: "Cart is empty",

                items: [],

            });

        }


        res.status(200).json({

            message: "Cart fetched successfully",

            cart,

        });


    } catch (error) {

        console.error(
            "Get cart error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch cart",

            error: error.message,

        });

    }

};



// ========================================
// UPDATE PRODUCT QUANTITY
// ========================================

export const updateQuantity = async (
    req,
    res
) => {

    try {

        const { productId, quantity } =
            req.body;


        // Logged-in user ID
        const userId = req.user._id;


        if (!productId || !quantity) {

            return res.status(400).json({

                message:
                    "Product ID and quantity are required",

            });

        }


        if (quantity < 1) {

            return res.status(400).json({

                message:
                    "Quantity must be at least 1",

            });

        }


        const cart = await Cart.findOne({

            user: userId,

        });


        if (!cart) {

            return res.status(404).json({

                message: "Cart not found",

            });

        }


        const item = cart.items.find(

            (item) =>
                item.product.toString() ===
                productId

        );


        if (!item) {

            return res.status(404).json({

                message:
                    "Product not found in cart",

            });

        }


        item.quantity = quantity;


        await cart.save();


        await cart.populate(

            "items.product",

            "name price image description category"

        );


        res.status(200).json({

            message:
                "Quantity updated successfully",

            cart,

        });


    } catch (error) {

        console.error(
            "Update quantity error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update quantity",

            error: error.message,

        });

    }

};



// ========================================
// REMOVE PRODUCT FROM CART
// ========================================

export const removeFromCart = async (
    req,
    res
) => {

    try {

        const { productId } = req.body;


        // Logged-in user ID
        const userId = req.user._id;


        if (!productId) {

            return res.status(400).json({

                message:
                    "Product ID is required",

            });

        }


        const cart = await Cart.findOne({

            user: userId,

        });


        if (!cart) {

            return res.status(404).json({

                message: "Cart not found",

            });

        }


        cart.items = cart.items.filter(

            (item) =>
                item.product.toString() !==
                productId

        );


        await cart.save();


        await cart.populate(

            "items.product",

            "name price image description category"

        );


        res.status(200).json({

            message:
                "Product removed from cart",

            cart,

        });


    } catch (error) {

        console.error(
            "Remove cart item error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to remove product",

            error: error.message,

        });

    }

};

