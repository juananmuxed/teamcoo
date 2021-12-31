import Vuetify from '../../plugins/vuetify'
import Axios from 'axios'
import router from '@/router'
import config from '../../config/config.json'
import { generateRandomColor } from '../../utils/utils'
import Vue from 'vue'

const state = {
    menu: {
        active: true,
        drawerMini: true,
        scroll: 0,
        upDown: false,
        links: config.menuLinks,
        version: config.global.versionApp,
        staticFooter: [],
        staticLateral: [],
        dialogs: {
            login: false,
            logout: false,
            edituser: false,
            changepassword: false,
            createworkgroup: false,
            createquestion: false,
            suscribeto: false,
            unsuscribeworkgroup: false,
            createtask: false,
            createinterest: false,
            editinterest: false,
            editworkgroup: false,
            confirm: false,
            confirmSoft: false,
            editmembers: false,
            editquestion: false,
            editcommonquestion: false,
            edittask: false,
            savemembertask: false,
            deletePage: false
        },
        loader: {
            workgroup: false,
            secretworkgroup: false,
            tasks: false,
            itembig: false,
            users: false
        },
        cookie: false,
        progressbar: {
            active: false,
            color: 'info',
            value: 0
        }
    },
    snackbar: {
        active: false,
        color: 'info',
        message: '',
        timeout: 0
    },
    alert: {
        message: 'Message',
        color: 'primary',
        icon: 'fas fa-user'
    },
    logos: {
        icon: '',
        logo: '',
        favicon: ''
    },
    newLogos: {
        icon: null,
        logo: null,
        favicon: null
    },
    colors: {},
    web: {}
}

const mutations = {
    onScroll: (state, value) => {
        state.menu.scroll = value.target.defaultView.scrollY
        if (value.target.defaultView.scrollY != 0) {
            state.menu.drawerMini = true
        }
        if (value.target.defaultView.scrollY >= 150) {
            state.menu.upDown = true
        }
        else {
            state.menu.upDown = false
        }
    },
    notification: (state, [color, time, message]) => {
        state.snackbar.active = true;
        state.snackbar.color = color;
        state.snackbar.message = message;
        state.snackbar.timeout = time * 1000
    },
    alert: (state, [color, message, icon]) => {
        state.alert.icon = icon
        state.alert.message = message
        state.alert.color = color
    },
    cancelDialog: (state, dialog) => { state.menu.dialogs[dialog] = false },
    loadingstate: (state, [loader, bool]) => { state.menu.loader[loader] = bool },
    cookieChange: (state) => { state.menu.cookie = !state.menu.cookie },
    loadingbar: (state, [color, active, value]) => {
        if (color != null) { state.menu.progressbar.color = color }
        if (active != null) { state.menu.progressbar.active = active }
        if (value != null) { state.menu.progressbar.value = value }
    },
    setLogosPage: (state, logos) => {
        Vue.set(state, 'logos', logos);
    },
    setThemeColors: (state, themes) => {
        Vuetify.framework.theme.themes.light.primary = themes.light.primary;
        Vuetify.framework.theme.themes.light.secondary = themes.light.secondary;
        Vuetify.framework.theme.themes.light.error = themes.light.error;
        Vuetify.framework.theme.themes.light.info = themes.light.info;
        Vuetify.framework.theme.themes.light.success = themes.light.success;
        Vuetify.framework.theme.themes.light.warning = themes.light.warning;
        Vuetify.framework.theme.themes.dark.primary = themes.dark.primary;
        Vuetify.framework.theme.themes.dark.secondary = themes.dark.secondary;
        Vuetify.framework.theme.themes.dark.error = themes.dark.error;
        Vuetify.framework.theme.themes.dark.info = themes.dark.info;
        Vuetify.framework.theme.themes.dark.success = themes.dark.success;
        Vuetify.framework.theme.themes.dark.warning = themes.dark.warning;
        Vue.set(state, 'colors', themes);
    },
    setWebName: (state, web) => {
        Vue.set(state, 'web', web);
    },
    setPagesFooter: (state, pages) => {
        state.menu.staticFooter = pages;
    },
    setPagesLateral: (state, pages) => {
        state.menu.staticLateral = pages;
    },
    randomColor: (state, themeColor) => {
        state.colors[themeColor.theme][themeColor.color] = generateRandomColor(30);
    },
    clearLogos: (state) => {
        state.newLogos.icon = null;
        state.newLogos.favicon = null;
        state.newLogos.logo = null;
    }
}

