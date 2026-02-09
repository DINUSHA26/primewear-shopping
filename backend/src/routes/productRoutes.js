const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Basic protection check for filtering inside controller, but accessible to public
const { protectOptional } = require('../middleware/authMiddleware');

router.route('/')
    .get(protectOptional, getProducts)
    .post(protect, authorize('vendor', 'admin'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('vendor', 'admin'), updateProduct)
    .delete(protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
