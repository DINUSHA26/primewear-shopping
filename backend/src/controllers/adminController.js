const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a vendor directly (Admin)
// @route   POST /api/v1/admin/vendors
// @access  Private (Admin)
const registerVendor = async (req, res) => {
    const { name, email, password, phoneNumber, address, garmentName, businessRegNumber } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'vendor',
            phoneNumber,
            address,
            garmentDetails: {
                garmentName,
                businessRegNumber,
                isApproved: true // Automatically approved if created by admin
            }
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveVendor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        user.garmentDetails.isApproved = true;
        user.garmentDetails.rejectionReason = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Vendor approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject vendor
// @route   PUT /api/v1/admin/users/:id/reject
// @access  Private (Admin)
const rejectVendor = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'vendor') {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        user.garmentDetails.isApproved = false;
        user.garmentDetails.rejectionReason = reason;
        await user.save();

        res.status(200).json({ success: true, message: 'Vendor rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVendors = await User.countDocuments({ role: 'vendor' });
        const totalProducts = await Product.countDocuments();
        const allOrders = await Order.find();
        const totalOrdersCount = allOrders.length;

        // Calculate total revenue from all orders
        const totalRevenue = allOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        // 1. Revenue Trends (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueTrends = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Best Selling Items
        const bestSellingItems = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    totalSold: { $sum: "$orderItems.quantity" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // 3. Top Performing Vendors
        const topVendors = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.vendor",
                    totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'vendorDetails' } },
            { $unwind: "$vendorDetails" },
            {
                $project: {
                    name: "$vendorDetails.garmentDetails.garmentName",
                    totalSales: 1,
                    orderCount: 1
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalVendors,
                totalProducts,
                totalOrders: totalOrdersCount,
                totalRevenue,
                revenueTrends,
                bestSellingItems,
                topVendors
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    registerVendor,
    approveVendor,
    rejectVendor,
    getStats
};
