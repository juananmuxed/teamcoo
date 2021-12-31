<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Change your Password</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" v-if="isLogged()">
          <v-text-field
            outlined
            label="Old Password"
            v-model="password.oldpassword"
            :rules="[rules.required]"
            :type="password.oldshow ? 'text' : 'password'"
          >
            <template v-slot:append>
              <v-icon
                class="pl-2"
                color="primary"
                @click="password.oldshow = !password.oldshow"
                >{{
                  password.oldshow ? "fas fa-eye" : "fas fa-eye-slash"
                }}</v-icon
              >
            </template>
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            outlined
            label="New Password"
            v-model="password.newpassword"
            :rules="[rules.required]"
            :type="password.newshow ? 'text' : 'password'"
          >
            <template v-slot:append>
              <v-icon
                class="pl-2"
                color="primary"
                @click="password.newshow = !password.newshow"
                >{{
                  password.newshow ? "fas fa-eye" : "fas fa-eye-slash"
                }}</v-icon
              >
            </template>
          </v-text-field>
          <v-text-field
            outlined
            label="Confirm new Password"
            v-model="password.confirmnewpassword"
            :rules="[
              rules.required,
              rules.passwordconfirm(
                this.password.newpassword,
                this.password.confirmnewpassword
              ),
            ]"
            :type="password.confshow ? 'text' : 'password'"
          >
            <template v-slot:append>
              <v-icon
                class="pl-2"
                color="primary"
                @click="password.confshow = !password.confshow"
                >{{
                  password.confshow ? "fas fa-eye" : "fas fa-eye-slash"
                }}</v-icon
              >
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" v-if="isLogged()">
          <v-btn
            block
            depressed
            color="primary"
            @click="changePassword()"
            :disabled="isChangePass()"
          >
            Change Password
          </v-btn>
        </v-col>
        <v-col cols="12" v-else>
          <v-btn
            block
            depressed
            color="primary"
            @click="changePasswordNotLogged(token)"
            :disabled="isDiferentPass()"
          >
            Change it!
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      token: this.$route.params.token,
    };
  },
  computed: {
    ...mapState({
      password: (state) => state.user.password,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapActions("user", ["changePassword", "changePasswordNotLogged"]),
    ...mapGetters("user", ["isChangePass", "isLogged", "isDiferentPass"]),
  },
};
</script>