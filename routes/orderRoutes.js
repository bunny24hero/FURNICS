const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save order after successful COD payment
router.post('/save-order', async (req, res) => {
    const { userEmail, cart, totalAmount, address, pincode, mobile, paymentMethod } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new order object
        const newOrder = {
            cart,
            totalAmount,
            address,
            pincode,
            mobile,
            paymentMethod
        };

        // Add the new order to the user's order history
        user.orders.push(newOrder);
        await user.save();

        res.status(200).json({ message: "Order saved successfully!" });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
