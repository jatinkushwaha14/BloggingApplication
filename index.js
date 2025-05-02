require('dotenv').config(); // Load environment variables
const express = require('express');
const { connectDB } = require('./config/db.js');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const userroutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const checkforAuth = require('./middleware/authentication');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userroutes);
app.use(cookieParser());
app.use(checkforAuth('token')); // Middleware to check for authentication

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
app.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});
 
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port", PORT);
});