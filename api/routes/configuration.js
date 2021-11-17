const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const configController = require("../controllers/configuration")

router.post("/", auth, configController.createConfig)

router.get("/", auth, configController.getAllConfigs)

router.get("/:name", configController.getConfig)

router.get("/protected/:name", auth, configController.getConfigProtected)

router.put("/:name", auth, configController.updateConfig)

module.exports = router;