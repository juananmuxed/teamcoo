const Actions = require('../models/actions')

exports.createAction = async (req,res) => {
    const body = req.body
    try {
        let isAction = await Actions.find({ name: body.name });
        if (isAction.length >= 1) {
            return res.status(409).json({message: "This Working Group already exist"});
        }
        const actionDB = await Actions.create(body)
        res.json(actionDB)
    } catch (error) {
        res.status(500).json({message: 'An error has occurred',error})
    }
}

exports.getAllActions = async (req,res) => {
    try {
        const actionDB = await Actions.find()
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.getAction = async (req,res) => {
    const _id = req.params.id

    try {
        const actionDB = await Actions.findById(_id)
        res.json(actionDB)

    } catch (error) {
        return res.status(400).json({message: 'An error has occurred',error })
    }
}

exports.updateAction = async (req,res) => {
    const _id = req.params.id
    const body = req.body

    try { 
        const actionDB = await Actions.findByIdAndUpdate(_id,body,{new:true})
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.deleteAction = async (req,res) => {
    const _id = req.params.id
    try {
        let isAction = await Actions.find({_id:_id});
        if (isAction.length < 1) {
            return res.status(409).json({message: "This action don't exist"});
        }
        const actionDB = await Actions.findByIdAndDelete({_id})
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}