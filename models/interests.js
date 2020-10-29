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
    }
})

const interest = mongoose.model('Interests' , interestschema)

module.exports = interest