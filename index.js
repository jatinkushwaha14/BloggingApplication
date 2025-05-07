require('dotenv').config(); // Load environment variables
const express = require('express');
const { connectDB } = require('./config/db.js');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const userroutes = require('./routes/user');
const  blogroutes = require('./routes/blog');
const cookieParser = require('cookie-parser');
const checkforAuth = require('./middleware/authentication');
const Blog = require('./models/blog'); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkforAuth('token')); // Middleware to check for authentication
app.use('/user', userroutes); 
app.use('/blog', blogroutes);
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({ createdAt: -1 }); // Await the query
        res.render('home', { user: req.user, blogs: allBlogs }); // Pass resolved data to the view
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});
 
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port", PORT);
});