import Axios from 'axios'
import { generateRandomColor } from '../../utils/utils'

const state = {
    interests: [],
    interestsNames: [],
    searchedInterest: {},
    interestTemp: {},
    interestForm: {
        name: '',
        loading: false,
        description: '',
        color:''
    },
}

const mutations = {
    loadInterestsNames: (state, interests) => state.interestsNames = interests,
    loadInterests: (state, interests) => state.interests = interests,
    loadTempInterest: (state, interest) => state.interestTemp = interest,
    clearInterestForm: (state) => {
        state.interestForm.name = '',
        state.interestForm.description = '',
        state.interestForm.color = ''
    },
    randomInterestColor:(state) => {
        state.interestForm.color = generateRandomColor(30);
    },
    loadEditedInterest:(state, interest) => {
        state.searchedInterest = interest
        state.interestForm.name = interest.name,
        state.interestForm.description = interest.description,
        state.interestForm.color = interest.color
    }
}

const getters = {
    validInterest: (state) => {
        if (
            state.interestForm.name != '' &&
            state.interestForm.type != '' &&
            state.interestForm.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },
    isEditedInterest: (state) => {
        if(
            state.interestForm.name != state.searchedInterest.name ||
            state.interestForm.description != state.searchedInterest.description ||
            state.interestForm.color.toUpperCase() != state.searchedInterest.color.toUpperCase()
            ) {
            return true
        }
        else {
            return false
        }
    }
}

const actions = {
    async loadInterests({ commit , dispatch, rootState, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/interests/', config)
            let interests = res.data;
            commit('loadInterestsNames', interests.map(a => a.name));
            for (let x = 0; x < interests.length; x++) {
                await dispatch('users/loadUserByID',interests[x]._userId,{root:true})
                interests[x]['creator'] = rootState.users.temporaluser;
            }
            commit('loadInterests', interests);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async createInterest({ commit, dispatch, rootGetters }, interest) {
        try {
            let body = {
                name: interest.name, 
                description: interest.description, 
                _userId: interest.creatorId, 
                color: !interest.color ? generateRandomColor(30) : interest.color
            };
            let config = rootGetters['general/cookieAuth'];
            await Axios.post('/interests/', body, config);
            await dispatch('loadInterests');
            commit('menu/cancelDialog', 'createinterest', { root: true });
            commit('clearInterestForm');
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async saveEditedInterest({ state, commit, dispatch, rootGetters }, id){
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = {
                name: state.interestForm.name,
                description: state.interestForm.description,
                color: state.interestForm.color
            }
            await Axios.put('/interests/' +  id, body, config);
            commit('menu/cancelDialog', 'editinterest', { root: true });
            await dispatch('loadInterests');
            commit('menu/notification', ['info', 3, 'Interest saved'], { root: true });
            commit('clearInterestForm');
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async delInterest( { commit, dispatch, rootGetters } , params) {
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/questions/',config);
            let questions = res.data;
            for (let i = 0; i < questions.length; i++) {
                if(questions[i].type != 'text') {
                    let interests = questions[i].selections;
                    if(interests.some(a => a == params.name)) {
                        let interestUpdate = interests.filter(a => a != params.name)
                        await Axios.put( '/questions/' + questions[i]._id, {selections:interestUpdate}, config );
                    }
                }
            }
            await Axios.delete('/interests/' + params.id, config);
            
            await dispatch('loadInterests');
            commit('menu/notification', ['info', 3, 'Interest Deleted'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 5, error.response.data], { root: true });
        }
    },
    async searchInterest({ state, commit, rootGetters },id){
        try {
            commit('clearInterestForm')
            state.interestForm.loading = true
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/interests/' + id, config)
            let interest = res.data
            commit('loadEditedInterest', interest)
            setTimeout(() => {
                state.interestForm.loading = false;
            }, 400)
        } catch (error) {
            setTimeout(() => {
                state.interestForm.loading = false;
            }, 400)
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    async searchInterestByName({ commit, rootGetters },name){
        try {
            let config = rootGetters['general/cookieAuth']
            let res = await Axios.get('/interests/', config)
            commit('loadTempInterest', res.data.find(i => i.name == name))
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