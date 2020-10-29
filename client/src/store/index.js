import Vue from "vue";
import Vuex from "vuex";
import menu from './modules/menu'
import user from './modules/user'
import actions from './modules/actions'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  name: "global",
  modules: {
    menu,
    user,
    actions
  },
  plugins: [
    createPersistedState({
      key: 'teamcoo-catapa-userdata',
      paths: ['user.loginuser'],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      }
    })
  ]
})