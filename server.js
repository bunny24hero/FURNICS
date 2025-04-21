








const express = require('express');
//const stripe = require("stripe")("HERE IS YOUR SECRET KEY"); // Replace with your Stripe Secret Key
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const Product = require('./models/Product');
//const cartController = require('./controllers/cartController');
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use(express.static(path.join(__dirname, 'public')));
//Middleware for profile data fetch
app.get('/checkSession', (req, res) => {
    if (req.session.user) {
        res.json({ 
            loggedIn: true, 
            userId: req.session.user.userId, 
            userName: req.session.user.name, 
            userEmail: req.session.user.email 
        });
    } else {
        res.json({ loggedIn: false });
    }
});


// Routes for frontend pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/html/index.html')));
app.get('/loginSignUP', (req, res) => res.sendFile(path.join(__dirname, 'public/html/login.html')));
app.get('/addProduct', (req, res) => res.sendFile(path.join(__dirname, 'public/html/addProduct.html')));
app.get('/allProduct', (req, res) => res.sendFile(path.join(__dirname, 'public/html/productPage.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'public/html/userCheckout.html')));
app.get('/addDetails', (req, res) => res.sendFile(path.join(__dirname, 'public/html/userAddDetails.html')));
app.get('/userProfile', (req, res) => res.sendFile(path.join(__dirname, 'public/html/userProfile.html')));
app.get('/paymentSuccess', (req, res) => res.sendFile(path.join(__dirname, 'public/html/payment-success.html')));
app.get('/paymentCancel', (req, res) => res.sendFile(path.join(__dirname, 'public/html/payment-cancel.html')));
app.get('/userOrderHistory', (req, res) => res.sendFile(path.join(__dirname, 'public/html/myOrders.html')));
app.get('/adminOrderHistory', (req, res) => res.sendFile(path.join(__dirname, 'public/html/order.html')));
app.get('/addProduct', (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") return res.redirect('/loginSignUP');
    res.sendFile(path.join(__dirname, 'public/html/addProduct.html'));
});
app.get('/productDetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/proDetail.html'));
});
app.get("/payment", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/payment.html"));
});
app.get('/UserCart', (req, res) => res.sendFile(path.join(__dirname, 'public/html/userCart.html')));
app.get('/editProduct', (req, res) => res.sendFile(path.join(__dirname, 'public/html/updateProduct.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public/html/contact2.html')));
app.get('/aboutUs', (req, res) => res.sendFile(path.join(__dirname, 'public/html/aboutUs.html')));
app.get('/navigation', (req, res) => res.sendFile(path.join(__dirname, 'public/html/nav.html')));



// User Routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.get('/logout', userController.logout);
// Logout Route (AJAX-friendly)
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: `${req.session?.user?.name || 'User'} Logged Out` });
    });
});

// Product Routes
app.post('/add-product', productController.addProduct);
app.get('/products/:category', productController.getProductsByCategory); // Fetch products by category
app.get('/product/:id', productController.getProductById);
// Product Detail Route
app.get('/productDetail/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Failed to fetch product details" });
    }
});
app.delete('/delete-product/:id', productController.deleteProduct);
app.put('/update-product/:productId', productController.updateProduct);


app.post("/create-checkout-session", async (req, res) => {
    try {
        const { cart, totalAmount } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const lineItems = cart.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100), // Convert price to paisa
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            // success_url: "http://localhost:3000/payment?status=success",
            success_url: "http://localhost:3000/payment?paymentSuccess=true"
            // cancel_url: "http://localhost:3000/payment?status=failed",
        });

        console.log("Stripe Checkout Session Created:", session.id); // Debugging

        res.json({ id: session.id });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: "Failed to create Stripe session" });
    }
});



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));























