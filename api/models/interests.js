const mongoose = require('mongoose')
const schema = mongoose.Schema

const interestschema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    description: {
        type: String,
        required: [true, 'Required field']
    },
    color: {
        type: String,
        default: '#B1B1B1'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const interest = mongoose.model('Interest', interestschema)

module.exports = interest