const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const workinggroupsController = require("../controllers/workinggroups")

// Create working group

router.post("/", auth , workinggroupsController.createWG );

// Get all working groups

router.get("/", auth , workinggroupsController.getAllWG);

// Get id working group

router.get("/:id", auth , workinggroupsController.getWG)

// Update working group

router.put("/:id", auth , workinggroupsController.updateWG)

// Delete working group

router.delete("/:id", auth ,workinggroupsController.deleteWG)

module.exports = router;