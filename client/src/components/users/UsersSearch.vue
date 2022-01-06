<template>
  <v-autocomplete
    @input="handleInput"
    @click:clear="emitClear"
    @change="emitChange"
    :value="value"
    :items="users"
    outlined
    clearable
    :return-object="returnObject"
    hide-selected
    clear-icon="fas fa-times"
    item-text="name"
    item-value="_id"
    :label="label"
    :prepend-icon="icon"
    :filter="customFilter"
    multiple
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>Search user</v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs" :input-value="data.selected">
        <v-avatar left v-if="data.item.image != ''">
          <v-img :src="data.item.image"></v-img>
        </v-avatar>
        <v-avatar left v-else>
          <v-icon color="primary" small>fas fa-user</v-icon>
        </v-avatar>
        <span class="pr-2">
          {{ data.item.username }}
        </span>
        <v-icon small @click="data.parent.selectItem(data.item)">
          fas fa-times-circle
        </v-icon>
      </v-chip>
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
  computed: {
    ...mapState({
      users: (state) => state.users.users,
    }),
  },
  methods: {
    ...mapActions("users", ["loadUsersSilent"]),
    handleInput(val) {
      this.$emit("input", val);
    },
    emitClear() {
      this.$emit("clear");
    },
    emitChange(val) {
      this.$emit("change", val);
    },
    customFilter(item, queryText) {
      const username = item.username.toLowerCase();
      const firstName = item.firstName.toLowerCase();
      const lastName = item.lastName.toLowerCase();
      const name = firstName + " " + lastName;
      const search = queryText.toLowerCase();

      return (
        username.indexOf(search) > -1 ||
        firstName.indexOf(search) > -1 ||
        lastName.indexOf(search) > -1 ||
        name.indexOf(search) > -1
      );
    },
  },
  created() {
    this.loadUsersSilent();
  },
};
</script>

<style>
</style>