const Questions = require('../models/questions')

exports.createQuestion = async (req,res) => {
    const body = req.body
    try {
        let isQuestion = await Questions.find({ name: body.name });
        if (isQuestion.length >= 1) {
            return res.status(409).json({message: "This question already exist"});
        }
        const questionsDB = await Questions.create(body)
        res.json(questionsDB)
    } catch (error) {
        res.status(500).json({message: 'An error has occurred',error})
    }
}

exports.loadQuestion = async (req,res) => {
    const _id = req.params.id

    try {
        const questionsDB = await Questions.findById(_id)
        res.json(questionsDB)

    } catch (error) {
        return res.status(400).json({message: 'An error has occurred',error })
    }
}

exports.loadAllQuestions = async (req,res) => {
    try {
        const questionsDB = await Questions.find()
        res.json(questionsDB)
    } catch (error) {
        return res.status(400).json({mensaje: 'An error has occurred',error})
    }
}

exports.updateQuestion = async (req,res) => {

}

exports.deleteQuestion = async (req,res) => {
    const _id = req.params.id
    try {
        let isQuestion = await Questions.find({_id:_id});
        if (isQuestion.length < 1) {
            return res.status(409).json({message: "This question don't exist"});
        }
        const actionDB = await Questions.findByIdAndDelete({_id})
        res.json(actionDB)
    } catch (error) {
        res.status(500).json({message: 'An error has occurred: ' + error , error})
    }
}