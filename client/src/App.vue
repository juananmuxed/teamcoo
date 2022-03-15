<template>
  <v-app>
    <v-overlay
      opacity="1"
      :color="userConfigs.dark ? 'black' : 'white'"
      :z-index="9999"
      :value="loading"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          size="80"
          :color="!userConfigs.dark ? 'black' : 'white'"
        ></v-progress-circular>
      </div>
    </v-overlay>
    <lateral-menu></lateral-menu>
    <toolbar-top></toolbar-top>
    <v-content v-scroll="onScroll">
      <v-slide-y-transition
        ><v-progress-linear
          class="ma-0"
          :active="menu.progressbar.active"
          :value="menu.progressbar.value"
          height="8"
          :color="menu.progressbar.color"
        ></v-progress-linear
      ></v-slide-y-transition>
      <v-fade-transition mode="out-in"
        ><router-view :key="$route.fullPath"></router-view
      ></v-fade-transition>
      <v-scale-transition origin="center center">
        <v-btn
          @click="$vuetify.goTo(0, { duration: 1000 })"
          v-if="menu.upDown"
          fixed
          fab
          bottom
          right
          depressed
          color="secondary"
          class="mb-12"
        >
          <v-icon>fas fa-arrow-up</v-icon>
        </v-btn>
      </v-scale-transition>
      <v-dialog max-width="650" v-model="dialogs.sendMessage">
        <send-message-component></send-message-component>
      </v-dialog>
    </v-content>
    <footer-bot></footer-bot>
    <v-snackbar
      v-model="snackbar.active"
      bottom
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      multi-line
      >{{ snackbar.message }}
      <v-btn color="white" icon @click="snackbar.active = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Vuetify from "./plugins/vuetify";

import { mapActions, mapMutations, mapState } from "vuex";
import SendMessageVue from "./components/general/SendMessage.vue";
import LateralMenuVue from "./components/general/LateralMenu.vue";
import ToolbarVue from "./components/general/Toolbar.vue";
import FooterVue from "./components/general/Footer.vue";

export default {
  name: "App",

  components: {
    "lateral-menu": LateralMenuVue,
    "toolbar-top": ToolbarVue,
    "footer-bot": FooterVue,
    "send-message-component": SendMessageVue,
  },
  computed: {
    ...mapState({
      loading: (state) => state.general.loading,
      dialogs: (state) => state.menu.menu.dialogs,
      menu: (state) => state.menu.menu,
      snackbar: (state) => state.menu.snackbar,
      userConfigs: (state) => state.user.userConfigs,
    }),
  },

  async created() {
    Vuetify.framework.theme.dark = this.userConfigs.dark;
    await this.getThemeColors();
    await this.getLogosPage();
    this.changeLoadingApp();
  },

  methods: {
    ...mapMutations("menu", ["onScroll"]),
    ...mapMutations("general", ["changeLoadingApp"]),
    ...mapActions("menu", ["getThemeColors", "getLogosPage"]),
  },
};
</script>

<style>
img {
  max-width: 100%;
  height: auto;
}
</style>
