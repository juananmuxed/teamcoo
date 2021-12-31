<template>
  <v-navigation-drawer
    v-model="menu.active"
    app
    :mini-variant="menu.drawerMini"
    mini-variant-width="68"
    clipped
    mobile-break-point="960"
    v-if="isLogged()"
  >
    <v-list shaped>
      <v-tooltip
        v-if="menu.drawerMini"
        right
        open-delay="400"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on }">
          <v-list-item
            link
            @click="menu.drawerMini = !menu.drawerMini"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon>fas fa-arrow-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </template>
        <span class="text-right caption font-weight-light">Expand</span>
      </v-tooltip>

      <v-list-item two-line :to="'/users/' + loginUser._id">
        <v-list-item-avatar v-if="loginUser.image">
          <img :src="loginUser.image" />
        </v-list-item-avatar>
        <v-list-item-avatar color="primary" v-else>
          <v-icon>fas fa-user</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ loginUser.firstName }}</v-list-item-title>
          <v-list-item-subtitle>{{ loginUser.username }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action link class="hidden-sm-and-down">
          <v-icon @click="menu.drawerMini = !menu.drawerMini"
            >fas fa-arrow-left</v-icon
          >
        </v-list-item-action>
      </v-list-item>

      <v-divider class="mt-1 mb-1"></v-divider>

      <template v-if="menu.drawerMini">
        <v-tooltip
          transition="slide-x-transition"
          open-delay="300"
          right
          v-for="item in menu.links"
          :key="item.name"
        >
          <template v-slot:activator="{ on }">
            <v-list-item
              v-on="on"
              link
              :to="item.link"
              v-if="item.roles.includes(loginUser.rol.value)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span class="text-right caption font-weight-light">{{
            item.name
          }}</span>
        </v-tooltip>
        <v-divider class="mt-1 mb-1"></v-divider>
        <v-tooltip
          transition="slide-x-transition"
          open-delay="300"
          right
          v-for="item in menu.staticLateral"
          :key="item.name"
        >
          <template v-slot:activator="{ on }">
            <v-list-item v-on="on" link :to="`/page/${item.slug}`">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span class="text-right caption font-weight-light">{{
            item.name
          }}</span>
        </v-tooltip>
      </template>

      <template v-else>
        <template v-for="item in menu.links">
          <v-list-item
            link
            v-if="item.roles.includes(loginUser.rol.value)"
            :key="item.name"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider class="mt-1 mb-1"></v-divider>
        <template v-for="item in menu.staticLateral">
          <v-list-item link :key="item.name" :to="`/page/${item.slug}`">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapGetters("user", ["isLogged"]),
    ...mapActions("menu", ["getLateralPages"]),
  },
  created() {
    this.getLateralPages();
  },
};
</script>

<style scoped>
.v-navigation-drawer--clipped:not(.v-navigation-drawer--temporary):not(.v-navigation-drawer--is-mobile) {
  z-index: 2;
}
</style>