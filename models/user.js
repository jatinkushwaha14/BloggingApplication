const { Schema, model   } = require('mongoose'); 
const { generateToken } = require('../services/authentication');
const mongoose = require('mongoose');
const createHmac = require('crypto');
const Userschema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profile:{
        type: String,
        default: 'public/images/default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, { timestamps: true });

Userschema.pre('save', function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    
    if (this.isModified('password')) {
        const salt= createHmac.randomBytes(16).toString();
        const hashedPassword = createHmac.createHmac('sha256', salt).update(this.password).digest('hex');
        this.password = hashedPassword;
        this.salt = salt; 

    } 
    next(); 
});

Userschema.static('matchpassword', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const salt = user.salt;
    const hashedPassword = user.password; 

    const userhashedPassword = createHmac.createHmac('sha256', salt).update(password).digest('hex');
    if (userhashedPassword === hashedPassword) {
        return generateToken(user);
    } else {
        throw new Error('Wrong password');
    } 
    
});
const User = mongoose.model('User', Userschema);
module.exports = User;