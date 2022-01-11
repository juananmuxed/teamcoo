require('dotenv').config()
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vueaxios from 'vue-axios'
import router from './router'
import vuex from 'vuex'
import vuetify from './plugins/vuetify'
import store from './store/index'

const urlApi = `${process.env.VUE_APP_BASE_URL_API}/api/v${process.env.VUE_APP_API_VERSION}/`;

Vue.use(vueaxios, axios, router, vuex)
Vue.config.productionTip = false;

axios.defaults.baseURL = urlApi;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
