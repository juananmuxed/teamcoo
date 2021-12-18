const Workgroups = require('../models/workgroups')
const Answers = require('../models/answers')

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
        const workgroupDB = await Workgroups.find({ deleted: false, secret: false }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllSecretWorkgroups = async (req, res) => {
    try {
        const workgroupDB = await Workgroups.find({ secret: true, deleted: false }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getAllWorkgroupsDeleted = async (req, res) => {
    try {
        const workgroupDB = await Workgroups.find({ delete: true }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getWorkgroup = async (req, res) => {
    const _id = req.params.id

    try {
        const workgroupDB = await Workgroups.findById(_id).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
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
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, body, { new: true }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.deleteWorkgroupSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const workgroupDB = await Workgroups.findByIdAndUpdate(_id, { deleted: true }, { new: true })
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.deleteWorkgroup = async (req, res) => {
    const _id = req.params.id
    try {
        const workgroupDB = await Workgroups.findByIdAndDelete({ _id })
        res.json(workgroupDB)
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
        }, { new: true }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        answers.forEach(async (answer) => {
            await Answers.create({
                user: userId,
                question: answer.question,
                answers: answer.answers,
                text: answer.text
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
        }, { new: true }).populate('creator').populate('questions').populate('coordinators').populate('members').populate('parent');
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}