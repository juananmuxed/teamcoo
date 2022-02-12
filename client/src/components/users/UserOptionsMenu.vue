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
      v-if="loginUser.rol.value != 'user' && loginUser.rol.value != 'volu'"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-chip class="mx-1" v-on="on">
          <v-avatar left v-if="user.image != ''"
            ><v-img :src="user.image"></v-img
          ></v-avatar>
          <v-avatar left v-else
            ><v-icon small color="info">fas fa-user</v-icon></v-avatar
          >
          {{ user.username }}
        </v-chip>
      </template>
      <v-list>
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
          :to="'/users/' + user._id"
          v-if="loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'"
        >
          <v-list-item-icon>
            <v-icon small>fas fa-envelope</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Send email</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
import { mapState } from "vuex";
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      loginUser: (state) => state.user.loginUser,
    }),
  },
};
</script>