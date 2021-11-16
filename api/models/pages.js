const mongoose = require('mongoose')
const schema = mongoose.Schema

const pageSchema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    value: {
        type: String,
        default: ''
    },
    position: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'fas fa-question'
    },
    slug: {
        type: String,
        required: [true, 'Required field']
    },
    title: {
        type: String,
        required: [true, 'Required field']
    },
    protected: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const page = mongoose.model('Page', pageSchema)

module.exports = page