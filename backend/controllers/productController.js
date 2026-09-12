import Product from "../models/product.js";
// Create a new product
export const CreateProduct = async (req, res) => {
    try {

        // Create product and save logged-in user's ID
        const newProduct = await Product.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({
            message: "Product Created successfully",
            product: newProduct,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });

    }
};


// Get all products with search, category and type filter
export const getProducts = async (req, res) => {
    try {

        const { search, category, type } = req.query;

        let filter = {};

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by type
        if (type) {
            filter.type = type;
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });

    }
};


// Get products added by logged-in user
export const getMyProducts = async (req, res) => {
    try {

        const products = await Product.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });


        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });

    }
};


// Update a product
export const updateProduct = async (req, res) => {
    try {

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updated,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });

    }
};


// Delete a product
export const deleteProduct = async (req, res) => {
    try {

        const deleted = await Product.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Product deleted successfully",
            product: deleted,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });

    }
};

