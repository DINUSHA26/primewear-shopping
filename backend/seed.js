const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const adminExists = await User.findOne({ email: 'admin@garment.com' });

        if (adminExists) {
            console.log('Admin already exists');
        } else {
            await User.create({
                name: 'Super Admin',
                email: 'admin@garment.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin created: admin@garment.com / admin123');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
