const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['ORDER', 'PRODUCT_ADD', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'SYSTEM'],
        required: true
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false, // If null, it might be a broadcast or specifically for 'admin' role, but better to be specific or use a role field.
        // Let's use a dual approach: either a specific user ID OR a role.
    },
    recipientRole: {
        type: String,
        enum: ['admin', 'vendor', 'all'], // 'admin' means all admins see it.
        required: false
    },
    referenceId: {
        type: mongoose.Schema.ObjectId,
        required: false
    },
    link: {
        type: String, // URL to redirect to (e.g., /orders/123)
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
