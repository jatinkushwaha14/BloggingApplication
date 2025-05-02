const router = require('express').Router();
const User = require('../models/user');
const path = require('path');   

router.get('/signin', (req, res) => {
    res.render('signin');
}); 
router.get('/signup', (req, res) => {
    res.render('signup');
}); 
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.create({ name, email, password });
        res.redirect('/'); 
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
}); 

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchpassword(email, password); // Call the static method on the User model
        if (token) {
            // console.log(token);
            res.cookie('token',token).redirect('/'); // Redirect to the home page or any other page
        }
    } catch (err) {
        console.error(err.message);
        res.render('signin', { error: 'Invalid email or password' });
    }
});



module.exports = router;