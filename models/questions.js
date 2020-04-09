import mongoose from 'mongoose'
const schema = mongoose.Schema

const questionSchema = new schema({
    name: {
        type: String, 
        required: [true,'Required field']
    },
    description: {
        type: String, 
        required: [true,'Required field']
    },
    type: {
        type: String, 
        required: [true, 'Required field']
    },
    selections:{
        type: Array
    },
    _userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    active: {
        type:Boolean,
        default:true
    }
})

const question = mongoose.model('question',questionSchema)

export default question