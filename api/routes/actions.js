const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const actionsController = require("../controllers/actions");

// Create action

router.post("/", auth , actionsController.createAction );

// Get all actions

router.get("/", actionsController.getAllActions);

// Get action by id

router.get("/:id", actionsController.getAction)

// Update action

router.put("/:id", auth , actionsController.updateAction)

// Delete action

router.delete("/:id", auth ,actionsController.deleteAction)

module.exports = router;