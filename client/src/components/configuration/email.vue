<template>
  <v-skeleton-loader
    type="skeleton"
    :types="{ skeleton: 'card,article, table-tfoot' }"
    class="mx-auto"
    transition="fade-transition"
    :loading="skeleton"
  >
    <v-card flat>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Email Configuration</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="Host"
                  v-model="config.email.host"
                  :rules="[rules.required, rules.validHost]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="8" sm="4" class="py-1">
                <v-select
                  label="Port"
                  v-model="config.email.port"
                  outlined
                  :items="config.ports"
                >
                </v-select>
              </v-col>
              <v-col cols="4" sm="4" class="py-1">
                <v-checkbox
                  v-model="config.email.secure"
                  label="Secure"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="User"
                  v-model="config.email.user"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="Password"
                  type="password"
                  v-model="config.email.pass"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="Sender email"
                  v-model="config.email.email"
                  :rules="[rules.required, rules.emailrules]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="Sender name"
                  v-model="config.email.name"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-textarea
                  outlined
                  auto-grow
                  label="Legal Text"
                  v-model="config.email.legalText"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12" class="py-1">
                <v-text-field
                  outlined
                  label="Email to send test"
                  v-model="config.testEmail"
                  :rules="[rules.required, rules.emailrules]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-btn
                  color="secondary"
                  :loading="config.sendingEmail"
                  :disabled="!isValidEmailConfig() || !isValidEmailTest()"
                  block
                  @click="sendTestEmail()"
                  >Send test email</v-btn
                >
              </v-col>
              <v-col cols="12" class="py-1">
                <v-btn
                  block
                  color="primary"
                  @click="saveEmailConfig()"
                  :disabled="!isValidEmailConfig()"
                  ><v-icon left>fas fa-save</v-icon> Save email config</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState({
      rules: (state) => state.general.rules,
      config: (state) => state.general.config,
    }),
  },
  data() {
    return {
      skeleton: false,
    };
  },
  methods: {
    ...mapActions("general", [
      "searchEmailConfig",
      "saveEmailConfig",
      "sendTestEmail",
    ]),
    ...mapGetters("general", ["isValidEmailConfig", "isValidEmailTest"]),
  },
  async created() {
    this.skeleton = true;
    this.searchEmailConfig().finally(() => {
      this.skeleton = false;
    });
  },
};
</script>