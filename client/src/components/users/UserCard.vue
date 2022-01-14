<template>
  <v-card :disabled="disabled">
    <v-img
      v-if="user.image"
      height="200"
      :src="user.image"
      class="align-end"
      gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.4)"
    >
      <h2 class="pa-3" v-text="user.username"></h2>
    </v-img>
    <v-img v-else height="200" class="align-end">
      <v-icon size="120" class="pa-6" color="primary">fas fa-user</v-icon>
      <h2 class="pa-3" v-text="user.username"></h2>
    </v-img>

    <v-divider></v-divider>

    <v-card-text>
      <v-list two-line>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">fas fa-envelope</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="user.email"></v-list-item-title>
            <v-list-item-subtitle>Email</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="sendMessage">
            <v-btn icon disabled>
              <v-icon color="primary darken-1"> fas fa-comment-dots </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">fas fa-user</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="user.firstName"></v-list-item-title>
            <v-list-item-subtitle>Firstname</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user.lastName"></v-list-item-title>
            <v-list-item-subtitle>Lastname</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user.rol.name"></v-list-item-title>
            <v-list-item-subtitle>Role</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <template v-if="user.membership.status == 'active'">
          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">fas fa-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Membership</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <template v-if="interests">
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">fas fa-address-card</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Interests</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-chip
          class="ma-1"
          v-for="(interest, index) in user.interests"
          :key="index"
          :color="interest.color"
          v-text="interest.name"
        ></v-chip>
      </template>
    </v-card-text>

    <template
      v-if="loginUser.rol.value == 'admin' || loginUser._id == user._id"
    >
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template
          v-if="
            (loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor') &&
            user.rol.value == 'user'
          "
        >
          <v-dialog max-width="650" v-model="dialogs.changeToVolunteer">
            <template v-slot:activator="{ on: onDialog }">
              <v-tooltip
                max-width="200"
                left
                transition="slide-x-reverse-transition"
                open-delay="100"
              >
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn
                    class="mx-1"
                    depressed
                    fab
                    small
                    color="primary"
                    v-on="{ ...onTooltip, ...onDialog }"
                  >
                    <v-icon small>fas fa-people-arrows</v-icon>
                  </v-btn>
                </template>
                <span class="text-right font-weight-light">Make Volunteer</span>
              </v-tooltip>
            </template>
            <confirmation-template
              title="Make this user Volunteer"
              description="You are about to close change the role of this user. <br><br>Are you sure?"
              :cancelFunction="null"
              textButton="Make new volunteer"
              :actionparams="{ id: user._id }"
              :action="makeUserVolunteer"
            ></confirmation-template>
          </v-dialog>
        </template>
        <template v-if="loginUser._id == user._id">
          <v-dialog max-width="650" v-model="dialogs.changepassword">
            <template v-slot:activator="{ on: onDialog }">
              <v-tooltip
                max-width="200"
                left
                transition="slide-x-reverse-transition"
                open-delay="100"
              >
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn
                    class="mx-1"
                    depressed
                    fab
                    small
                    color="accent"
                    v-on="{ ...onTooltip, ...onDialog }"
                  >
                    <v-icon small>fas fa-key</v-icon>
                  </v-btn>
                </template>
                <span class="text-right font-weight-light"
                  >Change password</span
                >
              </v-tooltip>
            </template>
            <change-pass></change-pass>
          </v-dialog>
        </template>
        <v-dialog max-width="650" v-model="dialogs.edituser">
          <template v-slot:activator="{ on: onDialog }">
            <v-tooltip
              max-width="200"
              left
              transition="slide-x-reverse-transition"
              open-delay="100"
            >
              <template v-slot:activator="{ on: onTooltip }">
                <v-btn
                  class="mx-1"
                  @click="loadEditedUser(user)"
                  depressed
                  fab
                  small
                  color="info"
                  v-on="{ ...onTooltip, ...onDialog }"
                >
                  <v-icon small>fas fa-edit</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">Edit</span>
            </v-tooltip>
          </template>
          <edit-user></edit-user>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirmSoft">
          <template v-slot:activator="{ on: onDialog }">
            <v-tooltip
              max-width="200"
              left
              transition="slide-x-reverse-transition"
              open-delay="100"
            >
              <template v-slot:activator="{ on: onTooltip }">
                <v-btn
                  class="mx-1"
                  depressed
                  fab
                  small
                  color="error"
                  v-on="{ ...onTooltip, ...onDialog }"
                >
                  <v-icon small>fas fa-trash</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">Close account</span>
            </v-tooltip>
          </template>
          <confirmation-template
            title="Close this account"
            description="You are about to close this account. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: user._id }"
            :confirmationPass="true"
            :action="deleteUserSoft"
          ></confirmation-template>
        </v-dialog>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import ConfirmVue from "../general/Confirm.vue";
import ChangePassVue from "./ChangePass.vue";
import EditUserVue from "./EditUser.vue";
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    interests: {
      type: Boolean,
      default: false,
    },
    sendMessage: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "change-pass": ChangePassVue,
    "edit-user": EditUserVue,
    "confirmation-template": ConfirmVue,
  },
  computed: {
    ...mapState({
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  methods: {
    ...mapMutations("users", ["loadEditedUser"]),
    ...mapActions("users", ["deleteUserSoft", "makeUserVolunteer"]),
  },
};
</script>