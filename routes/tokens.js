const express = require("express");
const router = express.Router();
import userController from '../controllers/users'

// Confirmation post

router.post("/confirmation", userController.confirmationEmail)

// Resend confirmation post

router.post("/resend", userController.reSendConfirmation)

// Change pass external

router.post("/changepassexternal", userController.changepassexternal)

// Send password change post

router.post("/sendpassemail", userController.sendPassEmail)

module.exports = router;