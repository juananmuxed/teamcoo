import Cookies from 'js-cookie';
import Vue from 'vue';
import Axios from 'axios'
import { camelize, kebabize } from '../../utils/utils';
import icons from '../../config/fas.json';

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const ipPattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const hostPattern = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
const linkPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
const passwordPattern = /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
const spacesPattern = /\s/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const state = {
    loading: true,
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
        acceptChecks: v => !!v || 'Check the policy.',
        acceptTerms: v => !!v || 'Check the terms.',
        acceptVolunteer: v => !!v || 'You need to check this.',
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
        pages: [],
        searchedPage: {}
    },
    page: {},
    pagesSpecials: {
        home: {},
        register: {},
        membership: {},
    },
    notConfiguredPage: {
        icon: 'fas fa-hamburger',
        title: 'Page not configured',
        value: '<h2>Set in the config options or contact with the administrator.</h2>'
    },
    notFoundPage: {
        icon: 'fas fa-coffee',
        title: 'Page not found',
        value: '<h2>This page is invalid. Try other.</h2>'
    },
    notPermitedPage: {
        icon: 'fas fa-lock',
        title: 'This page is not for you',
        value: '<h2>This pages is protected for login users, please login or register</h2>'
    },
    icons: icons,
    userEmail: {},
    emailForm: {
        subject: '',
        message: '',
        anonymous: true,
        sending: false
    }
}

const mutations = {
    changeLoadingApp: (state) => {
        state.loading = !state.loading
    },
    setEmailConfig: (state, config) => {
        state.config.email = config;
    },
    changeSending: (state) => {
        state.config.sendingEmail = !state.config.sendingEmail
    },
    changeMessageSending: (state) => {
        state.emailForm.sending = !state.emailForm.sending
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
        Vue.set(state, 'page', page)
    },
    setPageSpecial: (state, page) => {
        Vue.set(state.pagesSpecials, page.position, page.page)
    },
    setTemporalPage: (state, page) => {
        Vue.set(state.config, 'searchedPage', page)
    },
    setConfig: (state, config) => {
        Vue.set(state.pagesValues, config.name, config.value);
    },
    setUserToMessage: (state, user) => {
        state.userEmail = user;
    },
    clearFormMessage: (state) => {
        state.emailForm.subject = '';
        state.emailForm.message = '';
        state.emailForm.anonymous = true;
    }
}

