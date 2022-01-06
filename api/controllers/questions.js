const Questions = require('../models/questions');
const Interests = require('../models/interests');
const Answers = require('../models/answers')
const Workgroups = require('../models/workgroups');
const User = require('../models/users');

exports.createQuestion = async (req, res) => {
    try {
        let body = req.body;
        let question = await Questions.find({ name: body.name });
        if (question.length >= 1) {
            return res.status(409).json({ message: "This question already exist" });
        }
        for (let i = 0; i < body.interests.length; i++) {
            let interestName = body.interests[i];
            let interest = await Interests.findOne({ name: interestName });
            if (interest) {
                body.interests[i] = interest._id;
            } else {
                interest = await Interests.create({
                    name: interestName,
                    description: 'Created for "' + body.name + '" question.',
                    creator: body.creator
                });
                body.interests[i] = interest._id;
            }
        }
        // TODO: No guardar antiguas
        const questionsDB = await Questions.create(body)
        res.json(questionsDB)
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.getQuestion = async (req, res) => {
    const _id = req.params.id

    try {
        const questionsDB = await Questions.findById(_id)
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);

    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllQuestions = async (req, res) => {
    try {
        const questionsDB = await Questions.find({ deleted: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllQuestionsPaged = async (req, res) => {
    try {
        const { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [], searchName = null, searchCreator = null, searchType = null, searchInterests = [], searchMode } = req.query;
        let sort = {};
        let searchObject = {
            $and: [
                { deleted: false }
            ]
        }
        if (searchName) searchObject.$and.push({
            $or: [
                { name: { $regex: searchName, $options: 'i' } },
                { description: { $regex: searchName, $options: 'i' } }
            ]
        })
        if (searchCreator) searchObject.$and.push({ creator: searchCreator })
        if (searchType) searchObject.$and.push({ type: searchType })
        if (searchInterests.length != 0) {
            const interestsObject = {
                interests: { [!JSON.parse(searchMode.toLowerCase()) ? '$in' : '$all']: searchInterests }
            }
            searchObject.$and.push(interestsObject)
        }
        sortBy.forEach((key, i) => sort[key] = sortDesc[i] === 'true' ? -1 : 1);
        const questionsDB = await Questions.find({
            $and: [
                { deleted: false }, searchObject
            ]
        })
            .limit(itemsPerPage * 1)
            .skip((page - 1) * itemsPerPage)
            .sort(sort)
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        const count = await Questions.countDocuments({ deleted: false });
        res.json({ items: questionsDB, totalItems: count });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllQuestionsNotCommon = async (req, res) => {
    try {
        const questionsDB = await Questions.find({ deleted: false, common: false })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}
exports.getAllQuestionsCommon = async (req, res) => {
    try {
        const questionsDB = await Questions.find({ deleted: false, common: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAllQuestionsDeleted = async (req, res) => {
    try {
        const questionsDB = await Questions.find({ deleted: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const _id = req.params.id
        let body = req.body;
        let question = await Questions.findById(req.params.id);
        if (question.length >= 1) {
            return res.status(409).json({ message: "This question already exist" });
        }
        let interests = body.interests;
        for (let i = 0; i < interests.length; i++) {
            let interestName = interests[i];
            let interest = await Interests.findOne({ name: interestName });
            if (interest) {
                interests[i] = interest._id;
            } else {
                interest = await Interests.create({
                    name: interestName,
                    description: 'Created for "' + body.name + '" question.',
                    creator: question.creator
                });
                interests = interest._id;
            }
        }
        await Questions.findByIdAndUpdate(_id, {
            $addToSet: {
                interests: {
                    $each: interests
                }
            }
        })
        delete body.interests;
        const questionDb = await Questions.findByIdAndUpdate(_id, body, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionDb)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.updateCommonQuestions = async (req, res) => {
    try {
        const _id = req.params.id
        let body = req.body;
        body.answers.forEach(async answer => {
            const answerDB = await Answers.findOne({ $and: [{ user: _id }, { question: answer.question }] })
            if (!answerDB) {
                await Answers.create({
                    user: _id,
                    question: answer.question,
                    answers: answer.answer,
                    text: answer.text
                })
            } else {
                await Answers.findByIdAndUpdate(answerDB._id, {
                    user: _id,
                    question: answer.question,
                    answers: answer.answer,
                    text: answer.text
                })
            }
            await User.findByIdAndUpdate(_id, {
                $addToSet: {
                    interests: {
                        $each: answer.answer
                    }
                }
            })
        });
        const questionsDB = await Questions.find({ deleted: false, common: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionsDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error })
    }
}

exports.deleteQuestionSoft = async (req, res) => {
    const _id = req.params.id

    try {
        const questionDb = await Questions.findByIdAndUpdate(_id, { deleted: true }, { new: true })
            .populate({
                path: 'creator',
                match: { deleted: false }
            })
            .populate({
                path: 'interests',
                match: { deleted: false }
            });
        res.json(questionDb);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.deleteQuestion = async (req, res) => {
    const _id = req.params.id
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (user instanceof Error) {
            return res.status(409).json({ message: user.message });
        }
        const questionDb = await Questions.findByIdAndDelete({ _id });
        await Workgroups.updateMany({}, { $pull: { questions: _id } });
        // TODO: Cascade delete
        res.json(questionDb);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}

exports.getAnswersById = async (req, res) => {
    try {
        const _id = req.params.id
        const answerDB = await Answers.find({ $and: [{ user: _id }, { deleted: false }] })
            .populate({
                path: 'answers',
                match: { deleted: false }
            });
        res.json(answerDB);
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error });
    }
}