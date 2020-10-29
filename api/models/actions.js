const mongoose = require('mongoose')
const schema = mongoose.Schema

const actionschema = new schema({
    name: {
        type: String, 
        required: [true,'Required field']
    },
    description: {
        type: String, 
        required: [true, 'Required field']
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    interests:{
        type:Array,
        required:true
    },
    workgroups: {
        type:Array,
        required:true
    },
    active: {
        type:Boolean,
        default:true
    },
    creaDate:{
        type: Date,
        default:Date.now
    },
    link:{
        type: String,
        default:''
    },
    image:{
        type: String,
        default:''
    },
    usersjoined:{
        type: Array,
        default:[]
    },
    eventStartDate:{
        type:Date,
        required:true
    },
    eventEndDate:{
        type:Date,
        required:true
    },
    color:{
        type:String,
        default:''
    }
})

const action = mongoose.model('Actions',actionschema)

module.exports = action