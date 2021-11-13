const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const configController = require("../controllers/configuration")

// Create Config

router.post("/", auth, configController.createConfig)

// Get all Configs

router.get("/", auth, configController.getAllConfigs)

// Get Config by name

router.get("/:name", configController.getConfig)

// Get Config protected by name

router.get("/protected/:name", auth, configController.getConfigProtected)

// Update Config

router.put("/:name", auth, configController.updateConfig)

// Delete Config

router.delete("/:name", auth, configController.deleteConfig)

module.exports = router;