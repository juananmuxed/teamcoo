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
            v-model="password.old"
            :rules="[rules.required]"
            :type="password.oldShow ? 'text' : 'password'"
          >
            <template v-slot:append>
              <v-icon
                class="pl-2"
                color="primary"
                @click="password.oldShow = !password.oldShow"
                v-text="password.oldShow ? 'fas fa-eye' : 'fas fa-eye-slash'"
              ></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            outlined
            label="New Password"
            v-model="password.new"
            :rules="[rules.required]"
            :type="password.newShow ? 'text' : 'password'"
          >
            <template v-slot:append>
              <v-icon
                class="pl-2"
                color="primary"
                @click="password.newShow = !password.newShow"
                v-text="password.newShow ? 'fas fa-eye' : 'fas fa-eye-slash'"
              ></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" v-if="isLogged()">
          <v-btn
            block
            depressed
            color="primary"
            @click="changePassword()"
            :disabled="isChangePass() || !isDiferentPass()"
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
            :disabled="!isDiferentPass()"
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