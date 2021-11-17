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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    interests: {
        type: Array,
        required: true
    },
    workgroups: {
        type: Array,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    link: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    usersjoined: {
        type: Array,
        default: []
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

const task = mongoose.model('Tasks', taskschema)

module.exports = task