


const Product = require('../models/Product');

// Add a new product
const addProduct = async (req, res) => {
    const { category, name, features, images, variants } = req.body;
    try {
        // Get the last added product to find the last productId
        const lastProduct = await Product.findOne().sort({ _id: -1 });

        // Extract the numerical part of the productId and increment it
        let newId = "P01"; // Default if no product exists
        if (lastProduct && lastProduct.productId) {
            const lastIdNumber = parseInt(lastProduct.productId.substring(1)); // Get number part
            const nextIdNumber = lastIdNumber + 1;
            newId = `P${nextIdNumber.toString().padStart(2, '0')}`; // Format as P01, P02, ...
        }

        // Create the new product with the generated productId
        const newProduct = new Product({ 
            productId: newId,
            category, 
            name, 
            features, 
            images, 
            variants 
        });
        
        await newProduct.save();
        res.json({ message: 'Product added successfully!' });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: 'Error adding product.' });
    }
};

// Fetch products by category
const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        let products;
        if (category === "all") {
            products = await Product.find(); // Fetch all products
        } else {
            products = await Product.find({ category }); // Fetch by category
        }
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: 'Error fetching products.' });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        // const { id } = req.params;
        const { category, name, features, images, variants } = req.body;
        const { productId } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { category, name, features, images, variants },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Error updating product." });
    }
};


// Fetch product by ObjectId
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: 'Error fetching product.' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: 'Error deleting product' });
    }
};



// Add to module.exports
module.exports = { addProduct, getProductsByCategory, getProductById, deleteProduct,updateProduct};
