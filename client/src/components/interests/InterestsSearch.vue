<template>
  <v-autocomplete
    @input="handleInput"
    @click:clear="emitClear"
    @change="emitChange"
    :value="value"
    :items="interests"
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
        <v-list-item-title>Search interest</v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        :color="data.item.color"
        small
      >
        {{ data.item.name }}
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title
          :color="item.color"
          v-text="item.name"
        ></v-list-item-title>
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
  data() {
    return {
      searchName: null,
    };
  },
  computed: {
    ...mapState({
      interests: (state) => state.interests.interests,
    }),
  },
  watch: {
    searchName(val) {
      this.searchInterestsByName(val);
    },
  },
  methods: {
    ...mapActions("interests", ["loadInterests"]),
    handleInput(val) {
      this.$emit("input", val);
    },
    emitClear() {
      this.$emit("clear");
    },
    emitChange(val) {
      this.$emit("change", val);
    },
    clearSearch() {
      this.searchName = null;
    },
  },
  created() {
    this.loadInterests();
  },
};
</script>

<style>
</style>