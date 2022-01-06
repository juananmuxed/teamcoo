<template>
  <v-card max-width="650" class="mx-auto" loader-height="8">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit Members from "{{ workgroup.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <template
          v-if="
            loginUser.rol.value == 'admin' ||
            loginUser._id == workgroup.creator._id
          "
        >
          <v-col cols="12" class="py-1 text-uppercase font-weight-light title"
            >Coordinators</v-col
          >
          <v-col cols="12" class="py-1">
            <users-search-component
              label="Coordinators"
              return-object
              v-model="editMemberForm.coordinators"
            ></users-search-component>
          </v-col>
        </template>
        <v-col cols="12" class="py-1 text-uppercase font-weight-light title"
          >Members</v-col
        >
        <v-col cols="12" class="py-1">
          <users-search-component
            label="Members"
            return-object
            v-model="editMemberForm.members"
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
import UsersSearchVue from "../users/UsersSearch.vue";
export default {
  components: {
    "users-search-component": UsersSearchVue,
  },
  computed: {
    ...mapState({
      workgroup: (state) => state.workgroups.workgroup,
      editMemberForm: (state) => state.workgroups.editMemberForm,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapActions("workgroups", ["saveMembers"]),
    ...mapGetters("workgroups", ["editedMembers"]),
    ...mapMutations("workgroups", ["loadMembers"]),
  },
};
</script>