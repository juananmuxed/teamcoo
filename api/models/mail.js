const mongoose = require('mongoose')
const schema = mongoose.Schema

const mailSchema = new schema({
    sendTo: {
        type: String,
        required: [true, 'Required field']
    },
    sendFrom: {
        type: String,
        required: [true, 'Required field']
    },
    sendToName: {
        type: String,
        default: ''
    },
    sendFromName: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        default: ''
    },
    sended: {
        type: Boolean,
        default: false
    },
    template: {
        type: String,
        default: ''
    },
    html: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    response: {
        type: String,
        default: ''
    },
    responseError: {
        type: String,
        default: ''
    },
    sendDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const Mail = mongoose.model('Mail', mailSchema)
module.exports = Mail