import Axios from 'axios'
import Vue from 'vue'
import { isDiferentArray } from '../../utils/utils'

const state = {
    searchedQuestion: {},
    questions: [],
    questionForm: {
        name: '',
        loading: false,
        type: null,
        description: '',
        selectionsSelected: [],
        types: [
            { text: "Selection from a list", value: 'select' },
            { text: "Multiple checkboxs", value: 'checkbox' },
            { text: "Radio select", value: 'radio' },
            { text: "Open question", value: 'text' }
        ],
        text: '',
        common: false
    },
    commonQuestions: [],
    loading: false,
    skeleton: false
}

const mutations = {
    loadEditedQuestion: (state, question) => {
        state.searchedQuestion = question
        state.questionForm.name = question.name,
            state.questionForm.description = question.description,
            state.questionForm.type = question.type
        state.questionForm.selectionsSelected = question.selections
        state.questionForm.common = question.common
        if (question.type == 'text') {
            state.questionForm.text = question.selections[0]
        }
    },
    clearquestionForm: (state) => {
        state.questionForm.name = '',
            state.questionForm.description = '',
            state.questionForm.type = null,
            state.questionForm.selectionsSelected = [],
            state.questionForm.text = '',
            state.questionForm.common = false
    },
    questionsLoad: (state, questions) => {
        Vue.set(state, 'questions', questions)
    },
    checkCommonQuestion: state => state.questionForm.common = true,
    updateCommonQuestions: (state, questions) => state.commonQuestions = questions,
    changeLoading: (state, loading) => state.loading = loading,
    changeSkeleton: (state, skeleton) => state.skeleton = skeleton
}

const getters = {
    validQuestion: (state) => {
        let validating = null
        if (state.questionForm.type != 'text') {
            validating = state.questionForm.selectionsSelected.length != 0
        } else {
            validating = state.questionForm.text != ''
        }
        if (
            state.questionForm.name != '' &&
            state.questionForm.type != '' &&
            validating &&
            state.questionForm.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },
    isEditedQuestion: (state) => {
        let validating = state.questionForm.type == 'text' ? state.questionForm.text != state.searchedQuestion.selections : isDiferentArray(state.questionForm.selectionsSelected, state.searchedQuestion.selections)
        if (
            state.questionForm.name != state.searchedQuestion.name ||
            state.questionForm.type != state.searchedQuestion.type ||
            state.questionForm.description != state.searchedQuestion.description ||
            state.questionForm.common != state.searchedQuestion.common ||
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
            let body = {
                name: state.questionForm.name,
                description: state.questionForm.description,
                type: state.questionForm.type,
                common: state.questionForm.common,
                creator: userId,
                interests: state.questionForm.selectionsSelected,
                text: state.questionForm.text
            }
            await Axios.post('/questions/', body, config)
            commit('menu/cancelDialog', 'createquestion', { root: true });
            await dispatch('interests/loadInterests', null, { root: true });
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question created'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async saveEditedQuestion({ state, commit, dispatch, rootState, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let selections = state.questionForm.selectionsSelected;
            console.log('arf')
            if (state.questionForm.type != 'text') {
                let interests = rootState.interests.interestsNames;
                for (let x = 0; x < selections.length; x++) {
                    if (!interests.some(interest => interest == selections[x])) {
                        await dispatch('interests/createInterest', {
                            name: selections[x],
                            description: 'Created for "' + state.questionForm.name + '" question.',
                            creatorId: rootState.user.loginuser.id
                        }, { root: true });
                    }
                }
            } else {
                selections = state.questionForm.text
            }
            let body = {
                name: state.questionForm.name,
                description: state.questionForm.description,
                type: state.questionForm.type,
                selections: selections,
                common: state.questionForm.common
            }
            await Axios.put('/questions/' + id, body, config);
            commit('menu/cancelDialog', 'editquestion', { root: true });
            await dispatch('interests/loadInterests', null, { root: true });
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question saved'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async delQuestion({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/workgroups/', config);
            let workgroups = res.data;
            for (let i = 0; i < workgroups.length; i++) {
                let questions = workgroups[i].questions;
                if (questions.some(a => a == params.id)) {
                    let questionsUpdate = questions.filter(a => a != params.id)
                    await Axios.put('/workgroups/' + workgroups[i]._id, { questions: questionsUpdate }, config);
                }
            }
            await Axios.delete('/questions/' + params.id, config);
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question Deleted'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async loadQuestions({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/', config);
            commit('questionsLoad', res.data);
            commit('changeLoading', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading', false);
        }
    },
    async searchQuestion({ state, commit, dispatch, rootState, rootGetters }, id) {
        try {
            commit('clearquestionForm')
            state.questionForm.loading = true
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/questions/' + id, config)
            let question = res.data
            await dispatch('users/loadUserByID', question._userId, { root: true })
            let creator = rootState.users.temporaluser
            question['creator'] = creator
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
    async searchQuestionSilent({ commit, rootGetters, dispatch }, id) {
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/questions/' + id, config)
            commit('loadEditedQuestion', res.data)
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