const getters = {
    cookieAuth: () => {
        return {
            headers: {
                Authorization: "Bearer " + Cookies.get("teamcoo-jwt")
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

    validMessage: (state) => {
        if (
            state.emailForm.subject != '' &&
            state.emailForm.message != ''
        ) {
            return true
        }
        else {
            return false
        }
    },
}

const actions = {
    async saveFile({ rootState, dispatch }, file) {
        try {
            let formData = new FormData()
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            formData.append('file', file)
            let resImg = await Axios.post('/files/upload', formData, config)
            let destination = resImg.data.file.destination.replaceAll('\\', '|').replaceAll('/', '|').split('|');
            let date = destination[destination.length - 4] + '/' + destination[destination.length - 3] + '/' + destination[destination.length - 2] + '/';
            return rootState.urlApi + '/uploads/' + date + resImg.data.file.filename;
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async searchEmailConfig({ commit, getters, dispatch }) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/emails", config);
            if (!res.data) {
                throw new Error(1);
            }
            commit('setEmailConfig', res.data.values)
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveEmailConfig({ state, commit, getters, dispatch }) {
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
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async searchConfig({ commit, getters, dispatch }, page) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/" + page.value, config);
            if (!res.data) {
                throw new Error(1);
            }
            commit('setConfig', res.data);
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveConfig({ getters, dispatch }, configuration) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/configuration/" + configuration.name, config);
            if (!res.data) {
                await Axios.post('/configuration/', { name: configuration.name, values: configuration.values }, config);
            } else {
                await Axios.put('/configuration/' + configuration.name, { values: configuration.values, date: new Date() }, config);
            }
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async saveThemeConfig({ commit, dispatch, rootState }) {
        try {
            let iconUrl = rootState.menu.logos.icon;
            let faviconUrl = rootState.menu.logos.favicon;
            let logoUrl = rootState.menu.logos.logo;
            if (rootState.menu.newLogos.icon != null) {
                iconUrl = await dispatch('saveFile', rootState.menu.newLogos.icon);
            }
            if (rootState.menu.newLogos.favicon != null) {
                faviconUrl = await dispatch('saveFile', rootState.menu.newLogos.favicon);
            }
            if (rootState.menu.newLogos.logo != null) {
                logoUrl = await dispatch('saveFile', rootState.menu.newLogos.logo);
            }
            await dispatch('saveConfig', { name: 'web', values: rootState.menu.web });
            await dispatch('saveConfig', { name: 'logos', values: { icon: iconUrl, favicon: faviconUrl, logo: logoUrl } });
            await dispatch('saveConfig', { name: 'colors', values: rootState.menu.colors });
            commit('menu/setWebName', rootState.menu.web, { root: true });
            commit('menu/setThemeColors', rootState.menu.colors, { root: true });
            commit('menu/setLogosPage', { icon: iconUrl, favicon: faviconUrl, logo: logoUrl }, { root: true });
            commit('menu/clearLogos', null, { root: true });
            commit('menu/notification', ['success', 3, 'Configuration saved successfully'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
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
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async sendTestEmail({ state, commit, getters, dispatch }) {
        try {
            let config = getters.cookieAuth;
            commit('changeSending');
            await Axios.post("/mail/send", {
                sendTo: state.config.testEmail,
                template: 'test',
                subject: 'Test email',
                variables: { webpageurl: window.location.origin }
            }, config);
            commit('menu/notification', ['success', 3, 'Test mail sended'], { root: true });
            commit('changeSending');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeSending');
        }
    },

    async sendMessage({ state, commit, getters, dispatch, rootState }) {
        try {
            let config = getters.cookieAuth;
            commit('changeMessageSending');
            await Axios.post("/mail/send", {
                sendTo: state.userEmail.email,
                template: 'generic/sendMessage',
                subject: 'You have a new message',
                variables: {
                    webpageurl: window.location.origin,
                    anonymous: state.emailForm.anonymous,
                    subject: state.emailForm.subject,
                    message: state.emailForm.message,
                    userFrom: rootState.user.loginUser.username,
                    emailFrom: rootState.user.loginUser.email,
                }
            }, config);
            commit('menu/notification', ['success', 3, 'Message sended'], { root: true });
            commit('menu/cancelDialog', 'sendMessage', { root: true });
            commit('changeMessageSending');
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
            commit('changeMessageSending');
        }
    },

    async getStaticPages({ commit, getters, dispatch }) {
        try {
            let config = getters.cookieAuth;
            let res = await Axios.get("/pages/protected", config);
            if (res.data) {
                commit('setPages', res.data)
            }
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async searchPage({ state, commit, dispatch }, slug) {
        try {
            let res = await Axios.get("/pages/");
            let page = res.data.find((page) => page.slug == slug)
            if (!page) {
                page = state.notFoundPage
            }
            commit('setPage', page)
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async deletePage({ commit, getters, dispatch }, page) {
        try {
            let config = getters.cookieAuth;
            if (!page.slug && !page.name) {
                return commit('menu/notification', ['error', 3, 'This page is not saved, save before delete.'], { root: true });
            }
            await Axios.delete('/pages/' + page.name, config);
            await dispatch('getStaticPages');
            commit('menu/cancelDialog', 'confirm', { root: true });
            commit('menu/notification', ['success', 3, 'Static page deleted'], { root: true });
        } catch (error) {
            dispatch('menu/notificationError', error, { root: true });
        }
    },

    async getPage({ state, commit, dispatch }, position) {
        try {
            let res = await Axios.get("/pages/");
            let page = res.data.find((page) => page.position == position)
            if (!page) {
                page = state.notConfiguredPage;
            }
            if (page.protected) {
                page = state.notPermitedPage;
            }
            commit('setPageSpecial', { position: position, page: page })
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