const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const tasksController = require("../controllers/tasks");

router.post("/", auth, tasksController.createTask);

router.get("/", tasksController.getAllTasks);

router.get("/secret/", auth, tasksController.getAllSecretTasks);

router.get("/archived/", auth, tasksController.getAllTasksDeleted);

router.get("/:id", tasksController.getTask)

router.put("/:id", auth, tasksController.updateTask)

router.put("/join/:id", auth, tasksController.joinTask)

router.put("/unjoin/:id", auth, tasksController.unjoinTask)

router.delete("/finally/:id", auth, tasksController.deleteTask)

router.delete("/:id", auth, tasksController.deleteTaskSoft)

module.exports = router;