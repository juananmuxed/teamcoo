const mongoose = require('mongoose')
const schema = mongoose.Schema

const configschema = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    _lastEdit: {
        type: Date,
        default: Date.now
    },
    values: {
        type: Object,
        default: {}
    },
    protected: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const config = mongoose.model('Config', configschema)

module.exports = config