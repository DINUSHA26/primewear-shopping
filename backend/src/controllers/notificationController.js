const Notification = require('../models/Notification');

// Internal Helper: Create Notification
exports.createNotification = async ({
    message,
    type,
    recipient,      // User ID (for specific vendor)
    recipientRole,  // 'admin' (for all admins), 'vendor' (not usually used alone without ID)
    referenceId,
    link
}) => {
    try {
        await Notification.create({
            message,
            type,
            recipient,
            recipientRole,
            referenceId,
            link
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

// API: Get Notifications for Current User
exports.getNotifications = async (req, res) => {
    try {
        const { role, _id } = req.user;

        let query = {};

        if (role === 'admin') {
            // Admins see role='admin' messages AND messages directly sent to them (if any)
            query = {
                $or: [
                    { recipientRole: 'admin' },
                    { recipient: _id }
                ]
            };
        } else if (role === 'vendor') {
            // Vendors see messages sent to their ID
            query = { recipient: _id };
        } else {
            // Customers? Maybe later. For now, empty or specific.
            query = { recipient: _id };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);

        // Count unread
        const unreadCount = await Notification.countDocuments({ ...query, read: false });

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Mark as Read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Mark ALL as Read
exports.markAllAsRead = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let query = {};
        if (role === 'admin') {
            query = { $or: [{ recipientRole: 'admin' }, { recipient: _id }] };
        } else {
            query = { recipient: _id };
        }

        await Notification.updateMany({ ...query, read: false }, { read: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
