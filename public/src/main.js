import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vueaxios from 'vue-axios'
import router from './router'
import vuex from 'vuex'
import vuetify from './plugins/vuetify'
import store from './store/index'

Vue.use(vueaxios,axios,router,vuex)
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:3000/api'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
