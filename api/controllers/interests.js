const Interests = require('../models/interests');
const Questions = require('../models/questions');
const Tasks = require('../models/tasks');
const User = require('../models/users');

exports.createInterest = async (req, res) => {
    const body = req.body
    try {
        let isInterest = await Interests.find({ name: body.name });
        if (isInterest.length >= 1) {
            return res.status(409).json({ message: "This interest already exist: " + body.name });
        }
        const interestDB = await Interests.create(body);
        res.json(interestDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllInterests = async (req, res) => {
    try {
        const interestDB = await Interests.find({ deleted: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            });
        res.json(interestDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllInterestsArchived = async (req, res) => {
    try {
        const interestDB = await Interests.find({ deleted: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            });
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getInterest = async (req, res) => {
    const _id = req.params.id

    try {
        const interestDB = await Interests.findById(_id)
            .populate({
                path: 'creator',
                match: { deleted: false }
            });
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
            .populate({
                path: 'creator',
                match: { deleted: false }
            });
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteInterestSoft = async (req, res) => {
    const _id = req.params.id
    try {
        const interestDB = await Interests.findByIdAndUpdate(_id, { deleted: true }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteInterest = async (req, res) => {
    const _id = req.params.id
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (user instanceof Error) {
            return res.status(409).json({ message: user.message });
        }
        const interestDB = await Interests.findByIdAndDelete({ _id });
        await Questions.updateMany({}, { $pull: { interests: _id } });
        await Tasks.updateMany({}, { $pull: { interests: _id } });
        // TODO: Cascade delete
        res.json(interestDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}