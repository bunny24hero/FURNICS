
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send('User already exists. Please login.');
        }

        // Generate userId by checking the last added user
        const lastUser = await User.findOne().sort({ _id: -1 });
        
        // Extract the numerical part of the userId and increment it
        let newUserId = "U01"; // Default if no user exists
        if (lastUser && lastUser.userId) {
            const lastIdNumber = parseInt(lastUser.userId.substring(1)); // Get number part
            const nextIdNumber = lastIdNumber + 1;
            newUserId = `U${nextIdNumber.toString().padStart(2, '0')}`; // Format as U01, U02, ...
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with the generated userId
        const newUser = new User({ 
            userId: newUserId, 
            name, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        req.session.user = newUser;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during signup.');
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send('User not found. Please sign up first.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send('Incorrect password. Try again.');
        }

        req.session.user = user;
        res.redirect(user.role === "admin" ? '/addProduct' : '/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login.');
    }
};

// Logout Controller
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
};






