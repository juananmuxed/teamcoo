const Workgroups = require('../models/workgroups')

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
        const workgroupDB = await Workgroups.find()
        res.json(workgroupDB)
    } catch (error) {
        res.status(400).json({ message: 'An error has ocurred', error: error });
    }
}

exports.getWorkgroup = async (req, res) => {
    const _id = req.params.id

    try {
        const workgroupDB = await Workgroups.findById(_id, function (err, wg) {
            if (wg == undefined) {
                return res.status(404).json({ message: 'Invalid ID' })
            }
        })
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