const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload product images
// @route   POST /api/v1/upload/products
// @access  Private (Vendor/Admin)
router.post('/products', protect, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        // Generate URLs for uploaded files
        const imageUrls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
        });

        res.status(200).json({
            success: true,
            count: imageUrls.length,
            data: imageUrls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
