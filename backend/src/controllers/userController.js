const User = require('../models/User');

// Get all users (supports role filtering)
// GET /api/v1/users?role=customer
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select('-password').sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user
// DELETE /api/v1/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve vendor (toggle isApproved)
// PUT /api/v1/users/:id/approve
exports.approveVendor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'vendor') {
            return res.status(400).json({ success: false, message: 'User is not a vendor' });
        }

        // Toggle approval
        user.garmentDetails.isApproved = !user.garmentDetails.isApproved;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single user
// GET /api/v1/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user
// PUT /api/v1/users/:id
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.address = req.body.address || user.address;

        if (user.role === 'vendor' && req.body.garmentName) {
            user.garmentDetails.garmentName = req.body.garmentName;
        }
        if (user.role === 'vendor' && req.body.businessRegNumber) {
            user.garmentDetails.businessRegNumber = req.body.businessRegNumber;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reject vendor
// PUT /api/v1/users/:id/reject
exports.rejectVendor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'vendor') {
            return res.status(400).json({ success: false, message: 'User is not a vendor' });
        }

        user.garmentDetails.isApproved = false;
        user.garmentDetails.rejectionReason = req.body.reason;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
