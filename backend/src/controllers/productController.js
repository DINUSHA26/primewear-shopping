const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public (filtered by status) / Private (Admin/Vendor sees all/their own)
const getProducts = async (req, res) => {
    try {
        let query;

        // Sorting and Filtering from Query Params
        const { sort, isFeatured } = req.query;

        // If user is logged in, check roles
        if (req.user) {
            if (req.user.role === 'admin') {
                query = Product.find().populate('vendor', 'name email garmentDetails');
            } else if (req.user.role === 'vendor') {
                query = Product.find({ vendor: req.user._id });
            } else {
                // Regular user (Logged In)
                let filter = { status: 'active' };
                if (isFeatured) filter.isFeatured = isFeatured === 'true';
                query = Product.find(filter);
            }
        } else {
            // Public User
            let filter = { status: 'active' };
            if (isFeatured) filter.isFeatured = isFeatured === 'true';
            query = Product.find(filter);
        }

        // Apply Sorting (descending createdAt by default for 'New Arrivals')
        if (sort) {
            const sortStr = sort.split(',').join(' ');
            query = query.sort(sortStr);
        } else {
            query = query.sort('-createdAt');
        }

        const products = await query;
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('vendor', 'name garmentDetails');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Vendor)
const createProduct = async (req, res) => {
    try {
        // Add vendor to req.body
        req.body.vendor = req.user._id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Vendor/Admin)
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Make sure user is product owner (or admin)
        if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Vendor/Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Make sure user is product owner (or admin)
        if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
