const express = require("express")
const router = express.Router()

const auth = require("../controllers/auth")
const questionsController = require("../controllers/questions")

router.get('/:id', questionsController.loadQuestion)

router.get('/', auth, questionsController.loadAllQuestions)

router.post('/', auth, questionsController.createQuestion)

router.put('/:id', auth, questionsController.updateQuestion)

router.delete('/finally/:id', auth, questionsController.deleteQuestion)

router.delete('/:id', auth, questionsController.deleteQuestionSoft)

module.exports = router