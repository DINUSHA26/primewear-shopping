const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // දින 30ක් වලංගු වේ
    });
};

module.exports = generateToken;