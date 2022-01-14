<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit "{{ user.username }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" class="py-1">
          <v-text-field
            outlined
            label="First Name"
            v-model="userForm.user.firstName"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="py-1">
          <v-text-field
            outlined
            label="Last Name"
            v-model="userForm.user.lastName"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Username"
            counter
            v-model="userForm.user.username"
            :rules="[rules.nospaces, rules.maxletters, rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1" v-if="loginUser.rol.value == 'admin'">
          <role-select-component
            v-model="userForm.user.rol"
            label="Role"
            return-object
          >
          </role-select-component>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-file-input
            :disabled="userForm.user.image != ''"
            chips
            v-model="userForm.user.imagefile"
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
            v-model="userForm.user.image"
            :disabled="userForm.user.imagefile != null"
            hint="e.g.: https://i.picsum.photos/id/901/200/200.jpg"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-autocomplete
            label="Interests"
            v-model="userForm.user.interests"
            multiple
            chips
            outlined
            :items="interests"
            item-text="name"
            item-value="_id"
            clearable
          >
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip :color="item.color" v-if="index < 3">
                <span>{{ item.name }}</span>
              </v-chip>
              <span v-if="index === 3" class="grey--text caption"
                >(+{{ userForm.user.interests.length - 3 }} others)</span
              >
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
        @click="saveEditedUser()"
        :disabled="!isChangeUser() && !isValidSave()"
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
        @click="loadEditedUser(user)"
        :disabled="!isChangeUser()"
        class="mt-8 mr-12"
      >
        <v-icon small>fas fa-undo</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import RoleSelectorVue from "../general/RoleSelector.vue";
export default {
  components: {
    "role-select-component": RoleSelectorVue,
  },
  computed: {
    ...mapState({
      userForm: (state) => state.users.userForm,
      user: (state) => state.users.user,
      rules: (state) => state.general.rules,
      interests: (state) => state.interests.interests,
      loginUser: (state) => state.user.loginUser,
    }),
  },
  methods: {
    ...mapMutations("users", ["loadEditedUser"]),
    ...mapGetters("users", ["isValidSave", "isChangeUser"]),
    ...mapActions("users", ["saveEditedUser"]),
    ...mapActions("interests", ["loadInterests"]),
  },
  created() {
    this.loadInterests();
  },
};
</script>