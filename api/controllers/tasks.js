const Tasks = require('../models/tasks');
const Workgroups = require('../models/workgroups');

exports.createTask = async (req, res) => {
    const body = req.body
    try {
        let isTask = await Tasks.find({ name: body.name });
        if (isTask.length >= 1) {
            return res.status(409).json({ message: "This Task already exist" });
        }
        const taskDB = await Tasks.create(body)
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const taskDB = await Tasks.find({ deleted: false, secret: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllSecretTasks = async (req, res) => {
    try {
        const taskDB = await Tasks.find({ deleted: false, secret: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllTasksDeleted = async (req, res) => {
    try {
        const taskDB = await Tasks.find({ deleted: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getTask = async (req, res) => {
    const _id = req.params.id

    try {
        const taskDB = await Tasks.findById(_id)
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        if (!taskDB) {
            return res.status(404).json({ message: 'Invalid ID' })
        }
        res.json(taskDB)

    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updateTask = async (req, res) => {
    const _id = req.params.id
    const body = req.body

    try {
        const taskDB = await Tasks.findByIdAndUpdate(_id, body, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteTaskSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const taskDB = await Tasks.findByIdAndUpdate(_id, { deleted: true }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        await Workgroups.updateMany({}, { $pull: { tasks: _id } });
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteTask = async (req, res) => {
    const _id = req.params.id
    try {
        const taskDB = await Tasks.findByIdAndDelete({ _id });
        await Workgroups.updateMany({}, { $pull: { tasks: _id } });
        // TODO: Cascade delete
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.joinTask = async (req, res) => {
    const _id = req.params.id
    try {
        const userId = req.body.user;
        const taskDB = await Tasks.findByIdAndUpdate(_id, {
            $push: { suscribers: userId }
        }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.unjoinTask = async (req, res) => {
    const _id = req.params.id
    try {
        const userId = req.body.user;
        const taskDB = await Tasks.findByIdAndUpdate(_id, {
            $pull: { suscribers: userId }
        }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            })
            .populate({
                path: 'workgroups',
                match: { deleted: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(taskDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}