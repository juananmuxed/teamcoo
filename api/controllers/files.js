exports.uploadFile = async (req, res) => {
    if (!req.file) {
        res.status(404).json({ message: 'Empty file' })
    }
    res.json({ file: req.file })
}