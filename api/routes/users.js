const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const userController = require("../controllers/users")

router.post("/signup", userController.registerNewUser);

router.post("/login", userController.loginUser);

router.get("/", auth, userController.getUsers);

router.get("/:id", auth, userController.getUser)

router.put("/:id", auth, userController.updateUser)

router.put("/password/:id", auth, userController.updatePassword)

router.delete("/finally/:id", auth, userController.deleteUser)

router.delete("/:id", auth, userController.deleteUserSoft)

module.exports = router;