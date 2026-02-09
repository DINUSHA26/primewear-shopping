const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.countDocuments();
        const vendors = await User.countDocuments({ role: 'vendor' });
        const products = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ status: 'active' });
        const orders = await Order.countDocuments();

        console.log(`SUMMARY: Users:${users}, Vendors:${vendors}, Products:${products}, Active:${activeProducts}, Orders:${orders}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
