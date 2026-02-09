const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Check stock availability and decrease stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
            // Decrease stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            orderItems,
            customer: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json({
            success: true,
            data: createdOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Access control: Admin, Customer who placed it, or Vendor who has items in it
        const isCustomer = order.customer._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        const isVendor = order.orderItems.some(item => item.vendor.toString() === req.user._id.toString());

        if (!isCustomer && !isAdmin && !isVendor) {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order found' });
        }

        const { itemId, status } = req.body;

        const item = order.orderItems.find(i => i._id.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        if (item.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }

        item.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id });
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin) or Vendor orders
// @route   GET /api/v1/orders
// @access  Private (Admin/Vendor)
const getOrders = async (req, res) => {
    try {
        let orders;

        if (req.user.role === 'admin') {
            orders = await Order.find().populate('customer', 'name email');
        } else if (req.user.role === 'vendor') {
            // Find orders that contain at least one item from this vendor
            orders = await Order.find({
                'orderItems.vendor': req.user._id
            }).populate('customer', 'name email');

            // Optional: filter orderItems to only show vendor's items in the response
            orders = orders.map(order => {
                const filteredItems = order.orderItems.filter(item => item.vendor.toString() === req.user._id.toString());
                const orderObj = order.toObject();
                orderObj.orderItems = filteredItems;
                return orderObj;
            });
        }

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders
};
