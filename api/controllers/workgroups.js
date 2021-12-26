const mongoose = require('mongoose')
const Workgroups = require('../models/workgroups')
const Answers = require('../models/answers')
const Tasks = require('../models/tasks')
const User = require('../models/users')

exports.createWorkgroup = async (req, res) => {
    const body = req.body
    try {
        let isWG = await Workgroups.find({ name: body.name });
        if (isWG.length >= 1) {
            return res.status(409).json({ message: "This Working Group already exist" });
        }
        const workgroupDB = await Workgroups.create(body)
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllWorkgroups = async (req, res) => {
    try {
        const workgroupDB = await Workgroups.find({ deleted: false, secret: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllSecretWorkgroups = async (req, res) => {
    try {
        const workgroupDB = await Workgroups.find({ secret: true, deleted: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllWorkgroupsDeleted = async (req, res) => {
    try {
        const workgroupDB = await Workgroups.find({ deleted: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getWorkgroup = async (req, res) => {
    const _id = req.params.id

    try {
        const workgroupDB = await Workgroups.findById(_id)
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        if (!workgroupDB) {
            return res.status(404).json({ message: 'Invalid ID' })
        }
        res.json(workgroupDB)

    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.updateWorkgroup = async (req, res) => {
    const _id = req.params.id
    const body = req.body

    try {
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, body, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.deleteWorkgroupSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, { deleted: true }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.deleteWorkgroup = async (req, res) => {
    const _id = req.params.id
    try {
        const workgroupDB = await Workgroups.findByIdAndDelete({ _id });
        await Tasks.updateMany({}, { $pull: { workgroups: _id } });
        // TODO: Cascade delete
        res.json(workgroupDB);
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.joinWorkgroup = async (req, res) => {
    const _id = req.params.id
    try {
        const userId = req.body.user;
        const answers = req.body.answers;
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, {
            $push: { members: userId }
        }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        answers.forEach(async (answer) => {
            await Answers.create({
                user: userId,
                workgroup: _id,
                question: answer.question,
                answers: answer.answer,
                text: answer.text
            })
            await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    interests: {
                        $each: answer.answer
                    }
                }
            })
        });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.unjoinWorkgroup = async (req, res) => {
    const _id = req.params.id
    try {
        const userId = req.body.user;
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, {
            $pull: { members: userId }
        }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        workgroupDB.questions.forEach(async (question) => {
            await Answers.findOneAndUpdate({ workgroup: workgroupDB._id, question: question._id, deleted: false }, { deleted: true })
        })
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getWorkgroupsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const workgroupDB = await Workgroups.find({ 'members': mongoose.Types.ObjectId(userId) })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'questions',
                match: { deleted: false }
            })
            .populate({
                path: 'coordinators',
                match: { deleted: false }
            })
            .populate({
                path: 'members',
                match: { deleted: false }
            })
            .populate({
                path: 'parent',
                match: { deleted: false }
            });
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}