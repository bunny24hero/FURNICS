

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController"); // Ensure correct path

// Ensure that the imported functions exist
if (!cartController.addToCart || !cartController.removeFromCart) {
    throw new Error("Cart controller functions are undefined. Check your imports.");
}

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);

module.exports = router;
