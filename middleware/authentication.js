const {verifyToken} = require('../services/authentication'); 

function checkforAuth(cookie) {
    console.log(cookie);

    return (req, res, next) => {
        const token = req.cookies[cookie];
        // console.log(token);
        if (!token) {
            return next();
        }
        try{
            const payload = verifyToken(token);
            req.user = payload;
        }
        catch(err) {
            console.error(err.message);
            res.clearCookie(cookie);
        }
        return next ();
        
    } 
}
module.exports= checkforAuth;