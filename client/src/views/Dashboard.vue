<template>
  <v-container class="pa-12" fluid>
    <alert-messages-component></alert-messages-component>
    <v-row>
      <v-col cols="12" class="display-1 font-weight-thin">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              v-if="loginUser.membership.state == 'active'"
              left
              color="info"
              class="pr-1"
              >fas fa-star</v-icon
            >
          </template>
          <span class="text-right caption font-weight-light">Membership</span>
        </v-tooltip>
        {{ loginUser.username }}'s Dashboard
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" v-if="loginUser.verifiedEmail" color="primary"
              >fas fa-check</v-icon
            >
          </template>
          <span class="text-right caption font-weight-light"
            >Verified Email</span
          >
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" xl="2" class="pa-3">
        <private-data-column></private-data-column>
      </v-col>
      <v-col
        cols="12"
        md="8"
        xl="10"
        class="pa-3"
        v-if="loginUser.verifiedEmail && loginUser.rol.value != 'user'"
      >
        <user-tasks></user-tasks>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import PrivateDataVue from "../components/users/PrivateData.vue";
import AlertMessagesVue from "../components/general/AlertMessages.vue";
import UserTasksVue from "../components/users/UserTasks.vue";

export default {
  components: {
    "private-data-column": PrivateDataVue,
    "user-tasks": UserTasksVue,
    "alert-messages-component": AlertMessagesVue,
  },
  computed: {
    ...mapState({
      loginUser: (state) => state.user.loginUser,
    }),
  },
};
</script>