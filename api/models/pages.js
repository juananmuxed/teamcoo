const mongoose = require('mongoose')
const schema = mongoose.Schema

const pageSchema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    _lastEdit: {
        type: Date,
        default: Date.now
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
})

const page = mongoose.model('Page', pageSchema)

module.exports = page