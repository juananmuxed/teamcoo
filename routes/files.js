const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const path = require('path')

const express = require("express")
const router = express.Router()
const url = 'mongodb://localhost:27017/teamcoo'
const filesController = require('../controllers/files')

// Create storage engine

const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                let bucketName
                let filename
                if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'){
                    filename = 'image_' + buf.toString('hex') + '_' + Date.now() + path.extname(file.originalname)
                    bucketName = 'images'
                }
                else{
                    filename = 'upload_' + buf.toString('hex') + '_' + Date.now() + path.extname(file.originalname)
                    bucketName = 'uploads'
                }
                const fileInfo = {
                    filename: filename,
                    bucketName: bucketName
                };
                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({ storage })

// Router to upload

router.post('/upload', upload.single('file'), filesController.uploadFile)

// To get an image by filename

router.get('/image/:filename', filesController.loadImage)

// To get other file

router.get('/upload/:filename', filesController.loadUpload)

module.exports = router