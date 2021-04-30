<template>
    <v-container
        class="pa-10"
        fluid
    >
        <v-row>
            <v-col>
              <v-skeleton-loader
                type="article"
                max-width="1080"
                class="mx-auto" 
                transition="fade-transition" 
                :loading="skeleton"
              >
                <v-card outlined flat max-width="1080" class="mx-auto pa-4">
                    <v-card-title class="mb-3">
                      <v-icon size="60" color="primary">{{ icon }}</v-icon>
                      <span class="display-2 font-weight-medium ml-6">{{ title }}</span>
                    </v-card-title>
                    <v-card-text v-html="html"></v-card-text>
                </v-card>
              </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Axios from 'axios'
import Cookies from 'js-cookie';
import config from '../../config/config.json'
export default {
  data() {
    return {
      pages: config.staticPages,
      html: '<h2>This page is invalid. Try again.</h2>',
      icon: 'fas fa-coffee',
      title: 'Page not found',
      skeleton: false
    }
  },
  methods: {
    async searchConfig(page) {
      this.skeleton = true
      const config = {
        headers: {
          Authorization: "Bearer " + Cookies.get("catapa-jwt")
        }
      }
      let res = await Axios.get('/configuration/' + page.value, config)
      if(res.data) {
        this.icon = page.icon
        this.title = page.name
        this.html = res.data.value
      } else {
        this.pageNotConfigured(page)
      }
      setTimeout(() => {
        this.skeleton = false
      }, 600);
    },
    async pageNotFound(){
      this.icon = 'fas fa-coffee'
      this.title = 'Page not found'
      this.html = '<h2>This page is invalid. Try again.</h2>'
    },
    async pageNotConfigured(page){
      this.icon = page.icon
      this.title = page.name
      this.html = '<h2>Configure the page or chech it.</h2>'
    }
  },
  watch: {
    '$route.params.slug': function (slug) {
      this.pages.forEach(async page => {
        if(page.slug == slug) {
          await this.searchConfig(page);
        } else {
          await this.pageNotFound();
        }
      });
    }
  },
  created() {
    this.pages.forEach(async page => {
      if(page.slug == this.$route.params.slug) {
        await this.searchConfig(page);
      } else {
        await this.pageNotFound();
      }
    });
  }
}
</script>