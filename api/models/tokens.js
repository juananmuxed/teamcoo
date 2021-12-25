const mongoose = require('mongoose')

const tokenScheme = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Token = mongoose.model("Token", tokenScheme);
module.exports = Token;
