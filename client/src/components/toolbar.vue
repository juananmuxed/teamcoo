<template>
    <v-app-bar
        app 
        tile
        clipped-left 
        elevation="1"
        collapse-on-scroll
    >
      
      <router-link to="/">
        <v-avatar tile>
          <v-img
            src="../../public/CATAPA_ICON.png"
            contain
          ></v-img>
        </v-avatar>
      </router-link>
      
      <v-toolbar-title>
        <span class="hidden-md-and-up primary--text title text-uppercase"><router-link to="/">Catapa</router-link></span>
        <v-container fluid class="hidden-sm-and-down">
          <v-row align-content="center" justify="center" no-gutters>
            <v-col cols="1">
              <router-link to="/">
                <v-img
                  src="../../public/CATAPA_LOGO.png"
                  style="height: inherit"
                  contain
                ></v-img>
              </router-link>
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon v-if="isLogged()" :ripple="false">
        <v-icon class="pa-2" @click="menu.active = !menu.active">{{ menu.drawerMini == true ? 'fas fa-ellipsis-v' : 'fas fa-list-ul' }}</v-icon>
      </v-btn>

    </v-app-bar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      menu: state => state.menu.menu,
    })
  },
  methods: {
    ...mapGetters('user',['isLogged'])
  },
}
</script>