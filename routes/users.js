const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")

import userController from '../controllers/users'

// Sign in router from controller

router.post("/signup", userController.registerNewUser);

// Login router from controller

router.post("/login", userController.loginUser);

// Return user data

router.get("/me", auth, userController.getUserData);

// Return data from user

router.get("/user/:id", auth, userController.getUser)

// Save data from user

router.put("/user/:id", auth, userController.updateUser)

// Change Password

router.put("/user/password/:id", auth, userController.updatePassword)

// Delete Account

router.delete("/user/:id", auth, userController.deleteUser)

module.exports = router;