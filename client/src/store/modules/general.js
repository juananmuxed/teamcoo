import Cookies from 'js-cookie';
import Vue from 'vue';
import Axios from 'axios'
import { camelize, kebabize } from '../../utils/utils';

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const ipPattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const hostPattern = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
const linkPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
const passwordPattern = /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
const spacesPattern = /\s/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const state = {
    rules: {
        required: v => !!v || 'Required',
        maxSize: v => !v || v.size < 5 * 1024 * 1024 || 'Dossier size should be less than 5 MB!',
        emailrules: v => {
            return emailPattern.test(v) || 'Invalid e-mail'
        },
        slugRule: v => {
            return slugPattern.test(v) || 'Invalid slug'
        },
        validHost: v => {
            if (hostPattern.test(v) || ipPattern.test(v)) {
                return true
            } else {
                return 'Invalid host (IP or Host name)'
            }
        },
        validlink: v => {
            if (v == '') {
                return true
            }
            else {
                if (linkPattern.test(v)) {
                    return true
                }
                else {
                    return false || 'Invalid link'
                }
            }
        },
        zerolength: v => v.length != 0 || 'Select one at least',
        minletter: v => v.length >= 3 || 'At least 3 letters',
        maxletters: v => v.length <= 20 || 'Max 20 characters',
        maxdescletters: v => v.length <= 380 || 'Max 380 characters',
        nospaces: v => {
            return !spacesPattern.test(v) || 'No spaces'
        },
        passwordrules: v => {
            return passwordPattern.test(v) || 'Password too weak'
        },
        passwordconfirm: (x, y) => {
            if (x == y) {
                return true
            }
            else {
                return false || 'Passwords must match'
            }
        },
        acceptchecks: v => !!v || 'Check the policy.',
        acceptterms: v => !!v || 'Check the terms.',
        delete: v => {
            if (v != 'DELETE') {
                return false || 'DELETE'
            }
            else {
                return true
            }
        },
        imageSize: v => !v || v.size < 1 * 1024 * 1024 || 'Image size should be less than 1MB'
    },
    tab: null,
    tabs: [
        { name: 'General', icon: 'fas fa-cog' },
        { name: 'Common Questions', icon: 'fas fa-question-circle' },
        { name: 'Customization', icon: 'fas fa-paint-brush' },
        { name: 'Mails', icon: 'fas fa-envelope' },
    ],
    config: {
        email: {
            host: "",
            port: 465,
            secure: true,
            user: "",
            pass: "",
            email: "",
            name: "",
            legalText: ""
        },
        testEmail: '',
        sendingEmail: false,
        ports: [587, 2525, 465, 25],
        pages: []
    },
}

const mutations = {
    setEmailConfig: (state, config) => {
        state.config.email.host = config.host;
        state.config.email.port = config.port;
        state.config.email.secure = config.secure;
        state.config.email.user = config.user;
        state.config.email.pass = config.pass;
        state.config.email.email = config.email;
    },
    changeSending: (state) => {
        state.config.sendingEmail = !state.config.sendingEmail
    },
    addPageBlank: (state) => {
        state.config.pages.push({
            position: 'footer',
            name: '',
            title: '',
            slug: '',
            protected: false,
            icon: 'fas fa-question'
        })
    },
    setPages: (state, pages) => {
        state.config.pages = pages;
    },
    setPage: (state, page) => {
        Vue.set(state.config, 'page', page)
    }
}

const getters = {
    cookieAuth: () => {
        return {
            headers: {
                Authorization: "Bearer " + Cookies.get("catapa-jwt")
            }
        }
    },

    isValidEmailConfig: (state) => {
        return state.config.email.host != '' &&
            (hostPattern.test(state.config.email.host) || ipPattern.test(state.config.email.host)) &&
            state.config.email.user != '' &&
            state.config.email.pass != '' &&
            state.config.email.email != '' &&
            emailPattern.test(state.config.email.email)
    },

    isValidEmailTest: (state) => {
        return state.config.testEmail != '' && emailPattern.test(state.config.testEmail);
    },
}

