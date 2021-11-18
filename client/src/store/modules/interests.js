import Axios from 'axios'
import Vue from 'vue'
import { generateRandomColor } from '../../utils/utils'

const state = {
    interests: [],
    interestsNames: [],
    interest: {},
    interestTemp: {},
    interestForm: {
        name: '',
        loading: false,
        description: '',
        color: ''
    },
    loading: false
}

const mutations = {
    loadInterests: (state, interests) => {
        state.interests = interests;
    },
    loadTempInterest: (state, interest) => {
        Vue.set(state, 'interestTemp', interest);
    },
    clearInterestForm: (state) => {
        state.interestForm.name = '';
        state.interestForm.description = '';
        state.interestForm.color = '';
    },
    randomInterestColor: (state) => {
        state.interestForm.color = generateRandomColor(30);
    },
    loadEditedInterest: (state, interest) => {
        state.interest = interest;
        state.interestForm.name = interest.name;
        state.interestForm.description = interest.description;
        state.interestForm.color = interest.color;
    },
    changeLoading: (state) => {
        state.loading = !state.loading;
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
        if (
            state.interestForm.name != state.interest.name ||
            state.interestForm.description != state.interest.description ||
            state.interestForm.color.toUpperCase() != state.interest.color.toUpperCase()
        ) {
            return true
        }
        else {
            return false
        }
    }
}

const actions = {
    async loadInterests({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/interests/', config)
            let interests = res.data;
            commit('loadInterests', interests);
            commit('changeLoading');
        } catch (error) {
            commit('changeLoading');
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async createInterest({ commit, dispatch, rootGetters }, interest) {
        try {
            let body = {
                name: interest.name,
                description: interest.description,
                creator: interest.creatorId,
                color: interest.color
            };
            let config = rootGetters['general/cookieAuth'];
            await Axios.post('/interests/', body, config);
            await dispatch('loadInterests');
            commit('menu/cancelDialog', 'createinterest', { root: true });
            commit('clearInterestForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async saveEditedInterest({ state, commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let body = {
                name: state.interestForm.name,
                description: state.interestForm.description,
                color: state.interestForm.color
            }
            await Axios.put('/interests/' + id, body, config);
            commit('menu/cancelDialog', 'editinterest', { root: true });
            await dispatch('loadInterests');
            commit('menu/notification', ['info', 3, 'Interest saved'], { root: true });
            commit('clearInterestForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async delInterest({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/interests/finally/' + params.id, config);
            await dispatch('loadInterests');
            commit('menu/notification', ['info', 3, 'Interest permanently removed '], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async delInterestSoft({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/interests/' + params.id, config);

            await dispatch('loadInterests');
            commit('menu/notification', ['info', 3, 'Interest removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async searchInterest({ state, commit, dispatch, rootGetters }, id) {
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