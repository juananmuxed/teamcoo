import Axios from 'axios'
import { generateRandomColor } from '../../utils/utils'

const state = {
    interests: [],
    interestsNames: [],
    interest: {},
    interestForm: {
        interest: {
            name: '',
            description: '',
            color: '',
            creator: null
        },
        loading: false,
    },
    search: {
        options: {},
        name: null,
        creator: {}
    },
    totalInterests: 0,
    loading: false,
}

const mutations = {
    loadInterests: (state, interests) => {
        state.interests = interests;
    },
    clearInterestForm: (state) => {
        state.interestForm.interest.name = '';
        state.interestForm.interest.description = '';
        state.interestForm.interest.color = '';
        state.interestForm.interest.creator = null;
        delete state.interestForm.interest._id;
        delete state.interestForm.interest.createdAt;
        delete state.interestForm.interest.updatedAt;
        delete state.interestForm.interest.creator;
    },
    randomInterestColor: (state) => {
        state.interestForm.interest.color = generateRandomColor(30);
    },
    loadEditedInterest: (state, interest) => {
        state.interest = Object.assign({}, interest);
        state.interestForm.interest = Object.assign({}, interest);
    },
    changeLoading: (state) => {
        state.loading = !state.loading;
    },
    setTotalInterest: (state, total) => {
        state.totalInterests = total;
    }
}

const getters = {
    validInterest: (state) => {
        if (
            state.interestForm.interest.name != '' &&
            state.interestForm.interest.type != '' &&
            state.interestForm.interest.description.length <= 380
        ) {
            return false
        }
        else {
            return true
        }
    },

    isEditedInterest: (state) => {
        if (
            state.interestForm.interest.name != state.interest.name ||
            state.interestForm.interest.description != state.interest.description ||
            state.interestForm.interest.creator != state.interest.creator ||
            state.interestForm.interest.color.toUpperCase() != state.interest.color.toUpperCase()
        ) {
            return true
        }
        else {
            return false
        }
    },
}

const actions = {
    async loadInterests({ commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/interests/', config)
            commit('loadInterests', res.data);
            commit('changeLoading');
        } catch (error) {
            commit('changeLoading');
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadInterestPaginated({ state, commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = Object.assign({}, rootGetters['general/cookieAuth']);
            config.params = state.search.options;
            config.params.searchName = state.search.name;
            config.params.searchCreator = state.search.creator?._id;
            let res = await Axios.get('/interests/paged', config);
            commit('loadInterests', res.data.items);
            commit('setTotalInterest', res.data.totalItems);
            commit('changeLoading');
        } catch (error) {
            commit('changeLoading');
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async searchInterest({ state, commit, dispatch }, interest) {
        try {
            commit('clearInterestForm')
            state.interestForm.loading = true
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

    async createInterest({ state, commit, dispatch, rootGetters }, id) {
        try {
            let body = state.interestForm.interest;
            body.creator = id;
            let config = rootGetters['general/cookieAuth'];
            await Axios.post('/interests/', body, config);
            await dispatch('loadInterestPaginated');
            commit('menu/cancelDialog', 'createinterest', { root: true });
            commit('menu/notification', ['info', 3, 'Interest created correctly'], { root: true });
            commit('clearInterestForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEditedInterest({ state, commit, dispatch, rootGetters }, id) {
        try {
            let config = rootGetters['general/cookieAuth'];
            await Axios.put('/interests/' + id, state.interestForm.interest, config);
            commit('menu/cancelDialog', 'editinterest', { root: true });
            await dispatch('loadInterestPaginated');
            commit('menu/notification', ['info', 3, 'Interest saved correctly'], { root: true });
            commit('clearInterestForm');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    // TODO: finally deleted not implemented
    async delInterest({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/interests/finally/' + params.id, config);
            await dispatch('loadInterestPaginated');
            commit('menu/notification', ['info', 3, 'Interest permanently removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async delInterestSoft({ commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth']
            await Axios.delete('/interests/' + params.id, config);
            await dispatch('loadInterestPaginated');
            commit('menu/notification', ['info', 3, 'Interest removed'], { root: true });
            commit('menu/cancelDialog', 'confirm', { root: true });
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