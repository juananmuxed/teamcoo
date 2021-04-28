const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const configController = require("../controllers/configuration")

// Create Config

router.post("/", auth , configController.createConfig )

// Get all Configs

router.get("/", auth , configController.getAllConfigs )

// Get Config by id

router.get("/:name", auth , configController.getConfig )

// Update Config

router.put("/:name", auth , configController.updateConfig)

// Delete Config

router.delete("/:name", auth , configController.deleteConfig)

module.exports = router;