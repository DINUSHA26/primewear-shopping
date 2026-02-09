const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    images: [{
        type: String, // Store image URLs
    }],
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    subCategory: {
        type: String,
        required: [true, 'Please add a sub-category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock level'],
        default: 0,
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
