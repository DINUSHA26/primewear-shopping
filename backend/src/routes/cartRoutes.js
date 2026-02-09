const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, cartController.getCart);
router.post('/sync', protect, cartController.syncCart);
router.post('/update', protect, cartController.updateCart);
router.delete('/clear', protect, cartController.clearCart);

module.exports = router;
