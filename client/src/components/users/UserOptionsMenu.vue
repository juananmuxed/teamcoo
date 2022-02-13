<template>
  <span v-if="!user">
    <v-chip>
      <v-avatar left color="primary"
        ><v-icon x-small>fas fa-user-slash</v-icon></v-avatar
      >Closed account
    </v-chip>
  </span>
  <span v-else>
    <v-menu
      bottom
      right
      transition="slide-y-transition"
      origin="top left"
      offset-y
      v-if="
        (loginUser.rol.value != 'user' && loginUser.rol.value != 'volu') ||
        loginUser._id == user._id
      "
    >
      <template v-slot:activator="{ on, attrs }">
        <v-chip class="mx-1" v-on="on" v-bind="attrs">
          <v-avatar left v-if="user.image != ''"
            ><v-img :src="user.image"></v-img
          ></v-avatar>
          <v-avatar left v-else
            ><v-icon small color="info">fas fa-user</v-icon></v-avatar
          >
          {{ user.username }}
        </v-chip>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar v-if="user.image != ''">
              <v-img :src="user.image"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else>
              <v-icon color="info">fas fa-user</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ user.firstName }} {{ user.lastName }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item :to="'/users/' + user._id" dense>
            <v-list-item-icon>
              <v-icon small>fas fa-eye</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>User info</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            dense
            @click="
              setUserToMessage(user);
              clearFormMessage();
              dialogs.sendMessage = true;
            "
            v-if="
              loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'
            "
          >
            <v-list-item-icon>
              <v-icon small>fas fa-envelope</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Send email</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-chip v-else>
      <v-avatar left v-if="user.image != ''"
        ><v-img :src="user.image"></v-img
      ></v-avatar>
      <v-avatar left v-else
        ><v-icon small color="info">fas fa-user</v-icon></v-avatar
      >
      {{ user.username }}
    </v-chip>
  </span>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      dialogs: (state) => state.menu.menu.dialogs,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapMutations("general", ["setUserToMessage", "clearFormMessage"]),
  },
};
</script>