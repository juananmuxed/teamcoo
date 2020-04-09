const express = require("express")
const router = express.Router()
import questionsController from '../controllers/questions'

const auth = require("../controllers/auth")

// To get an question by ID

router.get('/question/:id', questionsController.loadQuestion)

// To get all questions

router.get('/all', auth , questionsController.loadAllQuestions)

// Create question

router.post('/create', auth, questionsController.createQuestion)

// Update question

router.put('/update', auth, questionsController.updateQuestion)

// Delete question

router.delete('/delete', auth, questionsController.deleteQuestion)

module.exports = router