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
    answers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interests'
        }],
        default: []
    },
    text: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const Answer = mongoose.model('Answer', answerScheme)
module.exports = Answer