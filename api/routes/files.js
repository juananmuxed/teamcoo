const multer = require('multer');

const express = require("express")
const router = express.Router();
const filesController = require('../controllers/files');

const fs = require('fs')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let date = new Date();
        let url = path.join(__dirname, '../uploads/', date.getFullYear().toString(), '/', date.getDate().toString(), '/')
        if (!fs.existsSync(url)) {
            fs.mkdirSync(url, { recursive: true });
        }
        cb(null, url)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilters = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer(
    {
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: fileFilters
    }
);

// Router to upload

router.post('/upload', upload.single('file'), filesController.uploadFile);

module.exports = router