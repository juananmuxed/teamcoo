<template>
  <v-col>
    <v-row v-if="!loginUser.verifiedEmail" class="px-3">
      <v-col class="subtitle-1 font-weight-light text-justify">
        You need verify your email to edit or change data from this web.
        <v-btn
          color="primary"
          :loading="sendingEmail"
          block
          class="my-6"
          @click="sendVerificationMail(loginUser.email)"
        >
          Verify your Email
        </v-btn>
      </v-col>
    </v-row>
    <user-card-component
      :user="loginUser"
      :disabled="!loginUser.verifiedEmail"
    ></user-card-component>
    <workgroups-card-component></workgroups-card-component>
  </v-col>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WorkgroupsCardVue from "../workgroups/WorkgroupsCard.vue";
import UserCardVue from "./UserCard.vue";

export default {
  components: {
    "user-card-component": UserCardVue,
    "workgroups-card-component": WorkgroupsCardVue,
  },
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      sendingEmail: (state) => state.user.sendingEmail,
    }),
  },
  methods: {
    ...mapActions("user", ["sendVerificationMail"]),
  },
};
</script>