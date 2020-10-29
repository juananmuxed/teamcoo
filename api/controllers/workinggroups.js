const WG = require('../models/workinggroups')

exports.createWG = async (req,res) => {
    const body = req.body
    try {
        let isWG = await WG.find({ name: body.name });
        if (isWG.length >= 1) {
            return res.status(409).json({message: "This Working Group already exist"});
        }
        const actionDB = await WG.create(body)
        res.json(actionDB)
    } catch (error) {
        res.status(500).json({message: 'An error has occurred',error})
    }
}

exports.getAllWG = async (req,res) => {
    try {
        const actionDB = await WG.find()
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.getWG = async (req,res) => {
    const _id = req.params.id

    try {
        const actionDB = await WG.findById(_id,function(err,wg){
            if(wg==undefined){
                return res.status(404).json({message:'Invalid ID'})
            }
        })
        res.json(actionDB)

    } catch (error) {
        return res.status(400).json({message: 'An error has occurred',error })
    }
}

exports.updateWG = async (req,res) => {
    const _id = req.params.id
    const body = req.body

    try { 
        const actionDB = await WG.findByIdAndUpdate(_id,body,{new:true})
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.deleteWG = async (req,res) => {
    const _id = req.params.id
    try {
        const actionDB = await WG.findByIdAndDelete({_id})
        if(!actionDB){
            return res.status(400).json({message: 'ID not found',error})
        }
       res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}