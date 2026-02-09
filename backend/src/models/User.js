const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // දත්ත ලබාගන්නා විට password එක පෙන්වන්නේ නැත
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer',
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    // Vendor කෙනෙක් නම් පමණක් වැදගත් වන දත්ත
    garmentDetails: {
        garmentName: String,
        businessRegNumber: String,
        brDocument: String, // URL to BR document
        isApproved: {
            type: Boolean,
            default: false, // Admin විසින් අනුමත කරන තෙක් false වේ
        },
        rejectionReason: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Password එක Save කිරීමට පෙර Encrypt කිරීම
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// පාරිභෝගිකයා ඇතුළත් කරන password එක DB එකේ ඇති password එක සමඟ සැසඳීම
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);