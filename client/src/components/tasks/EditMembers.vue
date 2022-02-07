<template>
  <v-card max-width="650" class="mx-auto">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Subscribers "{{ task.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <users-search-component
            label="Suscribers"
            return-object
            :counter="tasksForm.task.limit"
            v-model="tasksForm.task.suscribers"
          ></users-search-component>
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
        :disabled="editedMembers() || limitExceeded()"
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
import UsersSearchVue from "../users/UsersSearch.vue";
export default {
  components: {
    "users-search-component": UsersSearchVue,
  },
  computed: {
    ...mapState({
      task: (state) => state.tasks.task,
      tasksForm: (state) => state.tasks.tasksForm,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapActions("tasks", ["saveMembers"]),
    ...mapGetters("tasks", ["editedMembers", "limitExceeded"]),
    ...mapMutations("tasks", ["loadMembers"]),
  },
};
</script>