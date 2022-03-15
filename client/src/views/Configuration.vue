<template>
  <v-container class="pa-12" fluid>
    <v-col cols="12" class="mb-3 text-uppercase display-1 font-weight-thin">
      Portal Configuration
    </v-col>
    <v-card>
      <v-tabs grow v-model="config.tab">
        <v-tab v-for="(tab, index) in config.tabs" v-bind:key="index"
          ><v-icon left>{{ tab.icon }}</v-icon
          >{{ tab.name }}</v-tab
        >
      </v-tabs>
      <v-tabs-items v-model="config.tab">
        <v-tab-item>
          <configuration-general></configuration-general>
        </v-tab-item>
        <v-tab-item>
          <configuration-common-question></configuration-common-question>
        </v-tab-item>
        <v-tab-item>
          <configuration-custom></configuration-custom>
        </v-tab-item>
        <v-tab-item>
          <configuration-email></configuration-email>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import GeneralVue from "../components/configuration/General.vue";
import CustomizationVue from "../components/configuration/Customization.vue";
import CommonQuestionsVue from "../components/configuration/CommonQuestions.vue";
import EmailVue from "../components/configuration/Email.vue";
export default {
  components: {
    "configuration-general": GeneralVue,
    "configuration-custom": CustomizationVue,
    "configuration-common-question": CommonQuestionsVue,
    "configuration-email": EmailVue,
  },
  computed: {
    ...mapState({
      config: (state) => state.general,
    }),
  },
};
</script>
