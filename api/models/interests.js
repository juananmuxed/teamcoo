const mongoose = require('mongoose')
const schema = mongoose.Schema

const interestschema = new schema({
    name: {
        type: String, 
        required: [true,'Required field']
    },
    description: {
        type: String, 
        required: [true,'Required field']
    },
    color:{
        type:String,
        default:'grey'
    },
    _userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    active: {
        type:Boolean,
        default:true
    },
})

const interest = mongoose.model('Interests' , interestschema)

module.exports = interest