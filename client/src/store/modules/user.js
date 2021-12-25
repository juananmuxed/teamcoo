import Vue from 'vue'
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
    loginUser: {},
    userConfigs: {
        logged: false,
        dark: false,
    },
    user: {
        passShow: false,
        password: '',
        email: '',
        loading: false
    },
    newUser: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        passShow: false,
        volunteer: false,
        verifiedEmail: false,
        accept: {
            termsConditions: false,
            privacyCookiePolicy: false
        },
    },
    sendingEmail: false,
    usersloaded: []
}

const mutations = {
    userStore: (state, user) => {
        Vue.set(state, 'loginUser', user);
    },
    changeLogged: (state, logged) => {
        state.userConfigs.logged = logged;
    },
    verifiedEmailOk: (state) => { state.loginUser.verifiedemail = true },
    checkVolunteer: (state) => { state.newUser.volunteer = true },
    clearUser: (state) => {
        state.loginUser = {}
    },
    onOffLights: (state) => {
        state.userConfigs.dark = !state.userConfigs.dark;
        Vuetify.framework.theme.dark = state.userConfigs.dark;
    },
    clearpass: (state) => {
        state.password.oldpassword = '',
            state.password.newpassword = '',
            state.password.confirmnewpassword = '',
            state.password.oldshow = false,
            state.password.newshow = false,
            state.password.confshow = false
    },
    changeSending: (state) => {
        state.sendingEmail = !state.sendingEmail
    },
}

const getters = {
    isvalid(state, getters, rootState) {
        if (state.user.password != '' &&
            state.user.email != '' &&
            !rootState.general.rules.emailrules(state.user.email)[0]
        ) {
            return false
        }
        else { return true }
    },

    signUpIsValid(state, getters, rootState) {
        if (state.newUser.firstName != '' &&
            state.newUser.lastName != '' &&
            state.newUser.password != '' &&
            state.newUser.passwordConfirm != '' &&
            state.newUser.accept.privacyCookiePolicy &&
            state.newUser.accept.termsConditions &&
            state.newUser.passwordConfirm == state.newUser.password &&
            !rootState.general.rules.emailrules(state.newUser.email)[0] &&
            !rootState.general.rules.nospaces(state.newUser.password)[0]) {
            return false
        }
        else { return true }
    },

    isLogged(state) {
        return state.userConfigs.logged
    },

    isChangePass(state) {
        if (state.password.oldpassword != '' &&
            state.password.newpassword != '' &&
            state.password.confirmnewpassword != '' &&
            state.password.confirmnewpassword == state.password.newpassword
        ) {
            return false
        }
        else {
            return true
        }
    },
    isDiferentPass(state) {
        if (state.password.newpassword != '' &&
            state.password.confirmnewpassword != '' &&
            state.password.confirmnewpassword == state.password.newpassword
        ) {
            return false
        }
        else {
            return true
        }
    },
    invalidEmail(state, getters, rootState) {
        return !(!rootState.general.rules.emailrules(state.user.email)[0] && state.user.email != '')
    }
}

const actions = {
    async signUp({ state, commit, dispatch, rootGetters }) {
        try {
            commit('changeSending');
            let user = state.newUser
            if (state.newUser.volunteer) {
                user.rol = { name: 'Volunteer', value: 'volu' }
            }
            user.username = state.newUser.firstName.toLowerCase();
            const res = await Axios.post('/users/signup', user);

            if (Cookies.get('teamcoo-jwt') == undefined) {
                Cookies.set('teamcoo-jwt', res.data.token, { expires: 30 });
            }
            commit('userStore', res.data.user);
            commit('changeLogged', true);

            const config = rootGetters['general/cookieAuth'];

            router.push('/dashboard');
            await Axios.post("/mail/send", {
                sendTo: res.data.user.email,
                userTo: res.data.user.firstName,
                template: 'user/new',
                subject: 'Welcome ' + res.data.user.firstName,
                variables: { recoveryUrlPass: window.location.origin + '/validation/' + res.data.token, name: res.data.user.firstName + ' ' + res.data.user.lastName }
            }, config);

            commit('changeSending');
            commit('menu/notification', ['success', 3, 'Correct registration. Welcome, ' + res.data.user.firstName + '. Please verify your mail.'], { root: true });
        }
        catch (error) {
            commit('changeSending');
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async login({ state, commit, dispatch }) {
        try {
            let res = await Axios.post('/users/login', state.user)
            if (Cookies.get('teamcoo-jwt') == undefined) {
                Cookies.set('teamcoo-jwt', res.data.token, { expires: 30 });
            }
            commit('userStore', res.data.user);
            commit('changeLogged', true);
            commit('menu/cancelDialog', 'login', { root: true });
            commit('menu/notification', ['success', 3, 'Correct Login. Welcome ' + res.data.user.username], { root: true });
            router.push('/dashboard');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true })
        }
    },

    async refreshLoadedUser({ state, commit, dispatch, rootGetters }) {
        try {
            let config = rootGetters['general/cookieAuth'];
            let res = await Axios.get('/users/' + state.loginUser._id, config)
            commit('userStore', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true })
        }
    },

    async logOut({ commit, dispatch }, message) {
        try {
            Cookies.remove('teamcoo-jwt')
            Cookies.remove('teamcoo-userdata')
            commit('menu/cancelDialog', 'logout', { root: true })
            commit('changeLogged', false);
            commit('clearUser')
            router.push('/');
            commit('menu/notification', ['success', 3, !message ? 'You are correctly log out.' : message], { root: true })
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true })
        }
    },

    expiredLogOut({ dispatch }) {
        dispatch('logOut', 'Your credentials expired. Login again.');
    },

    async changePasswordNotLogged({ state, commit, dispatch }, token) {
        try {
            await Axios.post('/tokens/changepassexternal', {
                token: token,
                password: state.password.confirmnewpassword
            });
            commit('menu/notification', ['primary', 3, 'Changed password for your account. You can Login with the new password.'], { root: true });
            router.push('/login');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async sendResetPassMail({ commit, dispatch }, email) {
        try {
            await Axios.post('/tokens/sendpassemail', {
                email: email,
                url: window.location.origin
            })
            commit('menu/notification', ['primary', 3, 'An email send to ' + email + '. Please check your account.'], { root: true })
            router.push('/')
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async sendVerificationMail({ commit, dispatch }, email) {
        try {
            commit('changeSending');
            await Axios.post('/tokens/resend', { email: email, name: state.loginUser.firstname, url: window.location.origin + '/validation/' })
            commit('changeSending');
            commit('menu/notification', ['primary', 3, 'Verification email send to ' + email + '. Please check your account.'], { root: true });
        } catch (error) {
            commit('changeSending');
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async verifyEmail({ commit, dispatch }, token) {
        try {
            await Axios.post('/tokens/confirmation', { token: token })
            setTimeout(() => {
                router.push('/dashboard');
            }, 6000);
            commit('verifiedEmailOk')
            commit('menu/alert', ['primary', 'Your email is now verified. Thanks a lot. In a few seconds you are redirected to your Dashboard or Login.', 'fas fa-smile-wink'], { root: true })
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },
    async changePassword({ state, commit, dispatch, rootGetters }) {
        try {
            let user = {
                email: state.loginUser.email,
                newpassword: state.password.newpassword,
                password: state.password.oldpassword
            }
            let config = rootGetters['general/cookieAuth'];
            await Axios.put('/users/password/' + state.loginUser._id, user, config)
            commit('menu/notification', ['primary', 3, 'Changed password Succesfully'], { root: true });
            commit('clearpass');
            commit('menu/cancelDialog', 'changepassword', { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}