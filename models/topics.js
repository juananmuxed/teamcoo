import mongoose from 'mongoose'
const schema = mongoose.Schema

const topicschema = new schema({
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

const topic = mongoose.model('Topics' , topicschema)

export default topic