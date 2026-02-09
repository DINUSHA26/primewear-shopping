const express = require('express');
const {
    getUsers,
    registerVendor,
    approveVendor,
    rejectVendor,
    getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.post('/vendors', registerVendor);
router.put('/users/:id/approve', approveVendor);
router.put('/users/:id/reject', rejectVendor);
router.get('/stats', getStats);

module.exports = router;
