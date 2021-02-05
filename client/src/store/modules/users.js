import Axios from 'axios'
import Cookies from 'js-cookie'
import Vuetify from '../../plugins/vuetify'
import { generatePalette } from '../../utils/utils'
import globalConfig from '../../config/config.json'

const state = {
    users: [],
    loadedUser: {},
    temporaluser: {},
    notEditUser: {
        firstname: '',
        lastname: '',
        username: '',
        image: '',
        imagefile: null,
        rol: {},
        emailconfig:[]
    },
    editUser: {
        firstname: '',
        lastname: '',
        id: '',
        username: '',
        image: '',
        imagefile: null,
        save: false,
        emailconfig:[],
        rol: {}
    }
}

const mutations = {
    usersLoad: (state, users) => { state.users = users },
    userLoad: (state, user) => { state.loadedUser = user},
    userToEdit: (state, user) => {
        state.editUser.firstname = user.firstname,
            state.editUser.lastname = user.lastname,
            state.editUser.rol = user.rol,
            state.editUser.username = user.username,
            state.editUser.image = user.image,
            state.editUser.emailconfig = user.emailconfig,
            state.editUser.id = user._id,
            state.notEditUser.firstname = user.firstname,
            state.notEditUser.lastname = user.lastname,
            state.notEditUser.emailconfig = user.emailconfig,
            state.notEditUser.rol = user.rol,
            state.notEditUser.image = user.image,
            state.notEditUser.username = user.username
    },
    undoEdit: (state) => {
        state.editUser.firstname = state.notEditUser.firstname,
            state.editUser.lastname = state.notEditUser.lastname,
            state.editUser.rol = state.notEditUser.rol,
            state.editUser.emailconfig = state.notEditUser.emailconfig,
            state.editUser.username = state.notEditUser.username,
            state.editUser.image = state.notEditUser.image,
            state.editUser.imagefile = null
    },
    temporaluser: (state,user) => {
        state.temporaluser.id = user._id,
        state.temporaluser.avatar = user.image,
        state.temporaluser.firstname = user.firstname,
        state.temporaluser.lastname = user.lastname,
        state.temporaluser.rol = user.rol,
        state.temporaluser.username = user.username,
        state.temporaluser.workgroups = user.workgroups
    },
}

const getters = {
    getRoleColor:() => (role) => {
        let primary = Vuetify.framework.theme.dark ? Vuetify.framework.theme.themes.dark.primary : Vuetify.framework.theme.themes.light.primary;
        let roles = globalConfig.roles;
        let colors = generatePalette(primary, roles.length,10,'down');
        return {
            color:colors.colors[roles.findIndex(a => a.value === role)], 
            textColor:colors.textColors[roles.findIndex(a => a.value === role)]
        }
    },
    isChangeUser(state) {
        if (
            state.editUser.firstname == state.notEditUser.firstname &&
            state.editUser.lastname == state.notEditUser.lastname &&
            state.editUser.rol.value == state.notEditUser.rol.value &&
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
    async loadUsers({ commit, rootState}) {
        try {
            let token = Cookies.get('catapa-jwt');
            let config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
            let res = await Axios.get('/users/',config),
            users = res.data,
            workgroups = rootState.actions.workgroups;
            for (let x = 0; x < users.length; x++) {
                for (let y = 0; y < users[x].workgroups.length; y++) {
                    let wg = workgroups.find(v => v._id == users[x].workgroups[y]._wgId);
                    if(wg) {
                        users[x].workgroups[y].name = wg.name;
                        users[x].workgroups[y].color = wg.color;
                        users[x].workgroups[y].textcolor = wg.textcolor;
                    }
                }
            }
            commit('usersLoad', users);
            
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async loadUsersSilent({ commit, rootState, rootGetters}) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/',config),
            users = res.data,
            workgroups = rootState.actions.workgroups;
            for (let x = 0; x < users.length; x++) {
                for (let y = 0; y < users[x].workgroups.length; y++) {
                    let wg = workgroups.find(v => v._id == users[x].workgroups[y]._wgId);
                    if(wg) {
                        users[x].workgroups[y].name = wg.name;
                        users[x].workgroups[y].color = wg.color;
                        users[x].workgroups[y].textcolor = wg.textcolor;
                    }
                }
            }
            commit('usersLoad', users);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async searchUser({ commit }, userId) {
        try {
            let token = Cookies.get('catapa-jwt');
            let config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
            let res = await Axios.get('/users/' + userId, config);
            commit('userLoad',res.data);
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async loadUserByID({state,commit},userId){
        try {
            let token = Cookies.get("catapa-jwt");
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/" + userId, config)
                .then(res => {
                    state.temporaluser = {}
                    commit('temporaluser', res.data);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async loadUserData({ commit }, user) {
        try {
            let token = Cookies.get('catapa-jwt');
            let config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
            await Axios.get('/users/' + user, config)
                .then(res => {
                    commit('userToEdit', res.data);
                })
                .catch(error => {
                    throw error;
                });
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    async saveEditedData({ commit }, user) {

        if (user.imagefile != null) {
            let formData = new FormData()
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            formData.append('file', user.imagefile)
            await Axios.post('/files/upload', formData, config)
                .then(res => {
                    user.image = globalConfig.global.hostnameApi + '/files/image/' + res.data.file.filename
                })
                .catch(error => {
                    commit('menu/notification', ['error', 10, error], { root: true });
                })
        }
        try {
            let id = user.id
            let token = Cookies.get('catapa-jwt')
            let config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
            await Axios.put('/users/' + id, user, config)
                .then(res => {
                    commit('menu/notification', ['primary', 3, 'Changed data Succesfully'], { root: true });
                    commit('undoEdit');
                    commit('menu/cancelDialog', 'edituser', { root: true });
                    commit('userLoad', res.data);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
                })
        }
        catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message]);
        }
    },
    async deleteUser() {

    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}