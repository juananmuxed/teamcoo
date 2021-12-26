<template>
  <v-card max-width="650" class="mx-auto">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit Members from "{{ task.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-autocomplete
            label="Members"
            v-model="tasksForm.task.suscribers"
            multiple
            chips
            outlinedf
            item-value="id"
            item-text="username"
            :items="users"
            :filter="customFilter"
            return-object
          >
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
            <template v-slot:item="data">
              <v-list-item-avatar v-if="data.item.image != ''">
                <img :src="data.item.image" />
              </v-list-item-avatar>
              <v-list-item-avatar v-else color="secondary"
                ><v-icon color="primary"
                  >fas fa-user</v-icon
                ></v-list-item-avatar
              >
              <v-list-item-content>
                <v-list-item-title
                  v-html="
                    data.item.firstName +
                    ' ' +
                    data.item.lastName +
                    ' (' +
                    data.item.username +
                    ')'
                  "
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="data.item.rol.name"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="saveMembers()"
        :disabled="editedMembers()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="info"
        @click="loadMembers()"
        :disabled="editedMembers()"
        class="mt-8 mr-12"
      >
        <v-icon small>fas fa-undo</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      task: (state) => state.tasks.task,
      tasksForm: (state) => state.tasks.tasksForm,
      users: (state) => state.users.users,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapActions("users", ["loadUsersSilent"]),
    ...mapActions("tasks", ["saveMembers"]),
    ...mapGetters("tasks", ["editedMembers"]),
    ...mapMutations("tasks", ["loadMembers"]),
    // TODO: mejorar esta mierda de función de busqueda y extraer
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