<template>
  <v-container>
    <change-pass></change-pass>
  </v-container>
</template>

<script>
import ChangePassVue from "../components/users/ChangePass.vue";
export default {
  components: {
    "change-pass": ChangePassVue,
  },
};
</script>