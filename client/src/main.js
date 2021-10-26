require('dotenv').config()
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vueaxios from 'vue-axios'
import router from './router'
import vuex from 'vuex'
import vuetify from './plugins/vuetify'
import store from './store/index'
import globalConfig from './config/config.json'

const host = process.env.NODE_ENV == 'development' ? globalConfig.global.development.hostApi : globalConfig.global.production.hostApi;
const urlApi = `${host}/api/v${globalConfig.global.versionApi}/`;

Vue.use(vueaxios, axios, router, vuex)
Vue.config.productionTip = false;

axios.defaults.baseURL = urlApi;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
