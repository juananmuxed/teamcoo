const Config = require('../models/configuration')

exports.createConfig = async (req, res) => {
    const body = req.body
    try {
        let isConfig = await Config.find({ name: body.name });
        if (isConfig.length >= 1) {
            return res.status(409).json({ message: "This config already exist: " + body.name });
        }
        const configDB = await Config.create(body)
        res.json(configDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}

exports.getAllConfigs = async (req, res) => {
    try {
        const configDB = await Config.find()
        res.json(configDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}

exports.getConfig = async (req, res) => {
    const name = req.params.name

    try {
        const configDB = await Config.findOne({ name: name })
        if (configDB && configDB.protected) {
            return res.status(401).json({
                message: "Authentification Failed"
            });
        }
        res.json(configDB)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}

exports.getConfigProtected = async (req, res) => {
    const name = req.params.name

    try {
        const configDB = await Config.findOne({ name: name })
        res.json(configDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}

exports.updateConfig = async (req, res) => {
    const name = req.params.name
    const body = req.body

    try {
        const configDB = await Config.findOneAndUpdate({ name: name }, body, { new: true })
        res.json(configDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}

exports.deleteConfig = async (req, res) => {
    const name = req.params.name
    try {
        let isConfig = await Config.find({ name: name });
        if (isConfig.length < 1) {
            return res.status(409).json({ message: "This interest don't exist" });
        }
        const configDB = await Config.findOneAndUpdate({ _id })
        res.json(configDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred: ' + error, error })
    }
}