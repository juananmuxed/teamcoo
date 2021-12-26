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
    answersByUser: [],
    loading: false,
    skeleton: false
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
    }
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
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}