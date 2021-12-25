<template>
  <v-container class="pa-10">
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader
          type="skeleton"
          :types="{
            skeleton:
              'heading, list-item-avatar, divider, card-heading, list-item-three-line, card-heading, list-item-three-line, actions',
          }"
          class="mx-auto"
          transition="fade-transition"
          :loading="skeleton"
        >
          <v-card elevation="0" v-if="searchedUser._id">
            <v-col cols="12" class="text-uppercase display-1 font-weight-thin">
              Personal information
            </v-col>
            <v-col cols="12">
              <v-card class="mx-auto">
                <v-card-title>
                  <v-btn
                    class="ml-n12"
                    absolute
                    fab
                    top
                    left
                    color="info"
                    @click="goBack()"
                  >
                    <v-icon>fas fa-arrow-left</v-icon>
                  </v-btn>
                  <v-avatar v-if="searchedUser.image" size="32">
                    <img :src="searchedUser.image" />
                  </v-avatar>
                  <v-avatar v-else color="primary" size="32">
                    <v-icon size="16">fas fa-user</v-icon>
                  </v-avatar>
                  <span class="font-weight-light pl-2">{{
                    searchedUser.username
                  }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="mb-4">
                      <span class="text-uppercase headline">E-mail<br /></span>
                      <span class="font-weight-light">
                        {{ searchedUser.email }}
                      </span>
                    </v-col>
                    <v-col cols="12" md="6" class="mb-4">
                      <span class="text-uppercase headline"
                        >First name<br
                      /></span>
                      <span class="font-weight-light">
                        {{ searchedUser.firstname }}
                      </span>
                    </v-col>
                    <v-col cols="12" md="6" class="mb-4">
                      <span class="text-uppercase headline"
                        >Last name<br
                      /></span>
                      <span class="font-weight-light">
                        {{ searchedUser.lastname }}
                      </span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider class="my-4"></v-divider>
                <v-card-actions>
                  <span
                    v-if="
                      searchedUser.membership &&
                      searchedUser.membership.status != 'inactive'
                    "
                  >
                    <v-btn block color="primary" class="my-2" to="/membership">
                      <v-icon left>fas fa-star</v-icon> Go to membership
                    </v-btn>
                  </span>
                  <span v-else>
                    <v-btn block color="info" class="my-2" to="/membership">
                      <v-icon left>fas fa-star</v-icon> Be a member
                    </v-btn>
                  </span>
                  <v-spacer></v-spacer>
                  <v-dialog max-width="650" v-model="dialogs.edituser">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        icon
                        v-if="
                          loginUser.rol.value == 'admin' ||
                          loginUser._id == $route.params.id
                        "
                        ><v-icon
                          color="primary"
                          small
                          @click="loadUserData(searchedUser._id)"
                          >fas fa-edit</v-icon
                        ></v-btn
                      >
                    </template>
                    <edit-user></edit-user>
                  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
            <template v-if="loginUser.rol.value != 'user'">
              <v-skeleton-loader
                type="skeleton"
                :types="{
                  skeleton:
                    'heading, list-item-avatar, divider, card-heading, list-item-three-line, card-heading, list-item-three-line, actions',
                }"
                class="mx-auto py-3"
                :loading="skeletonQuestions"
              >
                <v-col
                  cols="12"
                  class="text-uppercase display-1 font-weight-thin"
                >
                  Extra information
                </v-col>
                <v-col cols="12">
                  <v-card class="mx-auto">
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-uppercase headline font-weight-light"
                        >
                          Common Questions
                        </v-col>
                      </v-row>
                      <v-divider class="my-4 info"></v-divider>
                      <v-row
                        v-for="(question, index) in commonQuestions"
                        v-bind:key="index"
                        class="px-3"
                      >
                        <v-col cols="12" md="6">
                          <v-row class="medium font-weight-bold">{{
                            question.name
                          }}</v-row>
                          <v-row class="caption">{{
                            question.description
                          }}</v-row>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          v-if="
                            searchedUser.commonquestions.some(
                              (q) => q._id == question._id
                            )
                          "
                        >
                          <template v-if="question.type == 'checkbox'">
                            <v-chip
                              class="ma-1"
                              v-for="(
                                answer, i
                              ) in searchedUser.commonquestions.filter(
                                (q) => q._id == question._id
                              )[0].answer"
                              v-bind:key="i"
                              >{{ answer }}</v-chip
                            >
                          </template>
                          <template v-if="question.type == 'text'">
                            {{
                              searchedUser.commonquestions.filter(
                                (q) => q._id == question._id
                              )[0].answer
                            }}
                          </template>
                          <v-chip
                            class="ma-1"
                            v-if="
                              question.type == 'select' ||
                              question.type == 'radio'
                            "
                          >
                            {{
                              searchedUser.commonquestions.filter(
                                (q) => q._id == question._id
                              )[0].answer
                            }}
                          </v-chip>
                        </v-col>
                        <v-col cols="12" md="6" v-else>
                          <span
                            class="pr-4 font-weight-light text-uppercase title"
                          >
                            Not answered
                          </span>
                          <v-btn
                            class="px-10"
                            block
                            color="success"
                            v-if="
                              loginUser.rol.value == 'admin' ||
                              loginUser._id == $route.params.id
                            "
                            @click="dialogs.editcommonquestion = true"
                            >Fill it!</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider class="my-4"></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        v-if="
                          loginUser.rol.value == 'admin' ||
                          loginUser._id == $route.params.id
                        "
                        @click="dialogs.editcommonquestion = true"
                        ><v-icon color="primary" small
                          >fas fa-edit</v-icon
                        ></v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-skeleton-loader>
            </template>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  height="90"
                  @click="dialogs.changepassword = true"
                  block
                  color="accent"
                >
                  <v-icon left>fas fa-key</v-icon> Change your Password
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" v-if="loginUser.rol.value == 'admin'">
                <v-btn
                  height="90"
                  @click="dialogs.confirm = true"
                  block
                  color="error"
                  ><v-icon left>fas fa-trash</v-icon> Delete User</v-btn
                >
              </v-col>
              <v-col cols="12" sm="6" v-if="loginUser._id == $route.params.id">
                <v-btn
                  height="90"
                  @click="dialogs.confirmSoft = true"
                  block
                  color="error"
                  ><v-icon left>fas fa-trash</v-icon> Close your account</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
          <invalid-static v-else item="User" goto="/users"></invalid-static>
        </v-skeleton-loader>
        <v-dialog max-width="650" v-model="dialogs.changepassword">
          <change-pass></change-pass>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirm">
          <confirmation-template
            :title="`Delete ${searchedUser.username}`"
            description="You are about to delete this User. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: searchedUser._id }"
            :confirmationPass="true"
            :action="deleteUser"
          ></confirmation-template>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirmSoft">
          <confirmation-template
            title="Close your account"
            description="You are about to close your account. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: searchedUser._id }"
            :confirmationPass="true"
            :action="deleteUserSoft"
          ></confirmation-template>
        </v-dialog>
        <v-dialog v-model="dialogs.editcommonquestion" max-width="650">
          <edit-common-question></edit-common-question>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import confirm from "../components/general/Confirm.vue";
