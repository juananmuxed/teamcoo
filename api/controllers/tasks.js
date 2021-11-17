const Tasks = require('../models/tasks')

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
        const taskDB = await Tasks.find()
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getTask = async (req, res) => {
    const _id = req.params.id

    try {
        const taskDB = await Tasks.findById(_id)
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
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteTaskSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const taskDB = await Tasks.findByIdAndUpdate(_id, { deleted: true }, { new: true })
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteTask = async (req, res) => {
    const _id = req.params.id
    try {
        let isTask = await Tasks.find({ _id: _id });
        if (isTask.length < 1) {
            return res.status(409).json({ message: "This task don't exist" });
        }
        const taskDB = await Tasks.findByIdAndDelete({ _id })
        res.json(taskDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}