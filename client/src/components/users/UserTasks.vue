<template>
  <v-row>
    <v-col cols="12">
      <tasks-data-iterator-component></tasks-data-iterator-component>
    </v-col>
  </v-row>
</template>

<script>
import TasksDataIteratorVue from "../tasks/TasksDataIterator.vue";

export default {
  components: {
    "tasks-data-iterator-component": TasksDataIteratorVue,
  },
};
</script>