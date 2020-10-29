const mongoose = require('mongoose')
const schema = mongoose.Schema

const workingGroupSchema = new schema({
    name: {
        type: String, 
        required: [true,'Required field']
    },
    description: {
        type: String, 
        required: [true, 'Required field']
    },
    color:{
        type:String,
        default:'grey'
    },
    textcolor:{
        type:String,
        default:'white'
    },
    parent: {
        type:mongoose.Schema.Types.ObjectId,
        default: null
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
    creaDate:{
        type: Date,
        default:Date.now
    },
    questions:{
        type:Array,
        required:true
    },
    dossier:{
        type:String,
        default:null
    },
    linktodocuments:{
        type:String,
        default:null
    },
    secret:{
        type:Boolean,
        default:false
    },
    coordinators:{
        type:Array,
        default:[]
    },
    members:{
        type:Array,
        default:[]
    }
})

const wg = mongoose.model('wg',workingGroupSchema)

module.exports = wg