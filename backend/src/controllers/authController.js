const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password, role, phoneNumber, address, garmentName, businessRegNumber } = req.body;

    try {
        // පරිශීලකයා දැනටමත් ඉන්නවාදැයි පරීක්ෂා කිරීම
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // අලුත් පරිශීලකයෙකු සෑදීම
        const user = await User.create({
            name,
            email,
            password,
            role,
            phoneNumber,
            address,
            garmentDetails: role === 'vendor' ? { garmentName, businessRegNumber } : {}
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // User සොයා ගැනීම (select('+password') යෙදුවේ model එකේ එය hide කර ඇති නිසා)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Remove password before sending
            const userWithoutPassword = await User.findById(user._id).select('-password');
            res.json({
                user: userWithoutPassword,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};