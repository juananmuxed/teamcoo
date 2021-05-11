const mongoose = require('mongoose')
require('dotenv').config({ path: require('find-config')('.env') });
const Grid = require('gridfs-stream')

const {
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_PORT,
    NODE_ENV,
    WEB_NAME
} = process.env;
  
// Connection mongo
let options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}
  
if(NODE_ENV == 'production') options.user = process.env.MONGO_ROOT_USER;
if(NODE_ENV == 'production') options.pass = process.env.MONGO_ROOT_PASSWORD;
if(NODE_ENV == 'production') options.auth = {authSource:'admin'};
  
const url = `mongodb://${NODE_ENV == 'production' ? WEB_NAME + '-db' : DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

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