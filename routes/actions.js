const express = require("express");
const router = express.Router();

import auth from '../controllers/auth'
import actionsController from '../controllers/actions'

// Create action

router.post("/create", auth , actionsController.createAction );

// Get all actions

router.get("/all", actionsController.getAllActions);

// Get action by id

router.get("/action/:id", actionsController.getAction)

// Update action

router.put("/action/:id", auth , actionsController.updateAction)

// Delete action

router.delete("/action/:id", auth ,actionsController.deleteAction)

module.exports = router;