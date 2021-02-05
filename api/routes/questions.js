const express = require("express")
const router = express.Router()

const auth = require("../controllers/auth")
const questionsController = require("../controllers/questions")

// To get an question by ID

router.get('/:id', questionsController.loadQuestion)

// To get all questions

router.get('/', auth , questionsController.loadAllQuestions)

// Create question

router.post('/', auth, questionsController.createQuestion)

// Update question

router.put('/:id', auth, questionsController.updateQuestion)

// Delete question

router.delete('/:id', auth, questionsController.deleteQuestion)

module.exports = router