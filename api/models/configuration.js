const mongoose = require('mongoose')
const schema = mongoose.Schema

const configschema = new schema({
    name: {
        type: String, 
        required: [true,'Required field']
    },
    _lastEdit: {
        type:Date,
        default: Date.now
    },
    value: {
        type:String,
        default:''
    },
})

const config = mongoose.model('Config' , configschema)

module.exports = config