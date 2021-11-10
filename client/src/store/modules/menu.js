import Vuetify from '../../plugins/vuetify'
import Axios from 'axios'
import router from '@/router'
import config from '../../config/config.json'

const state = {
    menu: {
        active: true,
        drawerMini: true,
        scroll: 0,
        upDown: false,
        links: config.menuLinks,
        static: config.staticPages,
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
            editmembers: false,
            editquestion: false,
            editcommonquestion: false,
            edittask: false,
            savemembertask: false
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
        polling: null
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
    colors: {}
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
        if (state.snackbar.active) clearInterval(state.snackbar.polling);
        state.snackbar.active = true;
        state.snackbar.color = color;
        state.snackbar.message = message;
        state.snackbar.polling = setTimeout(() => {
            state.snackbar.active = false;
        }, time * 1000);
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
        state.logos.icon = logos.icon;
        state.logos.logo = logos.logo;
        state.logos.favicon = logos.favicon;
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
    },
    setWebName: (state, web) => {
        const title = document.getElementById("webTitle");
        title.innerHTML = web.name;
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
    async getLogosPage({ state, commit, rootState, rootGetters }) {
        try {
            let configCookie = rootGetters['general/cookieAuth'];
            let res = await Axios.get("/configuration/logos", configCookie);
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
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async getThemeColors({ commit, rootGetters }) {
        try {
            let configCookie = rootGetters['general/cookieAuth'];
            let res = await Axios.get("/configuration/colors", configCookie);
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
            commit('menu/notification', ['error', 3, error], { root: true });
        }
    },
    async getWebName({ commit, rootGetters }) {
        try {
            let configCookie = rootGetters['general/cookieAuth'];
            let res = await Axios.get("/configuration/web", configCookie);
            if (res.data) {
                commit('setWebName', res.data.values)
            } else {
                commit('setWebName', { name: 'TeamCoo' })
            }
        } catch (error) {
            commit('menu/notification', ['error', 3, error], { root: true });
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