import invalidstatic from "../components/general/Invalid.vue";
import editcommonquestions from "../components/users/EditCommonQuestions.vue";
import changePassword from "../components/users/ChangePass.vue";
import edituser from "../components/users/EditUser.vue";
import { idealTextColor } from "../utils/utils";
export default {
  components: {
    "edit-user": edituser,
    "confirmation-template": confirm,
    "invalid-static": invalidstatic,
    "change-pass": changePassword,
    "edit-common-question": editcommonquestions,
  },
  computed: {
    ...mapState({
      searchedUser: (state) => state.users.loadedUser,
      skeleton: (state) => state.users.skeleton,
      skeletonQuestions: (state) => state.questions.skeleton,
      workgroups: (state) => state.workgroups.workgroups,
      dialogs: (state) => state.menu.menu.dialogs,
      loginUser: (state) => state.user.loginUser,
      commonQuestions: (state) => state.questions.commonQuestions,
    }),
  },
  methods: {
    ...mapActions("menu", ["goBack"]),
    ...mapActions("users", [
      "searchUser",
      "deleteUser",
      "loadUserData",
      "deleteUserSoft",
    ]),
    ...mapActions("questions", ["loadQuestions"]),
    ...mapActions("workgroups", ["loadWorkgroups"]),
    textColor(color) {
      return idealTextColor(color);
    },
    refreshing() {
      this.polling = setInterval(() => {
        this.searchUser(this.$route.params.id);
        this.loadQuestions();
        this.loadWorkgroups();
      }, 5 * 60 * 1000);
    },
  },
  created() {
    this.refreshing();
    this.searchUser(this.$route.params.id);
    this.loadQuestions();
    this.loadWorkgroups();
  },
};
</script>