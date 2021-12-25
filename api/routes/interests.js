const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const interestsController = require("../controllers/interests")

router.post("/", auth, interestsController.createInterest)

router.get("/", auth, interestsController.getAllInterests)

router.get("/paged", auth, interestsController.getAllInterestsPaged)

router.get("/archived/", auth, interestsController.getAllInterestsArchived)

router.get("/archived/paged", auth, interestsController.getAllInterestsArchivedPaged)

router.get("/:id", auth, interestsController.getInterest)

router.put("/:id", auth, interestsController.updateInterest)

router.delete("/finally/:id", auth, interestsController.deleteInterest)

router.delete("/:id", auth, interestsController.deleteInterestSoft)

module.exports = router;