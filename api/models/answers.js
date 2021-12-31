const mongoose = require('mongoose')
const schema = mongoose.Schema

const answerScheme = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    workgroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workgroup'
    },
    answers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }],
        default: []
    },
    text: {
        type: String,
        default: ''
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Answer = mongoose.model('Answer', answerScheme)
module.exports = Answer