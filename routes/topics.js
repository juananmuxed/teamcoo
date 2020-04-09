const express = require("express");
const router = express.Router();

import auth from '../controllers/auth'
import topicsController from '../controllers/topics'

// Create Topic

router.post("/create", auth , topicsController.createTopic );

// Get all Topics

router.get("/all", auth , topicsController.getAllTopics);

// Get Topic by id

router.get("/topic/:id", auth , topicsController.getTopic)

// Update Topic

router.put("/topic/:id", auth , topicsController.updateTopic)

// Delete Topic

router.delete("/topic/:id", auth ,topicsController.deleteTopic)

module.exports = router;