const actions = {
    async searchEmailConfig({ commit, getters }) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/emails", config);
            if (!res.data) {
                throw new Error(1);
            }
            commit('setEmailConfig', res.data.values)
        } catch (error) {
            if (error.message != 1) {
                commit('menu/notification', ['error', 3, error], { root: true });
            }
        }
    },

    async saveEmailConfig({ state, commit, getters }) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get('/configuration/emails', config)
            if (!res.data) {
                res = await Axios.post('/configuration/', { name: 'emails', values: state.config.email }, config)
            } else {
                res = await Axios.put('/configuration/emails', { values: state.config.email, date: new Date() }, config);
            }
            commit('setEmailConfig', res.data.values);
            commit('menu/notification', ['success', 3, 'Email configuration saved'], { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },

    async searchConfig({ state, commit, getters }, page) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/" + page.value, config);
            if (!res.data) {
                throw new Error(1);
            }
            Vue.set(state.pagesValues, res.data.name, res.data.value);
        } catch (error) {
            if (error.message != 1) {
                commit('menu/notification', ['error', 3, error], { root: true });
            }
        }
    },

    async saveConfig({ state, commit, getters }, page) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/" + page.value, config);
            if (!res.data) {
                res = await Axios.post('/configuration/', { name: page.value, value: state.pagesValues[page.value] }, config)
            } else {
                res = await Axios.put('/configuration/' + page.value, { value: state.pagesValues[page.value], date: new Date() }, config)
            }
            Vue.set(state.pagesValues, res.data.name, res.data.value);
            commit('menu/notification', ['success', 3, 'Static page ' + res.data.name.toUpperCase() + ' saved'], { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },

    async savePage({ commit, getters, dispatch }, page) {
        try {
            let config = getters.cookieAuth;
            if (!page.title) {
                return commit('menu/notification', ['error', 3, 'Please you need a name'], { root: true });
            }
            if (!page.name) {
                page.name = camelize(page.title);
            }
            if (!page.slug) {
                page.slug = kebabize(page.title)
            }
            let res = await Axios.get("/pages/protected/" + page.name, config);
            if (!res.data) {
                res = await Axios.post('/pages/', page, config)
            } else {
                res = await Axios.put('/pages/' + page.name, page, config)
            }
            dispatch('menu/getFooterPages', null, { root: true });
            dispatch('menu/getLateralPages', null, { root: true });
            commit('menu/notification', ['success', 3, 'Static page ' + res.data.title + ' saved'], { root: true });
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },

    async sendTestEmail({ state, commit, getters, rootState }) {
        try {
            let config = getters.cookieAuth;
            commit('changeSending');
            await Axios.post("/mail/send", {
                sendTo: state.config.testEmail,
                user: rootState.user.loginuser.firstname,
                template: 'test',
                subject: 'Test email',
                variables: { webpageurl: window.location.origin }
            }, config);
            commit('menu/notification', ['success', 3, 'Test mail sended'], { root: true });
            commit('changeSending');
        } catch (error) {
            commit('menu/notification', ['error', 3, error.message], { root: true });
            commit('changeSending');
        }
    },

    async getStaticPages({ commit, getters }) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/pages/protected", config);
            if (res.data) {
                commit('setPages', res.data)
            }
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },

    async searchPage({ commit }, slug) {
        try {
            let res = await Axios.get("/pages/");
            let page = res.data.find((page) => page.slug == slug)
            if (!page) {
                page = {
                    icon: 'fas fa-coffee',
                    title: 'Page not found',
                    value: '<h2>This page is invalid. Try other.</h2>'
                }
            }
            commit('setPage', page)
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    }

    //TODO: save theme configuration
    //TODO: delete page with modal
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}