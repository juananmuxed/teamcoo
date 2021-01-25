import router from '@/router'
import Axios from 'axios'
import Cookies from 'js-cookie'
import Vuetify from '../../plugins/vuetify'

const state = {
    password: {
        oldpassword: '',
        newpassword: '',
        confirmnewpassword: '',
        oldshow: false,
        newshow: false,
        confshow: false
    },
    del: {
        password: '',
        show: false,
        del: ''
    },
    loginuser: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        rol: {},
        id: '',
        image: '',
        verifiedemail: null,
        logged: false,
        dark: false,
        workgroups: [],
        unsuscribedworkgroups: [],
        membership:{},
        emailconfig:[]
    },
    user: {
        passshow: false,
        password: '',
        email: '',
    },
    newuser: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordconfirm: '',
        passshow: false,
        bevolunteer: false,
        verifiedemail: false,
        accept: {
            termsconditions: false,
            privacycookiepolicy: false
        }
    },
    usersloaded:[]
}

const mutations = {
    userStore: (state, user) => {
        state.loginuser.username = user.data.username,
            state.loginuser.firstname = user.data.firstname,
            state.loginuser.lastname = user.data.lastname,
            state.loginuser.email = user.data.email,
            state.loginuser.rol = user.data.rol,
            state.loginuser.id = user.data._id,
            state.loginuser.image = user.data.image,
            state.loginuser.verifiedemail = user.data.verifiedemail,
            state.loginuser.logged = true,
            state.loginuser.workgroups = user.data.workgroups,
            state.loginuser.unsuscribedworkgroups = user.data.unsuscribedworkgroups,
            state.loginuser.membership = user.data.membership,
            state.loginuser.emailconfig = user.data.emailconfig
    },
    verifiedEmailOk: (state) => { state.loginuser.verifiedemail = true },
    checkVolunteer: (state) => { state.newuser.bevolunteer = true },
    clearUser: (state) => {
        state.loginuser.username = '',
            state.loginuser.firstname = '',
            state.loginuser.lastname = '',
            state.loginuser.email = '',
            state.loginuser.rol = {},
            state.loginuser.image = '',
            state.loginuser.verifiedemail = null,
            state.loginuser.emailconfig = [],
            state.loginuser.id = '',
            state.loginuser.logged = false,
            state.loginuser.workgroups = [],
            state.loginuser.unsuscribedworkgroups = [],
            state.loginuser.membership = {}
    },
    onOffLights: (state) => {
        state.loginuser.dark = !state.loginuser.dark,
            Vuetify.framework.theme.dark = state.loginuser.dark
    },
    clearpass: (state) => {
        state.password.oldpassword = '',
            state.password.newpassword = '',
            state.password.confirmnewpassword = '',
            state.password.oldshow = false,
            state.password.newshow = false,
            state.password.confshow = false
    }
}

const getters = {
    isvalid(state, getters, rootState) {
        if (state.user.password != '' && state.user.email != '' && !rootState.general.rules.emailrules(state.user.email)[0]) {
            return false
        }
        else { return true }
    },
    signUpIsValid(state, getters, rootState) {
        if (state.newuser.firstname != '' &&
            state.newuser.lastname != '' &&
            state.newuser.password != '' &&
            state.newuser.passwordconfirm != '' &&
            state.newuser.accept.privacycookiepolicy &&
            state.newuser.accept.termsconditions &&
            state.newuser.passwordconfirm == state.newuser.password &&
            !rootState.general.rules.emailrules(state.newuser.email)[0] &&
            !rootState.general.rules.nospaces(state.newuser.password)[0]) {
            return false
        }
        else { return true }
    },
    deleteIsValid(state) {
        if (state.del.del == 'DELETE' && state.del.password != '') {
            return false
        }
        else { return true }
    },
    isLogged(state) {
        if (state.loginuser.logged) {
            return true
        }
        else {
            return false
        }
    },
    isChangePass(state) {
        if (state.password.oldpassword != '' && state.password.newpassword != '' && state.password.confirmnewpassword != '' && state.password.confirmnewpassword == state.password.newpassword) {
            return false
        }
        else {
            return true
        }
    },
    isDiferentPass(state) {
        if (state.password.newpassword != '' && state.password.confirmnewpassword != '' && state.password.confirmnewpassword == state.password.newpassword) {
            return false
        }
        else {
            return true
        }
    }

}

