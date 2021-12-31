<template>
  <v-autocomplete
    @input="handleInput"
    @click:clear="emitClear"
    @change="emitChange"
    :items="usersByName"
    outlined
    clearable
    no-filter
    cache-items
    :return-object="returnObject"
    :loading="isLoadingUser"
    :search-input.sync="searchName"
    clear-icon="fas fa-times"
    item-value="_id"
    :label="label"
    :prepend-icon="icon"
  >
    <template v-slot:selection="{ item }">
      {{ item.firstName + " " + item.lastName + " (" + item.username + ")" }}
    </template>
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>Search user</v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-avatar v-if="item.image != ''">
        <img :src="item.image" />
      </v-list-item-avatar>
      <v-list-item-avatar v-else color="secondary"
        ><v-icon color="primary">fas fa-user</v-icon></v-list-item-avatar
      >
      <v-list-item-content>
        <v-list-item-title
          v-text="
            item.firstName + ' ' + item.lastName + ' (' + item.username + ')'
          "
        ></v-list-item-title>
        <v-list-item-subtitle v-text="item.rol.name"></v-list-item-subtitle>
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
      isLoadingUser: (state) => state.users.isLoadingUser,
      usersByName: (state) => state.users.usersByName,
    }),
  },
  watch: {
    searchName(val) {
      this.searchUsersByName(val);
    },
  },
  methods: {
    ...mapActions("users", ["searchUsersByName"]),
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
};
</script>

<style>
</style>