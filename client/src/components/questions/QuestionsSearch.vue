<template>
  <v-autocomplete
    @input="handleInput"
    @click:clear="emitClear"
    @change="emitChange"
    :value="value"
    :items="questions"
    outlined
    clearable
    :return-object="returnObject"
    hide-selected
    clear-icon="fas fa-times"
    item-text="name"
    item-value="_id"
    :label="label"
    :prepend-icon="icon"
    multiple
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>Search question</v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs" :input-value="data.selected" small>
        {{ data.item.name }}
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    value: {
      required: true,
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Search...",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      questions: (state) => state.questions.questions,
    }),
  },
  methods: {
    ...mapActions("questions", ["loadQuestions"]),
    handleInput(val) {
      this.$emit("input", val);
    },
    emitClear() {
      this.$emit("clear");
    },
    emitChange(val) {
      this.$emit("change", val);
    },
  },
  created() {
    this.loadQuestions();
  },
};
</script>

<style>
</style>