const actions = {
    async signup({ state, commit, dispatch }) {
        try {
            let user = state.newuser
            if (state.newuser.bevolunteer) {
                user.rol = { name: 'Volunteer', value: 'volu' }
            }
            user.username = state.newuser.firstname.toLowerCase() + '_' + state.newuser.lastname.toLowerCase()
            let response = await Axios.post("/users/signup", user);
            let token = response.data.token;
            if (token) {
                Cookies.set("catapa-jwt", token, { expires: 30 });
                await dispatch('userData');
                router.push('/dashboard');
                commit('menu/notification', ['success', 3, 'Correct registration. Welcome to Catapa, ' + response.data.data.firstname + '. Please verify your mail.'], { root: true });
            }
            else {
                commit('menu/notification', ['error', 5, 'Error: Something Went Wrong'], { root: true });
            }
        }
        catch (err) {
            let error = err.response;
            if (error.status == 409) {
                commit('menu/notification', ['error', 5, 'Error: ' + error.data.message], { root: true });

            } else {
                commit('menu/notification', ['error', 5, 'Error: ' + error.data.message], { root: true });
            }
        }
    },
    async login({ state, commit, dispatch }) {
        try {
            let response = await Axios.post("/users/login", state.user)
            let token = response.data.token;
            if (Cookies.get("catapa-jwt") == undefined) {
                Cookies.set("catapa-jwt", token, { expires: 30 });
            }
            if (token) {
                await dispatch('userData');
                commit('menu/cancelDialog', 'login', { root: true });
                commit('menu/notification', ['success', 3, 'Correct Login. Welcome ' + response.data.user.username], { root: true });
                router.push('/dashboard');
            }
            else {
                commit('menu/notification', ['error', 3, 'Server error. Try again.'], { root: true });
            }
        } catch (err) {
            commit('menu/notification', ['error', 3, 'Incorrect login.'], { root: true });
        }
    },
    async logOut({ commit }) {
        try {
            Cookies.remove('catapa-jwt')
            Cookies.remove('teamcoo-catapa-userdata')
            commit('menu/cancelDialog', 'logout', { root: true })
            commit('clearUser')
            router.push('/');
            commit('menu/notification', ['success', 3, 'You are correctly log out.'], { root: true })
        } catch (err) {
            commit('menu/notification', ['error', 3, 'Error: Something Went Wrong.'], { root: true })
        }
    },
    async userData({ commit }) {
        try {
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.get("/users/me", config)
                .then(res => {
                    commit('userStore', res);
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
        }
    },
    changepasswordnotlogged({ state, commit }, token) {
        let data = {
            token: token,
            password: state.password.confirmnewpassword
        }
        Axios.post("/tokens/changepassexternal", data)
            .then(() => {
                commit('menu/notification', ['primary', 3, 'Changed password for your account. You can Login with the new password.'], { root: true })
                router.push('/login')
            })
            .catch(error => {
                commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
            })
    },
    sendResetPassMail({ commit }, email) {
        Axios.post("/tokens/sendpassemail", { email: email })
            .then(() => {
                commit('menu/notification', ['primary', 3, 'An email send to ' + email + '. Please check your account.'], { root: true })
                router.push('/')
            })
            .catch(error => {
                commit('menu/notification', ['error', 3, 'Something Went Wrong: ' + error.response.data.message], { root: true })
            })
    },
    sendVerificationMail({ commit }, email) {
        Axios.post("/tokens/resend", { email: email })
            .then(() => {
                commit('menu/notification', ['primary', 3, 'Verification email send to ' + email + '. Please check your account.'], { root: true });
            })
            .catch(error => {
                let color = ''
                switch (error.response.data.type) {
                    case 'not-verified':
                        color = 'error'
                        break;
                    case 'not-user':
                        color = 'error'
                        break;
                    default:
                        break;
                }
                commit('menu/notification', [color, 3, 'Something Went Wrong: ' + error.response.data.message], { root: true });
            })
    },
    verifyEmail({ commit }, token) {
        Axios.post("/tokens/confirmation", { token: token })
            .then(() => {
                setTimeout(() => {
                    router.push('/dashboard');
                }, 6000);
                commit('verifiedEmailOk')
                commit('menu/alert', ['primary', 'Your email is now verified. Thanks a lot. In a few seconds you are redirected to your Dashboard or Login.', 'fas fa-smile-wink'], { root: true })
            })
            .catch(error => {
                let icon = 'fas fa-frown-open'
                let color = ''
                switch (error.response.data.type) {
                    case 'not-verified':
                        icon = 'fas fa-angry'
                        color = 'error'
                        break;

                    case 'not-user':

                        icon = 'fas fa-sad-tear'
                        color = 'error'
                        break;

                    case 'already-verified':

                        icon = 'fas fa-laugh-wink'
                        break;

                    default:
                        break;
                }
                commit('menu/alert', [color, error.response.data.message, icon], { root: true });
            })
    },
    async changepassword({ state, commit }) {
        try {
            let id = state.loginuser.id
            let token = Cookies.get("catapa-jwt")
            let user = {
                email: state.loginuser.email,
                newpassword: state.password.newpassword,
                password: state.password.oldpassword
            }
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            await Axios.put("/users/password/" + id, user, config)
                .then(() => {
                    commit('menu/notification', ['primary', 3, 'Changed password Succesfully'], { root: true });
                    commit('clearpass');
                    commit('menu/cancelDialog', 'changepassword', { root: true });
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
        }
    },
    goToSignin({ rootState }) {
        if (rootState.menu.menu.dialogs.login) {
            rootState.menu.menu.dialogs.login = false
        }
        router.push('/signup')
    },
    goToRemeberme({ rootState }) {
        if (rootState.menu.menu.dialogs.login) {
            rootState.menu.menu.dialogs.login = false
        }
        router.push('/sendreset')
    },
    goToSignUpAsVolunteer({ commit }) {
        router.push('/signup')
        commit('checkVolunteer')
    },
    async deleteAccount({ state, commit }) {
        try {
            let id = state.loginuser.id
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                },
                data: {
                    email: state.loginuser.email,
                    password: state.del.password
                }
            }
            await Axios.delete("/users/" + id, config)
                .then(() => {
                    commit('menu/cancelDialog', 'deleteaccount', { root: true });
                    commit('menu/notification', ['primary', 3, 'Deleted User. Bye, bye!!'], { root: true });
                    commit('clearUser')
                    Cookies.remove('catapa-jwt')
                    router.push('/');
                })
                .catch(error => {
                    commit('menu/notification', ['error', 3, error.response.data.message], { root: true });
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message]);
        }
    },
    async suscribeto({ state, commit, dispatch }, { id, answers }) {
        try {
            let user = state.loginuser
            let isWG = user.unsuscribedworkgroups.some(wg => wg._wgId === id)
            if (isWG) {
                let indexExtracted = await user.unsuscribedworkgroups.findIndex(wg => wg._wgId === id)
                user.unsuscribedworkgroups.splice(indexExtracted, 1)
            }
            let wg = {
                _wgId: id,
                suscribedDate: Date.now(),
                answers: answers
            }
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            dispatch('actions/joinWG',{idWG:id,idUsers:[state.loginuser.id]},{root:true})
            user.workgroups.push(wg)
            await Axios.put("/users/" + user.id, user, config)
                .then(res => {
                    dispatch('actions/loadWG', null, { root: true })
                    commit('userStore', res)
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
        }
    },
    async unsuscribeto({ state, commit, dispatch }, { id }) {
        try {
            let isWG = state.loginuser.workgroups.some(wg => wg._wgId === id)
            if (isWG) {
                let extractedItem = await state.loginuser.workgroups.find(wg => wg._wgId === id)
                let indexExtracted = await state.loginuser.workgroups.findIndex(wg => wg._wgId === id)
                state.loginuser.unsuscribedworkgroups.push(extractedItem)
                state.loginuser.workgroups.splice(indexExtracted, 1)
            }
            let user = state.loginuser
            let token = Cookies.get("catapa-jwt")
            let config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
            dispatch('actions/unjoinWG',{idWG:id,idUsers:[state.loginuser.id]},{root:true})
            await Axios.put("/users/" + user.id, user, config)
                .then(res => {
                    dispatch('actions/loadWG', null, { root: true })
                    commit('userStore', res)
                })
        } catch (error) {
            commit('menu/notification', ['error', 3, error.response.data.message], { root: true })
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