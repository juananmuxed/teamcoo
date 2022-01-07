const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const userController = require("../controllers/users")

router.post("/signup", userController.createUser);

router.post("/login", userController.loginUser);

router.get("/", auth, userController.getAllUsers);

router.get("/paged", auth, userController.getAllUsersPaged);

router.get("/usersByName/:name", auth, userController.getUserByString);

router.get("/archived/", auth, userController.getAllUsersDeleted);

router.get("/:id", auth, userController.getUser)

router.put("/:id", auth, userController.updateUser)

router.put("/password/:id", auth, userController.updatePassword)

router.delete("/finally/:id", auth, userController.deleteUser)

router.delete("/:id", auth, userController.deleteUserSoft)

module.exports = router;