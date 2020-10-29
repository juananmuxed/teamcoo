const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const interestsController = require("../controllers/interests")

// Create Interest

router.post("/create", auth , interestsController.createInterest )

// Get all Interests

router.get("/all", auth , interestsController.getAllInterests)

// Get Interest by id

router.get("/interest/:id", auth , interestsController.getInterest)

// Update Interest

router.put("/interest/:id", auth , interestsController.updateInterest)

// Delete Interest

router.delete("/interest/:id", auth ,interestsController.deleteInterest)

module.exports = router;