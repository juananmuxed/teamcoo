<template>
  <v-app>
      <lateral-menu></lateral-menu>
      <toolbar-top></toolbar-top>
      <v-content v-scroll="onScroll">
        <v-fade-transition mode="out-in"><router-view></router-view></v-fade-transition>            
        <v-scale-transition origin="center center">
          <v-btn
            @click="$vuetify.goTo(0, {duration:1000})"
            v-if="menu.upDown"
            fixed
            fab
            top
            right
            depressed
            color="secondary"
            class="mb-12"
          >
            <v-icon>fas fa-arrow-up</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-content>
      <footer-bot></footer-bot>
      <v-snackbar
        v-model="snackbar.active"
        bottom
        :color="snackbar.color"
        :timeout="0"
        multi-line
      >{{ snackbar.message }}
      </v-snackbar>
  </v-app>
</template>

<script>
import lateralmenu from './components/lateralmenu.vue'
import toolbar from './components/toolbar.vue'
import footer from './components/footer.vue'
import Vuetify from './plugins/vuetify'

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'App',

  components: {
    'lateral-menu': lateralmenu,
    'toolbar-top': toolbar,
    'footer-bot': footer
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu,
      snackbar: state => state.menu.snackbar,
      loginuser: state => state.user.loginuser,
    })
  },

  created() {
    Vuetify.framework.theme.dark = this.loginuser.dark
  },

  methods: {
    ...mapMutations('menu',['onScroll'])
  },
};
</script>