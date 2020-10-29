import Vuetify from '../../plugins/vuetify'
import router from '@/router'

const state = {
    menu: {
        active: true,
        drawerMini: true,
        scroll: 0,
        upDown: false,
        links: [
            { name: 'Dashboard', link: '/dashboard', roles: ['user','volu','coor','dire','memb','admin'], icon: 'fas fa-columns' },
            { name: 'Users', link: '/users', roles: ['coor','dire','admin'], icon: 'fas fa-users' },
            { name: 'Work Groups', link: '/workgroups', roles: ['coor','dire','admin','volu'], icon: 'fas fa-network-wired' },
            { name: 'Tasks', link: '/tasks', roles: ['coor','dire','admin','volu'], icon: 'fas fa-tasks' },
            { name: 'Interests', link: '/interests', roles: ['coor','dire','admin'], icon: 'fas fa-address-card' },
            { name: 'Questions', link: '/questions', roles: ['coor','dire','admin'], icon: 'fas fa-question' },
            { name: 'Membership', link: '/membership', roles: ['user','volu','coor','dire','memb','admin'], icon: 'fas fa-star' }
        ],
        dialogs: {
            login: false,
            logout: false,
            edituser: false,
            deleteaccount: false,
            changepassword: false,
            createwg: false,
            createquestion: false,
            suscribeto: false,
            unsuscribewg: false,
            createtask:false,
            createinterest:false,
            editwg:false,
            confirm:false,
            editmembers:false,
            editquestion:false
        },
        loader:{
            wg:false,
            secretwg:false,
            tasks:false,
            itembig:false
        },
        cookie: false,
        progressbar:{
            active:false,
            color:'info',
            value:0
        }
    },
    snackbar: {
        active: false,
        color: 'info',
        message: ''
    },
    alert: {
        message: 'Message',
        color: 'primary',
        icon: 'fas fa-user'
    }
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
        setTimeout(() => {
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
    loadingbar:(state, [color, active , value]) => {
        if(color != null){state.menu.progressbar.color = color}
        if(active != null){state.menu.progressbar.active = active}
        if(value != null){state.menu.progressbar.value = value}
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
            commit('notification', ['info', 1, 'Lights Off']);
        }
        else {
            commit('notification', ['info', 1, 'Lights On']);
        }
    },
    goBack() {
        setTimeout(() => {
            router.go(-1)
        }, 200);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}