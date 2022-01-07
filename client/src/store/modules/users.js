import Axios from 'axios'
import Vuetify from '../../plugins/vuetify'
import { generatePalette, isDiferentArray } from '../../utils/utils'

const state = {
    users: [],
    user: {},
    userForm: {
        user: {

        }
    },
    search: {
        name: null,
        rol: null,
        interests: [],
        interestsAll: false,
        options: {},
    },
    totalUsers: 0,
    loading: false,
    skeleton: false,
    isLoadingUser: false,
    usersByName: []
}

const mutations = {
    usersLoad: (state, users) => {
        state.users = users
    },
    usersByNameLoad: (state, users) => {
        state.usersByName = users;
    },
    userLoad: (state, user) => {
        state.user = user
    },
    loadEditedUser: (state) => {
        state.userForm.user = Object.assign({}, state.user);
        state.userForm.user.imagefile = null;
    },
    changeLoading: (state) => {
        state.loading = !state.loading;
    },
    changeIsLoadingUser: (state) => {
        state.isLoadingUser = !state.isLoadingUser;
    },
    changeSkeleton: (state) => {
        state.skeleton = !state.skeleton
    },
    setTotalUsers: (state, total) => {
        state.totalUsers = total;
    }
}

const getters = {
    getRoleColor: () => (role) => {
        let primary = Vuetify.framework.theme.dark ? Vuetify.framework.theme.themes.dark.primary : Vuetify.framework.theme.themes.light.primary;
        let roles = [
            { name: "User", value: "user" },
            { name: "Volunteer", value: "volu" },
            { name: "Coordinator", value: "coor" },
            { name: "Director", value: "dire" },
            { name: "Admin", value: "admin" }
        ];
        let colors = generatePalette(primary, roles.length, 10, 'down');
        return {
            color: colors.colors[roles.findIndex(a => a.value === role)],
            textColor: colors.textColors[roles.findIndex(a => a.value === role)]
        }
    },

    isChangeUser(state) {
        if (
            state.user.firstName == state.userForm.user.firstName &&
            state.user.lastName == state.userForm.user.lastName &&
            state.user.username == state.userForm.user.username &&
            state.user.image == state.userForm.user.image &&
            state.user.imagefile == state.userForm.user.imagefile &&
            state.user.rol.value == state.userForm.user.rol.value &&
            !isDiferentArray(state.user.interests, state.userForm.user.interests, '_id', '_id')
        ) {
            return false
        }
        else { return true }
    },

    isValidSave(state, getters, rootState) {
        if (
            !rootState.general.rules.required(state.userForm.user.firstName)[0] &&
            !rootState.general.rules.required(state.userForm.user.lastName)[0] &&
            !rootState.general.rules.required(state.userForm.user.username)[0] &&
            !rootState.general.rules.maxletters(state.userForm.user.username)[0]
        ) {
            return false
        }
        else {
            return true
        }
    },
}

const actions = {
    async loadUsers({ commit, dispatch }) {
        try {
            commit('changeLoading');
            await dispatch('loadUsersSilent');
            commit('changeLoading');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading');
        }
    },

    async loadUsersSilent({ commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/', config);
            commit('usersLoad', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async loadUsersPaginated({ state, commit, dispatch, rootGetters }) {
        try {
            commit('changeLoading');
            let config = Object.assign({}, rootGetters['general/cookieAuth']);
            config.params = state.search.options;
            config.params.searchName = state.search.name;
            config.params.searchRol = state.search.rol?.value;
            config.params.searchInterests = state.search.interests.map(i => i._id);
            config.params.searchMode = state.search.interestsAll;
            let res = await Axios.get('/users/paged', config);
            commit('usersLoad', res.data.items);
            commit('setTotalUsers', res.data.totalItems);
            commit('changeLoading');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading');
        }
    },

    async searchUser({ commit, dispatch }, userId) {
        try {
            commit('changeSkeleton');
            await dispatch('searchUserSilent', userId)
            commit('changeSkeleton');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSkeleton');
        }
    },

    async searchUsersByName({ state, rootGetters, commit, dispatch }, string) {
        try {
            if (state.isLoadingUser) return
            if (string && string.trim() === "") return
            if (!string) {
                string = null
            }
            commit('changeIsLoadingUser');
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/name/' + string, config);
            commit('usersByNameLoad', res.data);
            commit('changeIsLoadingUser');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeIsLoadingUser');
        }
    },

    async searchUserSilent({ commit, dispatch, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + userId, config);
            commit('userLoad', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEditedUser({ state, commit, rootState, rootGetters, dispatch }) {
        try {
            let user = state.userForm.user;
            if (user.imagefile != null) {
                user.image = await dispatch('general/saveFile', user.imagefile, { root: true });
            }
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/users/' + user._id, user, config);
            if (rootState.user.loginUser._id == user._id) {
                commit('user/userStore', res.data, { root: true });
            }
            commit('userLoad', res.data);
            commit('menu/cancelDialog', 'edituser', { root: true });
            commit('menu/notification', ['primary', 3, 'User saved correctly'], { root: true });
        }
        catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    // TODO: finally deleted not implemented
    async deleteUser({ rootState, commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth'];
            config.data = {
                email: rootState.user.loginUser.email,
                password: params.password
            }
            await Axios.delete('/users/finally/' + params.id, config);
            commit('menu/cancelDialog', 'confirm', { root: true });
            commit('menu/notification', ['primary', 3, 'Deleted User. Bye, bye!!'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async deleteUserSoft({ rootState, commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth'];
            config.data = {
                email: rootState.user.loginUser.email,
                password: params.password
            }
            let res = await Axios.delete('/users/' + params.id, config);
            commit('menu/cancelDialog', 'confirmSoft', { root: true });
            if (rootState.user.loginUser._id == res.data._id) {
                await dispatch('user/logOut', null, { root: true })
                commit('menu/notification', ['success', 3, 'You are succesfully close your account. Goodbye!'], { root: true });
            } else {
                commit('userLoad', res.data);
            }
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