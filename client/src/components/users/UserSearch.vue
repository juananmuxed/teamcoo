<template>
  <v-autocomplete
    @input="handleInput"
    @click:clear="clearValue"
    :items="usersByName"
    outlined
    clearable
    no-filter
    hide-selected
    :loading="isLoadingUser"
    :search-input.sync="searchName"
    clear-icon="fas fa-times"
    item-text="username"
    item-value="_id"
    label="Search new creator"
    placeholder="Search..."
    prepend-icon="fas fa-users"
  >
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
  props: ["value"],
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
    value(val) {
      if (!val) this.clearSearch();
    },
  },
  methods: {
    ...mapActions("users", ["searchUsersByName"]),
    handleInput(val) {
      this.$emit("input", val);
    },
    clearValue() {
      this.value = null;
    },
    clearSearch() {
      this.searchName = null;
    },
  },
};
</script>

<style>
</style>