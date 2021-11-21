const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth")
const pagesController = require("../controllers/pages")

router.post("/", auth, pagesController.creatPage)

router.get("/", pagesController.getAllPagesNotProtected)

router.get("/protected/", auth, pagesController.getAllPagesProtectedOrNot)

router.get("/:name", pagesController.getPage)

router.get("/protected/:name", auth, pagesController.getPageProtected)

router.put("/:name", auth, pagesController.updatePage)

router.delete("/:name", auth, pagesController.deletePage)

module.exports = router;