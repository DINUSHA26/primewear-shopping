const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Ensure all routes are protected

// GET /api/v1/notifications
router.get('/', getNotifications);

// POST /api/v1/notifications/:id/read
router.put('/:id/read', markAsRead);

// POST /api/v1/notifications/read-all
router.put('/read-all', markAllAsRead);

module.exports = router;
