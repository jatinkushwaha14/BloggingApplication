const router = require('express').Router();
const multer = require('multer');
const path  = require('path');
const Blog = require('../models/blog');
const Comment=require('../models/comments');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/')); // Correct path
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});
  
 const upload = multer({ storage: storage })
router.get('/addblog', (req, res) => {   
    return res.render('addblog',{user: req.user});
});


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy'); 
        const comments = await Comment.find({blogID : req.params.id} ).populate('createdBy');  // Populate createdBy field with user name
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        return res.render('blog', { user: req.user, blog, comments });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
}
);

router.post('/', upload.single('coverimage'), async (req, res) => {
    console.log('req.user:', req.user); // Debugging log
    if (!req.user) {
        return res.status(401).send('Unauthorized: Please log in to create a blog.');
    }

    try {
        const { title, body } = req.body;
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user.id, // Use req.user._id for createdBy
            CovimgURL: `/uploads/${req.file.filename}`,
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});
 
router.post('/comment/:blogID', async (req, res) => {
    console.log(req.body);
    const comment = await Comment.create({
        content: req.body.content,
        blogID: req.params.blogID,
        createdBy: req.user.id,
    })
    return res.redirect(`/blog/${req.params.blogID}`);
});
module.exports=router;