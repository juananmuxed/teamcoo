const Questions = require('../models/questions')

exports.createQuestion = async (req, res) => {
    const body = req.body
    try {
        let isQuestion = await Questions.find({ name: body.name });
        if (isQuestion.length >= 1) {
            return res.status(409).json({ message: "This question already exist" });
        }
        const questionsDB = await Questions.create(body)
        res.json(questionsDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.loadQuestion = async (req, res) => {
    const _id = req.params.id

    try {
        const questionsDB = await Questions.findById(_id)
        res.json(questionsDB)

    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.loadAllQuestions = async (req, res) => {
    try {
        const questionsDB = await Questions.find()
        res.json(questionsDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updateQuestion = async (req, res) => {
    const _id = req.params.id
    const body = req.body

    try {
        const questionDb = await Questions.findByIdAndUpdate(_id, body, { new: true })
        res.json(questionDb)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteQuestionSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const questionDb = await Questions.findByIdAndUpdate(_id, { deleted: true }, { new: true })
        res.json(questionDb)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteQuestion = async (req, res) => {
    const _id = req.params.id
    try {
        let isQuestion = await Questions.find({ _id: _id });
        if (isQuestion.length < 1) {
            return res.status(409).json({ message: "This question don't exist" });
        }
        const questionDb = await Questions.findByIdAndDelete({ _id })
        res.json(questionDb)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}