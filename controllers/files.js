import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

// Connection mongo

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const url = 'mongodb://localhost:27017/teamcoo'

// Promises

const conn = mongoose.createConnection(url,options)

// Init gfs

let gfsimages , gfsuploads

conn.once('open', () => {
    gfsimages = Grid(conn.db, mongoose.mongo)
    gfsimages.collection('images')
    gfsuploads = Grid(conn.db, mongoose.mongo)
    gfsuploads.collection('uploads')
})

exports.uploadFile = async (req, res) => {
    if (!req.file) {
        res.status(404).json({ message: 'Empty file' })
    }
    res.json({ file: req.file })
}

exports.loadImage = async (req, res) => {
    gfsimages.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                message: 'No file exists'
            });
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/gif') {
            const readstream = gfsimages.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                message: 'Not an image'
            });
        }
    });
}

exports.loadUpload = async (req, res) => {
    gfsuploads.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                message: 'No file exists'
            });
        }
        if (file.contentType === 'application/pdf') {
            const readstream = gfsuploads.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                message: 'Not a readable archive // PDF'
            });
        }
    });
}