const express = require("express")
const router = express.Router()

const auth = require("../controllers/auth")
const questionsController = require("../controllers/questions")

router.post('/', auth, questionsController.createQuestion)

router.get('/', auth, questionsController.getAllQuestions)

router.get("/paged", auth, questionsController.getAllQuestionsPaged)

router.get('/notcommon/all', auth, questionsController.getAllQuestionsNotCommon)

router.get('/common/all', auth, questionsController.getAllQuestionsCommon)

router.get('/answersByUser/:id', auth, questionsController.getAnswersById)

router.get('/archived/', auth, questionsController.getAllQuestionsDeleted)

router.get('/:id', questionsController.getQuestion)

router.put('/:id', auth, questionsController.updateQuestion)

router.put('/commonquestions/:id', auth, questionsController.updateCommonQuestions)

router.delete('/finally/:id', auth, questionsController.deleteQuestion)

router.delete('/:id', auth, questionsController.deleteQuestionSoft)

module.exports = router