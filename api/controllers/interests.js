const Interests = require('../models/interests')

exports.createInterest = async (req, res) => {
    const body = req.body
    try {
        let isInterest = await Interests.find({ name: body.name });
        if (isInterest.length >= 1) {
            return res.status(409).json({ message: "This interest already exist: " + body.name });
        }
        const interestDB = await Interests.create(body)
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllInterests = async (req, res) => {
    try {
        const interestDB = await Interests.find()
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getInterest = async (req, res) => {
    const _id = req.params.id

    try {
        const interestDB = await Interests.findById(_id)
        res.json(interestDB)

    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updateInterest = async (req, res) => {
    const _id = req.params.id
    const body = req.body

    try {
        const interestDB = await Interests.findByIdAndUpdate(_id, body, { new: true })
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteInterestSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const interestDB = await Interests.findByIdAndUpdate(_id, { deleted: true }, { new: true })
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteInterest = async (req, res) => {
    const _id = req.params.id
    try {
        const interestDB = await Interests.findByIdAndDelete({ _id })
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}