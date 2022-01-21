const mongoose = require('mongoose')
const schema = mongoose.Schema

const questionSchema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: [true, 'Required field']
    },
    interests: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }],
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    common: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const question = mongoose.model('Question', questionSchema)

module.exports = question