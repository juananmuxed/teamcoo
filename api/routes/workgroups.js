const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const workgingGroupsController = require("../controllers/workgroups")

router.post("/", auth, workgingGroupsController.createWorkgroup);

router.get("/", auth, workgingGroupsController.getAllWorkgroups);

router.get("/secret/", auth, workgingGroupsController.getAllSecretWorkgroups);

router.get("/:id", auth, workgingGroupsController.getWorkgroup)

router.put("/:id", auth, workgingGroupsController.updateWorkgroup)

router.delete("/finally/:id", auth, workgingGroupsController.deleteWorkgroup)

router.delete("/:id", auth, workgingGroupsController.deleteWorkgroupSoft)

module.exports = router;