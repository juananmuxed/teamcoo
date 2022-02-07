const mongoose = require('mongoose')
const schema = mongoose.Schema

const taskschema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    description: {
        type: String,
        required: [true, 'Required field']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    interests: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }],
        default: []
    },
    workgroups: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workgroup'
        }],
        default: []
    },
    link: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    suscribers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    limit: {
        type: Number,
        required: true 
    },
    secret: {
        type: Boolean,
        default: false
    },
    eventStartDate: {
        type: Date,
        required: true
    },
    eventEndDate: {
        type: Date,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const task = mongoose.model('Task', taskschema)

module.exports = task