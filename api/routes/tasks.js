const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const tasksController = require("../controllers/tasks");

// Create task

router.post("/", auth , tasksController.createTask );

// Get all tasks

router.get("/", tasksController.getAllTasks);

// Get task by id

router.get("/:id", tasksController.getTask)

// Update task

router.put("/:id", auth , tasksController.updateTask)

// Delete task

router.delete("/:id", auth ,tasksController.deleteTask)

module.exports = router;