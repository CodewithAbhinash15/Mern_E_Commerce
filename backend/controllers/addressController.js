import Address from "../models/Address.js";
// SAVE ADDRESS
export const saveAddress = async (req, res) => {
    try {

        const {
            fullName,
            mobile,
            pincode,
            address,
            city,
            state,
            country,
        } = req.body;

        const newAddress = await Address.create({
            user: req.user._id,

            fullName,
            mobile,
            pincode,
            address,
            city,
            state,
            country,
        });

        res.status(201).json({
            message: "Address saved successfully",
            address: newAddress,
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to save address",
            error: error.message,
        });

    }
};


// ===============================
// GET MY ADDRESSES
// ===============================
export const getMyAddresses = async (req, res) => {
    try {

        const addresses = await Address.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            addresses,
        });
        

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch addresses",
            error: error.message,
        });
        

    }
};

// ===============================
// UPDATE ADDRESS
// ===============================

export const updateAddress = async (req, res) => {
    try {

        const { id } = req.params;

        const address = await Address.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found",
            });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Address updated successfully",
            address: updatedAddress,
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update address",
            error: error.message,
        });

    }
};
// ===============================
// DELETE ADDRESS
// ===============================

export const deleteAddress = async (req, res) => {
    try {

        const { id } = req.params;

        const address = await Address.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!address) {
            return res.status(404).json({
                message: "Address not found",
            });
        }

        await Address.findByIdAndDelete(id);

        res.status(200).json({
            message: "Address deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete address",
            error: error.message,
        });

    }
};