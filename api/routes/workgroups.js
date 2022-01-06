const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const workgingGroupsController = require("../controllers/workgroups")

router.post("/", auth, workgingGroupsController.createWorkgroup);

router.get("/", auth, workgingGroupsController.getAllWorkgroups);

router.get("/paged", auth, workgingGroupsController.getAllWorkgroupsPaged)

router.get("/workgroupsByUser/:id", auth, workgingGroupsController.getWorkgroupsByUser);

router.get("/secret/", auth, workgingGroupsController.getAllSecretWorkgroups);

router.get("/secret/paged", auth, workgingGroupsController.getAllSecretWorkgroupsPaged);

router.get("/archived/", auth, workgingGroupsController.getAllWorkgroupsDeleted);

router.get("/:id", auth, workgingGroupsController.getWorkgroup)

router.put("/:id", auth, workgingGroupsController.updateWorkgroup)

router.put("/join/:id", auth, workgingGroupsController.joinWorkgroup)

router.put("/unjoin/:id", auth, workgingGroupsController.unjoinWorkgroup)

router.delete("/finally/:id", auth, workgingGroupsController.deleteWorkgroup)

router.delete("/:id", auth, workgingGroupsController.deleteWorkgroupSoft)

module.exports = router;