import Axios from 'axios'
import { isDiferentArray } from '../../utils/utils'

const state = {
    searchedQuestion:{},
    questions: [],
    questionForm: {
        name: '',
        loading: false,
        type: null,
        description: '',
        selectionsSelected:[],
        types: [
            { text: "Selection from a list", value: 'select' },
            { text: "Multiple checkboxs", value: 'checkbox' },
            { text: "Radio select", value: 'radio' },
            { text: "Open question", value: 'text' }
        ],
        text: '',
        common: false
    },
    commonQuestions:[]
}

const mutations = {
    loadEditedQuestion: (state,question) => {
        state.searchedQuestion = question
        state.questionForm.name = question.name,
        state.questionForm.description = question.description,
        state.questionForm.type = question.type
        state.questionForm.selectionsSelected = question.selections
        state.questionForm.common = question.common
        if(question.type == 'text') {
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
        state.questions = questions
        let tempQuestions = []
        for (let i = 0; i < questions.length; i++) {
            let question = {
                text: questions[i].name,
                value: questions[i]._id,
                type: questions[i].type
            }
            tempQuestions[i] = question
        }
    },
    checkCommonQuestion:state => state.questionForm.common = true,
    updateCommonQuestions: (state, questions) => state.commonQuestions = questions,
}

const getters = {
    validQuestion: (state) => {
        let validating = null
        if(state.questionForm.type != 'text') {
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
        let validating = state.questionForm.type == 'text' ? state.questionForm.text != state.searchedQuestion.selections : isDiferentArray(state.questionForm.selectionsSelected,state.searchedQuestion.selections)
        if(
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
    async createQuestion({ state, commit, dispatch, rootState, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let selections = state.questionForm.selectionsSelected;
            if(state.questionForm.type != 'text') {
                let interests = rootState.interests.interestsNames;
                for (let x = 0; x < selections.length; x++) {
                    if(!interests.some(interest => interest == selections[x])) {
                        await dispatch('interests/createInterest',{ 
                            name:selections[x], 
                            description: 'Created for "' + state.questionForm.name + '" question.',
                            creatorId: userId
                        },{root:true});
                    }
                }
            } else {
                selections = state.questionForm.text
            }
            let body = {
                name: state.questionForm.name,
                description: state.questionForm.description,
                type: state.questionForm.type,
                common: state.questionForm.common,
                _userId: userId,
                selections: selections,
            }
            await Axios.post('/questions/', body, config)
            commit('menu/cancelDialog', 'createquestion', { root: true });
            await dispatch('interests/loadInterests', null, {root:true});
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question created'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            if(!error.message){
                commit('menu/notification', ['error', 5, error.response.data.message], { root: true });
            }
            else{
                commit('menu/notification', ['error', 5, error.message], { root: true });
            }
        }
    },
    async saveEditedQuestion({ state, commit, dispatch, rootState, rootGetters }, id){
        try {
            let config = rootGetters['general/cookieAuth'];
            let selections = state.questionForm.selectionsSelected;
            console.log('arf')
            if(state.questionForm.type != 'text') {
                let interests = rootState.interests.interestsNames;
                for (let x = 0; x < selections.length; x++) {
                    if(!interests.some(interest => interest == selections[x])) {
                        await dispatch('interests/createInterest',{ 
                            name:selections[x], 
                            description: 'Created for "' + state.questionForm.name + '" question.',
                            creatorId: rootState.user.loginuser.id
                        },{root:true});
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
            await Axios.put('/questions/' +  id, body, config);
            commit('menu/cancelDialog', 'editquestion', { root: true });
            await dispatch('interests/loadInterests', null, {root:true});
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question saved'], { root: true });
            commit('clearquestionForm');
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async delQuestion( { commit, dispatch, rootGetters } , params) {
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/workgroups/',config);
            let workgroups = res.data;
            for (let i = 0; i < workgroups.length; i++) {
                let questions = workgroups[i].questions;
                if(questions.some(a => a == params.id)) {
                    let questionsUpdate = questions.filter(a => a != params.id)
                    await Axios.put( '/workgroups/' + workgroups[i]._id, {questions:questionsUpdate}, config );
                }
            }
            await Axios.delete('/questions/' + params.id, config);
            await dispatch('loadQuestions');
            commit('menu/notification', ['info', 3, 'Question Deleted'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data], { root: true });
        }
    },
    async loadQuestions({ commit , dispatch, rootState , rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/questions/', config);
            let allQuestions = res.data
            for (let x = 0; x < allQuestions.length; x++) {
                await dispatch('users/loadUserByID',allQuestions[x]._userId,{root:true})
                allQuestions[x]['creator'] = rootState.users.temporaluser;
                if(allQuestions[x].type != 'text') {
                    let interests = allQuestions[x].selections, tempInterests = Array(interests.length);
                    for (let i = 0; i < interests.length; i++) {
                        await dispatch('interests/searchInterestByName', interests[i],{root:true})
                        tempInterests[i] = rootState.interests.interestTemp;
                    }
                    allQuestions[x]['selections'] = tempInterests;
                }
            }
            let questions = allQuestions.filter(q => !q.common);
            let questionsCommon = allQuestions.filter(q => q.common);
            commit('questionsLoad', questions);
            commit('updateCommonQuestions', questionsCommon);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async searchQuestion({state,commit,dispatch,rootState,rootGetters},id){
        try {
            commit('clearquestionForm')
            state.questionForm.loading = true
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/questions/' + id, config)
            let question = res.data
            await dispatch('users/loadUserByID',question._userId,{root:true})
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
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    async searchQuestionSilent({ commit, rootGetters }, id){
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/questions/' + id, config)
            commit('loadEditedQuestion', res.data)
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
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