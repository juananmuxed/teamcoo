const express = require("express");
const router = express.Router();

import auth from '../controllers/auth'
import workinggroupsController from '../controllers/workinggroups'

// Create working group

router.post("/create", auth , workinggroupsController.createWG );

// Get all working groups

router.get("/all", auth , workinggroupsController.getAllWG);

// Get id working group

router.get("/:id", auth , workinggroupsController.getWG)

// Update working group

router.put("/:id", auth , workinggroupsController.updateWG)

// Delete working group

router.delete("/:id", auth ,workinggroupsController.deleteWG)

module.exports = router;