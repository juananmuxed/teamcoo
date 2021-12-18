const mongoose = require('mongoose')
const schema = mongoose.Schema

const workgroupScheme = new schema({
    name: {
        type: String,
        required: [true, 'Required field']
    },
    description: {
        type: String,
        required: [true, 'Required field']
    },
    color: {
        type: String,
        default: 'grey'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Workgroup'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    questions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        required: true
    },
    dossier: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    },
    secret: {
        type: Boolean,
        default: false
    },
    coordinators: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const workgroup = mongoose.model('Workgroup', workgroupScheme)

module.exports = workgroup