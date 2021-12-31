<template>
  <v-container>
    <v-card max-width="650" class="mx-auto pa-2">
      <v-card-title class="headline font-weight-medium text-uppercase"
        >Reset your password</v-card-title
      >
      <v-card-text>
        <p>
          Have you forgotten your password? <br />Enter your email account and
          you will receive a message to change your password
        </p>
        <v-row>
          <v-col cols="12">
            <v-text-field
              outlined
              label="Email"
              v-model="user.email"
              :rules="[rules.required, rules.emailrules]"
            >
              <template v-slot:append>
                <v-slide-x-transition>
                  <v-icon
                    color="primary"
                    v-if="user.email != ''"
                    @click="user.email = ''"
                    >fas fa-times</v-icon
                  >
                </v-slide-x-transition>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              block
              depressed
              color="primary"
              @click="sendResetPassMail(user.email)"
              :disabled="invalidEmail()"
              :loading="user.loading"
            >
              Send email
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapActions("user", ["sendResetPassMail"]),
    ...mapGetters("user", ["invalidEmail"]),
  },
};
</script>