<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit User</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" class="py-1">
          <v-text-field
            outlined
            label="First Name"
            v-model="edituser.firstname"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="py-1">
          <v-text-field
            outlined
            label="Last Name"
            v-model="edituser.lastname"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Username"
            counter
            v-model="edituser.username"
            :rules="[rules.nospaces, rules.maxletters, rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-file-input
            :disabled="edituser.image != ''"
            chips
            v-model="edituser.imagefile"
            label="Avatar"
            accept="image/png, image/jpeg, image/bmp , image/gif"
            :show-size="1000"
            outlined
            :clearable="false"
            prepend-icon="fas fa-camera"
            hint="PNG, JPEG, GIF or BMP"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Link to Avatar"
            v-model="edituser.image"
            :disabled="edituser.imagefile != null"
            hint="e.g.: https://i.picsum.photos/id/901/200/200.jpg"
          >
          </v-text-field>
        </v-col>
        <v-slide-y-transition origin="center center">
          <v-btn
            fab
            right
            small
            top
            absolute
            color="primary"
            @click="saveEditedData(edituser)"
            v-show="isChangeUser() && !isValidSave()"
            class="mt-8 mr-12"
          >
            <v-icon small>fas fa-save</v-icon>
          </v-btn>
        </v-slide-y-transition>
        <v-slide-y-transition origin="center center">
          <v-btn
            fab
            right
            small
            top
            absolute
            color="info"
            @click="undoEdit()"
            v-show="isChangeUser()"
            class="mt-8"
          >
            <v-icon small>fas fa-undo</v-icon>
          </v-btn>
        </v-slide-y-transition>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      edituser: (state) => state.users.editUser,
      rules: (state) => state.general.rules,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapMutations("users", ["undoEdit"]),
    ...mapGetters("users", ["isValidSave", "isChangeUser"]),
    ...mapActions("users", ["saveEditedData"]),
  },
};
</script>