const { verifyToken } = require('../services/authentication'); 

function checkforAuth(cookie) {
    return (req, res, next) => {
        const token = req.cookies[cookie];
        if (!token) {
            res.locals.user = null; // Ensure user is null if no token
            return next();
        }
        try {
            const payload = verifyToken(token); // Verify and decode the token
            req.user = payload; // Attach user info to req.user
            res.locals.user = payload; // Attach user info to res.locals
        } catch (err) {
            console.error(err.message);
            res.clearCookie(cookie); // Clear invalid token
            res.locals.user = null; // Ensure user is null if token is invalid
        }
        return next();
    };
}

module.exports = checkforAuth;