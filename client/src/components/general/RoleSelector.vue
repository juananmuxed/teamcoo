<template>
  <v-select
    @input="handleInput"
    @click:clear="emitClear"
    @change="emitChange"
    :value="value"
    :items="roles"
    outlined
    :clearable="clearable"
    :return-object="returnObject"
    hide-selected
    clear-icon="fas fa-times"
    item-text="name"
    item-value="value"
    :label="label"
    :prepend-icon="icon"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        small
        :input-value="data.selected"
        v-text="data.item.name"
        :color="getColor(data.item.value)"
        :text-color="getTextColor(data.item.value)"
      ></v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title>
          <v-chip
            v-text="item.name"
            :color="getColor(item.value)"
            :text-color="getTextColor(item.value)"
          >
          </v-chip>
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    value: {
      required: true,
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Select",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      roles: (state) => state.roles,
    }),
  },
  methods: {
    getColor(role) {
      return this.$store.getters["users/getRoleColor"](role).color;
    },
    getTextColor(role) {
      return this.$store.getters["users/getRoleColor"](role).textColor;
    },
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
};
</script>

<style>
</style>