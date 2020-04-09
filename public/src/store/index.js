import Vue from "vue";
import Vuex from "vuex";
import menu from './modules/menu'
import user from './modules/user'
import actions from './modules/actions'
import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

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
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 30 }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
});