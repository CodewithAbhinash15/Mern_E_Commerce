
import Product from "../models/product.js";


// CREATE A NEW PRODUCT
export const CreateProduct = async (req, res) => {
    try {
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



// GET ALL PRODUCTS
// Supports search, category and type

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



// GET SINGLE PRODUCT BY ID

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID or error fetching product",
            error: error.message,
        });
    }
};



// GET MY PRODUCTS
// Login required

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



// UPDATE PRODUCT

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

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


// ==================================
// DELETE PRODUCT
// ==================================
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

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
