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
                match: { deleted: false, secret: false }
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

exports.getAllTasksByWorkgroup = async (req, res) => {
    try {
        const _workgroupId = req.params.id
        const tasksDB = await Tasks.find({
            $and: [
                { deleted: false },
                { workgroups: { $in: [_workgroupId] } }
            ]
        })
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
                match: { deleted: false, secret: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(tasksDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllTasksByUser = async (req, res) => {
    try {
        const _userId = req.params.id
        const tasksDB = await Tasks.find({
            $and: [
                { deleted: false },
                { suscribers: { $in: [_userId] } }
            ]
        })
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
                match: { deleted: false, secret: false }
            })
            .populate({
                path: 'suscribers',
                match: { deleted: false }
            });
        res.json(tasksDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllTasksPaged = async (req, res) => {
    try {
        const { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [], searchName = null, searchCreator = null, searchInterests = [], searchModeInterests, searchWorkgroups = [], searchModeWorkgroups, searchSuscriber = null, searchStatus = null } = req.query;
        let sort = {};
        let searchObject = {
            $and: [
                { deleted: false }
            ]
        }
        if (searchName) searchObject.$and.push({
            $or: [
                { name: { $regex: searchName, $options: 'i' } },
                { description: { $regex: searchName, $options: 'i' } }
            ]
        })
        if (searchCreator) searchObject.$and.push({ creator: searchCreator })
        if (searchSuscriber) searchObject.$and.push({ suscribers: { $in: [searchSuscriber] } })
        if (searchInterests.length != 0) {
            const interestsObject = {
                interests: { [!JSON.parse(searchModeInterests.toLowerCase()) ? '$in' : '$all']: searchInterests }
            }
            searchObject.$and.push(interestsObject)
        }
        if (searchWorkgroups.length != 0) {
            const workgroupsObject = {
                workgroups: { [!JSON.parse(searchModeWorkgroups.toLowerCase()) ? '$in' : '$all']: searchWorkgroups }
            }
            searchObject.$and.push(workgroupsObject)
        }
        sortBy.forEach((key, i) => sort[key] = sortDesc[i] === 'true' ? -1 : 1);
        if (sortBy.length == 0) {
            sort.eventEndDate = 1
        }
        const tasksDB = await Tasks.find({
            $and: [
                { deleted: false }, searchObject
            ]
        })
            .limit(itemsPerPage * 1)
            .skip((page - 1) * itemsPerPage)
            .sort(sort)
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
        const filteredSecret = tasksDB.filter(task => task.workgroups.filter(w => w.secret).length != task.workgroups.length);
        let filteredStatus = filteredSecret;
        if (searchStatus != null) {
            filteredStatus = filteredSecret.filter(task => searchStatus == 1 ? task.suscribers.length >= task.limit : task.suscribers.length < task.limit);
        }
        res.json({ items: filteredStatus, totalItems: filteredStatus.length });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error has occurred', error: error });
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
                match: { deleted: false, secret: false }
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
        const taskSearch = await Tasks.findById(_id);
        if (body.suscribers > taskSearch.limit) {
            return res.status(401).json({ message: "Task limit exceeded" });
        }
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
                match: { deleted: false, secret: false }
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
                match: { deleted: false, secret: false }
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
        const taskSearch = await Tasks.findById(_id);
        if (taskSearch.suscribers.length >= taskSearch.limit) {
            return res.status(401).json({ message: "This task is full" });
        }
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
                match: { deleted: false, secret: false }
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
                match: { deleted: false, secret: false }
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