const mongoose = require('mongoose')

const tokenScheme = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 60 * 60
    }
});

const Token = mongoose.model("Token", tokenScheme);
module.exports = Token;
