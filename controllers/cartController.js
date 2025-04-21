







const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Fetch cart items
exports.getCart = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) return res.status(401).json({ message: "User not authenticated" });

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) return res.status(401).json({ message: "User not authenticated" });

        const { productId, quantity, variant, price } = req.body;

        if (!variant || isNaN(price)) {
            return res.status(400).json({ message: "Invalid product variant or price" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId && item.variant === variant
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, variant, price });
        }

        await cart.save();
        res.json({ message: "Item added to cart successfully!", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
};







// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) return res.status(401).json({ message: "User not authenticated" });

        const { productId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
