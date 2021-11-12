const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const pagesController = require("../controllers/pages")

// Create page

router.post("/", auth, pagesController.creatPage)

// Get all pages

router.get("/", pagesController.getAllPagesNotProtected)

// Get all pages

router.get("/protected/", auth, pagesController.getAllPagesProtectedOrNot)

// Get page

router.get("/:name", pagesController.getPage)

// Get protected page

router.get("/protected/:name", auth, pagesController.getPageProtected)

// Update page

router.put("/:name", auth, pagesController.updatePage)

// Delete page

router.delete("/:name", auth, pagesController.deletePage)

module.exports = router;