const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');
require('colors'); // Terminal එකේ පාට පෙන්වීමට

// Config
dotenv.config();

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});