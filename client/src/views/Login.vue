<template>
  <v-container class="pa-2 pt-10 pb-10">
    <login-template></login-template>
  </v-container>
</template>

<script>
import LoginTemplateVue from "../components/general/LoginTemplate.vue";
export default {
  components: {
    "login-template": LoginTemplateVue,
  },
};
</script>