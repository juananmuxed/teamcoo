import Topics from '../models/topics'

exports.createTopic = async (req,res) => {
    const body = req.body
    try {
        let isTopic = await Topics.find({ name: body.name });
        if (isTopic.length >= 1) {
            return res.status(409).json({message: "This topic already exist"});
        }
        const actionDB = await Topics.create(body)
        res.json(actionDB)
    } catch (error) {
        res.status(500).json({message: 'An error has occurred',error})
    }
}

exports.getAllTopics = async (req,res) => {
    try {
        const actionDB = await Topics.find()
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.getTopic = async (req,res) => {
    const _id = req.params.id

    try {
        const actionDB = await Topics.findById(_id)
        res.json(actionDB)

    } catch (error) {
        return res.status(400).json({message: 'An error has occurred',error })
    }
}

exports.updateTopic = async (req,res) => {
    const _id = req.params.id
    const body = req.body

    try { 
        const actionDB = await Topics.findByIdAndUpdate(_id,body,{new:true})
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.deleteTopic = async (req,res) => {
    const _id = req.params.id
    try {
        let isTopic = await Topics.find({_id:_id});
        if (isTopic.length < 1) {
            return res.status(409).json({message: "This topic don't exist"});
        }
        const actionDB = await Topics.findByIdAndDelete({_id})
        res.json(actionDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}