const express = require('express');
const {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
    .get(authorize('admin', 'vendor'), getOrders)
    .post(authorize('customer'), createOrder);

router.get('/myorders', authorize('customer'), getMyOrders);

router.route('/:id')
    .get(getOrderById);

router.put('/:id/status', authorize('admin', 'vendor'), updateOrderStatus);

module.exports = router;
