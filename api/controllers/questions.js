const Questions = require('../models/questions');
const Interests = require('../models/interests');

exports.createQuestion = async (req, res) => {
    try {
        let body = req.body
        let isQuestion = await Questions.find({ name: body.name });
        if (isQuestion.length >= 1) {
            return res.status(409).json({ message: "This question already exist" });
        }
        for (let i = 0; i < body.interests.length; i++) {
            let interest = await Interests.create({
                name: body.interests[i],
                description: 'Created for "' + body.interests[i] + '" question.',
                creator: body.creator
            })
            body.interests[i] = interest._id
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
        const questionsDB = await Questions.findById(_id).populate('creator').populate('interests')
        res.json(questionsDB)

    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.loadAllQuestions = async (req, res) => {
    try {
        const questionsDB = await Questions.find({ deleted: false }).populate('creator').populate('interests')
        console.log(questionsDB)
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
        const questionDb = await Questions.findByIdAndDelete({ _id })
        res.json(questionDb)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}