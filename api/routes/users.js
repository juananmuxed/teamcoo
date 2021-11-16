const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const userController = require("../controllers/users")

// Sign in router from controller

router.post("/signup", userController.registerNewUser);

// Login router from controller

router.post("/login", userController.loginUser);

// Return all users

router.get("/", auth, userController.getUsers);

// Return data from user

router.get("/:id", auth, userController.getUser)

// Save data from user

router.put("/:id", auth, userController.updateUser)

// Change Password

router.put("/password/:id", auth, userController.updatePassword)

// Delete Account soft

router.delete("/:id", auth, userController.deleteUserSoft)

// Delete Account

router.delete("/finally/:id", auth, userController.deleteUser)

module.exports = router;