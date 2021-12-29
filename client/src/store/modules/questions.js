import Axios from 'axios'
import Vue from 'vue'
import { isDiferentArray } from '../../utils/utils'

const state = {
    question: {},
    questions: [],
    questionForm: {
        question: {
            interests: [],
            name: '',
            type: '',
            description: '',
            common: false
        },
        loading: false,
        types: [
            { text: "Selection from a list", value: 'select' },
            { text: "Multiple checkboxs", value: 'checkbox' },
            { text: "Radio select", value: 'radio' },
            { text: "Open question", value: 'text' }
        ],
    },
    commonQuestions: [],
    notCommonQuestions: [],
    answersByUser: [],
    loading: false,
    skeleton: false,
    answers: [],
    rules: []
}

const mutations = {
    loadEditedQuestion: (state, question) => {
        state.question = Object.assign({}, question);
        state.questionForm.question = Object.assign({}, question);
    },
    clearquestionForm: (state) => {
        Vue.set(state.questionForm, 'question', {
            interests: [],
            name: '',
            type: '',
            description: '',
            common: false
        })
    },
    questionsLoad: (state, questions) => {
        state.questions = questions;
    },
    commonQuestionsLoad: (state, questions) => {
        state.commonQuestions = questions;
    },
    notCommonQuestionsLoad: (state, questions) => {
        state.notCommonQuestions = questions;
    },
    checkCommonQuestion: (state) => {
        state.questionForm.question.common = true
    },
    updateCommonQuestions: (state, questions) => {
        state.commonQuestions = questions
    },
    changeLoading: (state) => {
        state.loading = !state.loading
    },
    changeSkeleton: (state) => {
        state.skeleton = !state.skeleton
    },
    answersByUserLoad: (state, answers) => {
        state.answersByUser = answers;
    },
    setRules: (state, rules) => {
        state.rules = rules;
    },
    setAnswers: (state, answers) => {
        state.answers = answers;
    },
}

const getters = {
    validQuestion: (state) => {
        let validating = state.questionForm.question.type != 'text' ? state.questionForm.question.interests.length != 0 : state.questionForm.question.text != '';
        if (
            state.questionForm.question.name != '' &&
            state.questionForm.question.type != '' &&
            validating &&
            state.questionForm.question.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },

    isEditedQuestion: (state) => {
        let validating = state.questionForm.question.type == 'text' ? state.questionForm.question.text != state.question.text : isDiferentArray(state.questionForm.question.interests, state.question.interests)
        if (
            state.questionForm.question.name != state.question.name ||
            state.questionForm.question.type != state.question.type ||
            state.questionForm.question.description != state.question.description ||
            state.questionForm.question.common != state.question.common ||
            validating
        ) {
            return true
        }
        else {
            return false
        }
    },

    isValidQuestions: (state) => {
        let valid = 0;
        let answers = state.answers;
        state.commonQuestions.forEach((q, index) => {
            let check = q.type != 'text' ? state.rules[index](answers[index].answer) : state.rules[index](answers[index].text);
            if (typeof check == 'boolean') {
                valid++
            }
        });
        return valid == state.commonQuestions.length;
    }
}

const actions = {
    async createQuestion({ state, commit, dispatch, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = state.questionForm.question;
            body.creator = userId;
            body.interests = body.interests.map(interest => interest.name)
            await Axios.post('/questions/', body, config)
            commit('menu/cancelDialog', 'createquestion', { root: true });
            await dispatch('interests/loadInterests', null, { root: true });
            await dispatch('loadQuestions');
            await dispatch('loadCommonQuestions');
            commit('menu/notification', ['info', 3, 'Question created correctly'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEditedQuestion({ state, commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = state.questionForm.question;
            body.interests = body.interests.map(interest => interest.name)
            await Axios.put('/questions/' + id, body, config);
            commit('menu/cancelDialog', 'editquestion', { root: true });
            await dispatch('interests/loadInterests', null, { root: true });
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question saved correctly'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    // TODO: finally deleted not implemented
    async delQuestion({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/questions/finally/' + params.id, config);
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question permanently removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async delQuestionSoft({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/questions/' + params.id, config);
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadQuestions({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/', config);
            commit('questionsLoad', res.data);
            commit('changeLoading');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading');
        }
    },

    async loadCommonQuestions({ commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/common/all', config);
            commit('commonQuestionsLoad', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadNotCommonQuestions({ commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/notcommon/all', config);
            commit('notCommonQuestionsLoad', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async searchQuestion({ state, commit, dispatch }, question) {
        try {
            commit('clearquestionForm');
            state.questionForm.loading = true
            commit('loadEditedQuestion', question)
            setTimeout(() => {
                state.questionForm.loading = false;
            }, 400)
        } catch (error) {
            setTimeout(() => {
                state.questionForm.loading = false;
            }, 400)
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadAnswersByUser({ commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/answersByUser/' + id, config);
            commit('answersByUserLoad', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async createRules({ state, commit, dispatch }) {
        try {
            let rules = state.commonQuestions.map(q => {
                if (q.type == 'text') return (v) => !!v || "Required";
                else if (q.type == 'checkbox') return (v) => v.length != 0 || "Select one at least";
                else if (q.type == 'select') return (v) => v.length != 0 || "Select one";
                else if (q.type == 'radio') return (v) => v.length != 0 || "A selection is required";
            })
            commit('setRules', rules);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async createAnswers({ state, commit, dispatch }) {
        try {
            let answers = state.commonQuestions.map(q => {
                const question = state.answersByUser.find(ans => ans.question == q._id);
                let answers = !question ? [] : question.answers.map(answer => answer._id);
                if (answers.length != 0 && (q.type == 'radio' || q.type == 'select')) {
                    answers = answers[0]
                }
                const text = !question ? '' : question.text;
                return {
                    question: q._id,
                    answer: answers,
                    text: text
                }
            })
            commit('setAnswers', answers);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveCommonQuestions({ state, commit, rootGetters, dispatch }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let answers = state.answers.map(answer => {
                let a = answer;
                if (typeof a.answer === 'string') a.answer = [answer.answer];
                return a;
            })
            await Axios.put('/questions/commonquestions/' + userId, { answers: answers }, config);
            commit('menu/notification', ['primary', 3, 'Common question saved correctly'], { root: true });
            await dispatch('loadAnswersByUser', userId);
            await dispatch('createAnswers');
            commit('menu/cancelDialog', 'editcommonquestion', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}