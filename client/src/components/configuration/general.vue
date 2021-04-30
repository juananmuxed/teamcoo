<template>
  <v-skeleton-loader type="skeleton" :types="{skeleton: 'card,article, table-tfoot'}" class="mx-auto" transition="fade-transition" :loading="skeleton">
    <v-card flat>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3">Static Pages</v-card-title>
      <v-card flat class="pa-6" v-for="(page , index) in pages" :key="index">
        <v-card-title>
          <v-icon>{{ page.icon }}</v-icon>
          <span class="display-1 text-uppercase font-weight-thin ml-4">{{ `${page.name} page` }}</span>
        </v-card-title>
        <textarea-editor v-model="pagesValues[page.value]"></textarea-editor>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn fab small color="primary" @click="saveConfig(page)" :disabled="!isEdited(page)">
                <v-icon small>fas fa-save</v-icon>
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import Axios from 'axios'
import Vue from 'vue'
import Cookies from 'js-cookie';
import config from '../../config/config.json'
import textareaeditorVue from './textareaeditor.vue'

export default {
  data() {
    return{
      pages: config.staticPages,
      pagesValues: {},
      pagesValuesNotEdited: {},
      skeleton: false,
      config: {
        headers: {Authorization: "Bearer " + Cookies.get("catapa-jwt")}
      }
    }
  },
  components: {
    'textarea-editor':textareaeditorVue,
  },
  methods: {
    async searchConfig(page) {
      let res = await Axios.get('/configuration/' + page.value, this.config)
      Vue.set(this.pagesValues, res.data.name,res.data.value);
      Vue.set(this.pagesValuesNotEdited, res.data.name,res.data.value);
    },
    isEdited(page) {
      return this.pagesValues[page.value] != this.pagesValuesNotEdited[page.value];
    },
    async saveConfig(page) {
        let res = await Axios.get('/configuration/' + page.value, this.config)
        if (res.data == undefined) {
            res = await Axios.post('/configuration/', {name:  page.value, value: this.pagesValues[page.value]}, this.config)
        } else {
            res = await Axios.put('/configuration/' + page.value, { value: this.pagesValues[page.value], date: new Date()}, this.config);
        }
        Vue.set(this.pagesValues, res.data.name,res.data.value);
        Vue.set(this.pagesValuesNotEdited, res.data.name,res.data.value);
    }
  },
  created() {
    this.skeleton = true;
    this.pages.forEach(async page => {
      await this.searchConfig(page);
    });      
    setTimeout(() => {
      this.skeleton = false
    }, 600);
  }
}
</script>