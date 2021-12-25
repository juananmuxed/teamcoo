<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Users</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="users"
          :headers="headers"
          :search="search"
          :loading="loading"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search by name"
              class="mx-4"
              append-icon="fas fa-search"
              outlined
            ></v-text-field>
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin"
              >No Users</span
            >
          </template>
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >Loading Users</span
            >
          </template>
          <template v-slot:no-results>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >No Users found</span
            >
          </template>
          <template v-slot:item.role="{ item }">
            <v-chip
              class="text-uppercase"
              :color="getColor(item.rol.value)"
              :text-color="getTextColor(item.rol.value)"
              >{{ item.rol.name }}</v-chip
            >
          </template>
          <template v-slot:item.username="{ item }">
            <v-avatar v-if="item.image" size="32">
              <img :src="item.image" />
            </v-avatar>
            <v-avatar v-else color="primary" size="32">
              <v-icon size="18">fas fa-user</v-icon>
            </v-avatar>
            <span class="font-italic pl-3">{{ item.username }}</span>
          </template>
          <template v-slot:item.name="{ item }"
            >{{ item.firstName }} {{ item.lastName }}</template
          >
          <template v-slot:item.interests="{ item }">
            <v-chip
              small
              class="ma-1"
              v-for="(interest, index) in item.interests"
              v-bind:key="index"
              :color="interest.color"
            >
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn depressed color="info" :to="'/users/' + item._id">
              See more <v-icon small class="ml-3">fas fa-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="px-3">
      <v-col>
        <v-btn
          height="160"
          block
          color="success"
          class="my-2"
          @click="loadUsers()"
        >
          <v-icon left>fas fa-sync-alt</v-icon>Refresh list
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Users",
          value: "username",
        },
        {
          text: "Role",
          value: "role",
          sortable: true,
        },
        {
          text: "Name",
          value: "name",
          sortable: true,
        },
        {
          text: "Interests",
          value: "interests",
          sortable: false,
        },
        {
          text: "",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      users: (state) => state.users.users,
      loginUser: (state) => state.user.loginUser,
      loading: (state) => state.users.loading,
    }),
  },
  methods: {
    ...mapActions("users", ["loadUsers"]),
    getColor(role) {
      return this.$store.getters["users/getRoleColor"](role).color;
    },
    getTextColor(role) {
      return this.$store.getters["users/getRoleColor"](role).textColor;
    },
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadUsers();
  },
};
</script>