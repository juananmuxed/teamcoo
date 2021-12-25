const mongoose = require('mongoose')

const tokenScheme = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Token = mongoose.model("Token", tokenScheme);
module.exports = Token;
