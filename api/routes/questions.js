const express = require("express")
const router = express.Router()

const auth = require("../controllers/auth")
const questionsController = require("../controllers/questions")

router.get('/:id', questionsController.getQuestion)

router.get('/', auth, questionsController.getAllQuestions)

router.get('/answersByUser/:id', auth, questionsController.getAnswersById)

router.get('/archived/', auth, questionsController.getAllQuestionsDeleted)

router.post('/', auth, questionsController.createQuestion)

router.put('/:id', auth, questionsController.updateQuestion)

router.delete('/finally/:id', auth, questionsController.deleteQuestion)

router.delete('/:id', auth, questionsController.deleteQuestionSoft)

module.exports = router