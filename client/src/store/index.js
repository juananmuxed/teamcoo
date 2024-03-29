import Vue from "vue";
import Vuex from "vuex";
import menu from './modules/menu'
import general from './modules/general'
import user from './modules/user'
import tasks from './modules/tasks'
import users from './modules/users'
import workgroups from './modules/workgroups'
import questions from './modules/questions'
import interests from './modules/interests'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });
import globalConfig from './../config/config.json'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    urlApi: process.env.VUE_APP_BASE_URL_API,
    roles: globalConfig.roles
  },
  namespaced: true,
  name: "global",
  modules: {
    menu,
    general,
    user,
    tasks,
    workgroups,
    questions,
    interests,
    users
  },
  plugins: [
    createPersistedState({
      key: 'teamcoo-userdata',
      paths: ['user.loginUser', 'user.userConfigs'],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      }
    })
  ]
})