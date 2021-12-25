const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: require('find-config')('.env') });

const userScheme = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please include your name']
    },
    email: {
        type: String,
        required: [true, 'Please include your e-mail']
    },
    password: {
        type: String,
        required: [true, 'Please include a password']
    },
    firstName: {
        type: String,
        required: [true, 'Please include your First name']
    },
    lastName: {
        type: String,
        default: ''
    },
    rol: {
        type: Object,
        default: { name: 'User', value: 'user' }
    },
    tokens: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Token'
        }],
        default: [],
        select: false
    },
    accept: {
        termsConditions: {
            type: Boolean,
            required: [true, 'Please accept terms']
        },
        privacyCookiePolicy: {
            type: Boolean,
            required: [true, 'Please accept policy']
        }
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: ''
    },
    membership: {
        type: Object,
        default: { status: 'inactive' }
    },
    interests: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }],
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userScheme.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userScheme.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.username, email: user.email }, process.env.SECRET_STRING);
    return token;
};

userScheme.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email don't exist");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Password error");
        }
        return user;
    } catch (error) {
        return error
    }
};

const User = mongoose.model("User", userScheme);
module.exports = User;