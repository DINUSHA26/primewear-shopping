const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, approveVendor, getUserById, updateUser, rejectVendor } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/reject')
    .put(rejectVendor);

router.route('/:id/approve')
    .put(approveVendor);

module.exports = router;
