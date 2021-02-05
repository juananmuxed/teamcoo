const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const interestsController = require("../controllers/interests")

// Create Interest

router.post("/", auth , interestsController.createInterest )

// Get all Interests

router.get("/", auth , interestsController.getAllInterests)

// Get Interest by id

router.get("/:id", auth , interestsController.getInterest)

// Update Interest

router.put("/:id", auth , interestsController.updateInterest)

// Delete Interest

router.delete("/:id", auth ,interestsController.deleteInterest)

module.exports = router;