const getters = {
    isDark() {
        if (Vuetify.framework.theme.dark) {
            return false
        }
        else {
            return true
        }
    }
}

const actions = {
    changeLight({ commit }) {
        commit('user/onOffLights', null, { root: true });
        if (Vuetify.framework.theme.dark) {
            commit('notification', ['info', 1, '🌚  Lights Off']);
        }
        else {
            commit('notification', ['info', 1, '🌞  Lights On']);
        }
    },

    goBack() {
        setTimeout(() => {
            router.go(-1)
        }, 200);
    },

    notificationError({ commit }, error) {
        if (error.response && error.response.data && error.response.data.message) {
            const color = error.response.status >= 400 ? 'error' : 'warning';
            commit('notification', [color, 6, error.response.data.message]);
        } else {
            commit('notification', ['error', 6, error]);
        }
    },

    async getLogosPage({ state, commit, dispatch, rootState }) {
        try {
            let res = await Axios.get("/configuration/logos");
            if (res.data) {
                commit('setLogosPage', res.data.values)
            } else {
                commit('setLogosPage', {
                    icon: rootState.urlApi + '/uploads/TEAMCOO_ICON.png',
                    logo: rootState.urlApi + '/uploads/TEAMCOO_LOGO.png',
                    favicon: rootState.urlApi + '/uploads/FAVICON.png'
                })
            }
            const favicon = document.getElementById("favicon");
            favicon.href = state.logos.favicon;
        } catch (error) {
            dispatch('notificationError', error);
        }
    },

    async getThemeColors({ commit, dispatch }) {
        try {
            let res = await Axios.get("/configuration/colors");
            if (res.data) {
                commit('setThemeColors', res.data.values)
            } else {
                commit('setThemeColors', {
                    light: {
                        primary: '#3271cf',
                        secondary: '#179246',
                        error: '#c12828',
                        info: '#4fa098',
                        success: '#4a9f41',
                        warning: '#e4a953',
                    },
                    dark: {
                        primary: '#179246',
                        secondary: '#3271cf',
                        error: '#ce4949',
                        info: '#80cbc4',
                        success: '#7dc975',
                        warning: '#ecbd77',
                    }
                })
            }
        } catch (error) {
            dispatch('notificationError', error);
        }
    },

    async getWebName({ commit, dispatch }) {
        try {
            let res = await Axios.get("/configuration/web");
            if (res.data) {
                commit('setWebName', res.data.values)
            } else {
                commit('setWebName', { name: 'TeamCoo' })
            }
        } catch (error) {
            dispatch('notificationError', error);
        }
    },

    async getFooterPages({ commit, dispatch }) {
        try {
            let res = await Axios.get("/pages/");
            if (res.data) {
                let filteredByPosition = res.data.filter(page => page.position == 'footer')
                commit('setPagesFooter', filteredByPosition)
            } else {
                commit('setPagesFooter', [])
            }
        } catch (error) {
            dispatch('notificationError', error);
        }
    },

    async getLateralPages({ commit, dispatch }) {
        try {
            let res = await Axios.get("/pages/");
            if (res.data) {
                let filteredByPosition = res.data.filter(page => page.position == 'lateral')
                commit('setPagesLateral', filteredByPosition)
            } else {
                commit('setPagesLateral', [])
            }
        } catch (error) {
            dispatch('notificationError', error);
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