import Axios from 'axios'
import router from '@/router'
import Vuetify from '../../plugins/vuetify'
import Cookies from 'js-cookie'
import { generatePalette } from '../../utils/utils'

const state = {
    users: [],
    loadedUser: {},
    temporaluser: {},
    notEditUser: {
        firstname: '',
        lastname: '',
        username: '',
        image: '',
        imagefile: null
    },
    editUser: {
        firstname: '',
        lastname: '',
        username: '',
        image: '',
        id: null,
        imagefile: null,
        save: false
    },
    loading: false,
    skeleton: false
}

const mutations = {
    usersLoad: (state, users) => { state.users = users },
    userLoad: (state, user) => { state.loadedUser = user },
    userToEdit: (state, user) => {
        state.editUser.firstname = user.firstname,
            state.editUser.lastname = user.lastname,
            state.editUser.username = user.username,
            state.editUser.image = user.image,
            state.editUser.id = user._id,
            state.notEditUser.firstname = user.firstname,
            state.notEditUser.lastname = user.lastname,
            state.notEditUser.image = user.image,
            state.notEditUser.username = user.username
    },
    undoEdit: (state) => {
        state.editUser.firstname = state.notEditUser.firstname,
            state.editUser.lastname = state.notEditUser.lastname,
            state.editUser.username = state.notEditUser.username,
            state.editUser.image = state.notEditUser.image,
            state.editUser.imagefile = null
    },
    temporaluser: (state, user) => {
        state.temporaluser.id = user._id,
            state.temporaluser.avatar = user.image,
            state.temporaluser.firstname = user.firstname,
            state.temporaluser.lastname = user.lastname,
            state.temporaluser.rol = user.rol,
            state.temporaluser.username = user.username,
            state.temporaluser.workgroups = user.workgroups
    },
    cleanTemporalUser: (state) => state.temporaluser = {},
    changeLoading: (state, loading) => state.loading = loading,
    changeSkeleton: (state, skeleton) => state.skeleton = skeleton
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
            state.editUser.firstname == state.notEditUser.firstname &&
            state.editUser.lastname == state.notEditUser.lastname &&
            state.editUser.username == state.notEditUser.username &&
            state.editUser.image == state.notEditUser.image &&
            state.editUser.imagefile == state.notEditUser.imagefile
        ) {
            return false
        }
        else { return true }
    },
    isValidSave(state, getters, rootState) {
        if (
            !rootState.general.rules.required(state.editUser.firstname)[0] &&
            !rootState.general.rules.required(state.editUser.lastname)[0] &&
            !rootState.general.rules.required(state.editUser.username)[0] &&
            !rootState.general.rules.maxletters(state.editUser.username)[0]
        ) {
            return false
        }
        else {
            return true
        }
    },
}

const actions = {
    async loadUsers({ commit, rootState, rootGetters, dispatch }) {
        try {
            commit('changeLoading', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/', config),
                users = res.data,
                workgroups = rootState.workgroups.workgroups;
            for (let x = 0; x < users.length; x++) {
                let interests = [];
                for (let y = 0; y < users[x].workgroups.length; y++) {
                    let workgroup = users[x].workgroups[y];
                    let wg = workgroups.find(v => v._id == workgroup._wgId);
                    if (wg) {
                        users[x].workgroups[y].name = wg.name;
                        users[x].workgroups[y].color = wg.color;
                        for (let i = 0; i < workgroup.answers.length; i++) {
                            if (Array.isArray(users[x].workgroups[y].answers[i].answer)) {
                                interests = users[x].workgroups[y].answers[i].answer.concat(interests);
                            } else {
                                console.log(users[x].workgroups[y].answers[i])
                                if (!users[x].workgroups[y].answers.includes('Joined by Coordinator/Admin:')) interests.push(users[x].workgroups[y].answers[i].answer);
                            }
                        }
                    }
                }
                for (let i = 0; i < users[x].commonquestions.length; i++) {
                    if (Array.isArray(users[x].commonquestions[i].answer)) {
                        interests = users[x].commonquestions[i].answer.concat(interests);
                    } else {
                        interests.push(users[x].commonquestions[i].answer)
                    }
                }
                users[x].interests = interests.filter((v, i, a) => a.indexOf(v) === i);
            }
            commit('usersLoad', users);
            commit('changeLoading', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeLoading', false);
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
    async searchUser({ commit, dispatch, rootGetters }, userId) {
        try {
            commit('changeSkeleton', true);
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + userId, config);
            commit('userLoad', res.data);
            commit('changeSkeleton', false);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSkeleton', false);
        }
    },
    async loadUserByID({ commit, dispatch, rootGetters }, userId) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get("/users/" + userId, config)
            commit('cleanTemporalUser');
            commit('temporaluser', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async loadUserData({ commit, dispatch, rootGetters }, user) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + user, config);
            commit('userToEdit', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async saveEditedData({ commit, rootState, rootGetters, dispatch }, user) {
        try {
            if (user.imagefile != null) {
                user.image = await dispatch('general/saveFile', user.imagefile, { root: true });
            }
            let id = user.id
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.put('/users/' + id, user, config);
            if (rootState.user.loginuser.id == id) {
                commit('user/userStore', { data: res.data }, { root: true });
            }
            commit('menu/notification', ['primary', 3, 'Changed data Succesfully'], { root: true });
            commit('undoEdit');
            commit('menu/cancelDialog', 'edituser', { root: true });
            commit('userLoad', res.data);
        }
        catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async deleteUser({ rootState, commit, dispatch, rootGetters }, params) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let resTasks = await Axios.get('/tasks/', config);
            let resWorkgroups = await Axios.get('/workgroups/', config)
            let tasks = resTasks.data, workgroups = resWorkgroups.data;
            for (let i = 0; i < tasks.length; i++) {
                console.log('T')
            }
            for (let i = 0; i < workgroups.length; i++) {
                let updatedWorkgroup = {
                    members: workgroups[i].members.filter(a => a != params.id),
                    coordinators: workgroups[i].coordinators.filter(a => a != params.id)
                };
                await Axios.put('/workgroups/' + workgroups[i]._id, updatedWorkgroup, config);
            }
            config.data = {
                email: rootState.user.loginuser.email,
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
                email: rootState.user.loginuser.email,
                password: params.password
            }
            await Axios.delete('/users/' + params.id, config);
            commit('menu/cancelDialog', 'confirmSoft', { root: true });
            Cookies.remove('catapa-jwt')
            Cookies.remove('teamcoo-catapa-userdata')
            commit('menu/cancelDialog', 'logout', { root: true })
            commit('user/clearUser', null, { root: true })
            router.push('/');
            commit('menu/notification', ['success', 3, 'You are succesfully close your account. Goodbye!'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async saveCommonQuestions({ commit, rootGetters, dispatch }, params) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let user = new Object;
            user.commonquestions = params.answers;
            let res = await Axios.put('/users/' + params.idUser, user, config);
            commit('menu/notification', ['primary', 3, 'Common question saved'], { root: true });
            commit('menu/cancelDialog', 'editcommonquestion', { root: true });
            commit('userLoad', res.data);
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