const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/confirmation", userController.confirmationEmail)

router.post("/resend", userController.reSendConfirmation)

router.post("/changepassexternal", userController.changePassExternal)

router.post("/sendpassemail", userController.sendPassEmail)

module.exports = router;