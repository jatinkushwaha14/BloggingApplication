
const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        role: user.role
    };
    const token= JWT.sign(payload, secret, { expiresIn: '1h' });
    return token;
}  

function verifyToken(token) {
    try {
        const decoded = JWT.verify(token, secret);
        return decoded;
    } catch (err) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    generateToken,
    verifyToken
};