<template>
  <v-app-bar app tile clipped-left>
    <router-link to="/">
      <v-avatar tile class="pa-1">
        <v-img :src="`${logos.icon}`" contain></v-img>
      </v-avatar>
    </router-link>

    <v-container fluid>
      <v-row align-content="center" justify="center" no-gutters>
        <v-col cols="12" class="pa-3">
          <v-img height="40" :src="`${logos.logo}`" contain></v-img>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer></v-spacer>

    <v-btn icon v-if="isLogged()" :ripple="false">
      <v-icon class="pa-2" @click="menu.active = !menu.active">{{
        menu.drawerMini == true ? "fas fa-ellipsis-v" : "fas fa-list-ul"
      }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      logos: (state) => state.menu.logos,
    }),
  },
  methods: {
    ...mapGetters("user", ["isLogged"]),
  },
};
</script>