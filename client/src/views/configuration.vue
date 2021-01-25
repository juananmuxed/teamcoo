<template>
  <v-container class="pa-10" fluid>
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
            <configuration-commonq></configuration-commonq>
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
import general from '../components/configuration/general'
import commonq from '../components/configuration/commonquestions'
import customization from '../components/configuration/customization'
import email from '../components/configuration/email'
export default {
  components: {
      'configuration-general': general,
      'configuration-custom': customization,
      'configuration-commonq': commonq,
      'configuration-email': email,
  },
  computed: {
    ...mapState({
      config: (state) => state.configuration,
    }),
  },
};
</script>
