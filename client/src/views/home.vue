<template>
  <v-container class="pa-12" fluid>
    <v-row class="text-center">
      <v-col cols="12" class="pa-6">
        <p class="display-3 font-weight-thin text-uppercase">Title 1</p>
        <p class="subtitle-1 font-weight-light">Text by presentation of the platform</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <home-buttons></home-buttons>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import homebuttons from '../components/homebuttons.vue'
export default {
  components:{
    'home-buttons':homebuttons
  }
};
</script>