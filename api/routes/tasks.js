const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const tasksController = require("../controllers/tasks");

router.post("/", auth, tasksController.createTask);

router.get("/", auth, tasksController.getAllTasks);

router.get("/workgroup/:id", auth, tasksController.getAllTasksByWorkgroup);

router.get("/user/:id", auth, tasksController.getAllTasksByUser);

router.get("/paged", auth, tasksController.getAllTasksPaged);

router.get("/archived/", auth, tasksController.getAllTasksDeleted);

router.get("/:id", auth, tasksController.getTask)

router.put("/:id", auth, tasksController.updateTask)

router.put("/join/:id", auth, tasksController.joinTask)

router.put("/unjoin/:id", auth, tasksController.unjoinTask)

router.delete("/finally/:id", auth, tasksController.deleteTask)

router.delete("/:id", auth, tasksController.deleteTaskSoft)

module.exports = router;