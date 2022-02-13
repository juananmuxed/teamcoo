<template>
  <v-card
    class="mx-auto"
    :loading="emailForm.sending"
    :disabled="emailForm.sending"
  >
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Message to {{ user.username }}</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            outlined
            disabled
            v-model="loginUser.email"
            label="From"
            prepend-inner-icon="fas fa-at"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            disabled
            v-model="user.email"
            label="To"
            prepend-inner-icon="fas fa-at"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            outlined
            v-model="emailForm.subject"
            label="Subject"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-switch v-model="emailForm.anonymous" label="Anonymous"> </v-switch>
        </v-col>
        <v-col cols="12">
          <v-textarea
            outlined
            v-model="emailForm.message"
            label="Message"
            auto-grow
            :rules="[rules.required]"
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        class="mt-8"
        :loading="emailForm.sending"
        :disabled="!validMessage()"
        @click="sendMessage()"
      >
        <v-icon small>fas fa-paper-plane</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      user: (state) => state.general.userEmail,
      loginUser: (state) => state.user.loginUser,
      emailForm: (state) => state.general.emailForm,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapActions("general", ["sendMessage"]),
    ...mapGetters("general", ["validMessage"]),
  },
};
</script>