const Page = require('../models/pages')

exports.creatPage = async (req, res) => {
    const body = req.body
    try {
        let isPage = await Page.find({ name: body.name });
        if (isPage.length >= 1) {
            return res.status(409).json({ message: "This page already exist: " + body.name });
        }
        const pageDB = await Page.create(body)
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllPagesNotProtected = async (req, res) => {
    try {
        const pageDB = await Page.find();
        const filteredPages = pageDB.filter(page => !page.protected)
        res.json(filteredPages)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getAllPagesProtectedOrNot = async (req, res) => {
    try {
        const pageDB = await Page.find()
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getPage = async (req, res) => {
    const name = req.params.name

    try {
        const pageDB = await Page.findOne({ name: name })
        if (pageDB && pageDB.protected) {
            return res.status(401).json({
                message: "Authentification Failed"
            });
        }
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getPageProtected = async (req, res) => {
    const name = req.params.name

    try {
        const pageDB = await Page.findOne({ name: name })
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updatePage = async (req, res) => {
    const name = req.params.name
    const body = req.body

    try {
        const pageDB = await Page.findOneAndUpdate({ name: name }, body, { new: true })
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deletePage = async (req, res) => {
    const name = req.params.name
    try {
        let isPage = await Page.find({ name: name });
        if (isPage.length < 1) {
            return res.status(409).json({ message: "This page don't exist" });
        }
        const pageDB = await Page.findOneAndDelete({ name: name })
        res.json(pageDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}