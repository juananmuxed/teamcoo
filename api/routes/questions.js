const express = require("express")
const router = express.Router()

const auth = require("../controllers/auth")
const questionsController = require("../controllers/questions")

// To get an question by ID

router.get('/question/:id', questionsController.loadQuestion)

// To get all questions

router.get('/all', auth , questionsController.loadAllQuestions)

// Create question

router.post('/create', auth, questionsController.createQuestion)

// Update question

router.put('/question/:id', auth, questionsController.updateQuestion)

// Delete question

router.delete('/question/:id', auth, questionsController.deleteQuestion)

module.exports = router