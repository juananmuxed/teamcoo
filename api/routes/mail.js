const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const mailer = require("../controllers/mail")

router.post("/send", auth, mailer.sendMail)

module.exports = router;