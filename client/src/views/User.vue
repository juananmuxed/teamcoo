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
              <v-col
                cols="12"
                class="text-uppercase display-1 font-weight-thin"
                v-if="searchedUser.workgroups.length !== 0"
              >
                Joined Workgroups
              </v-col>
              <v-row>
                <template v-for="(wg, index) in workgroups">
                  <v-col
                    cols="12"
                    md="6"
                    xl="3"
                    :key="index"
                    v-if="
                      searchedUser.workgroups.some(
                        (workg) => workg._wgId == wg._id
                      )
                    "
                  >
                    <v-card
                      :color="wg.color"
                      :class="`${textColor(wg.color)}--text`"
                    >
                      <v-card-title
                        class="text-uppercase font-weight-thin display-1"
                      >
                        {{ wg.name }}
                        <v-spacer></v-spacer>
                        <v-btn
                          depressed
                          small
                          color="info"
                          :to="'/workgroups/' + wg._id"
                        >
                          More <v-icon small class="ml-3">fas fa-eye</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text :class="`${textColor(wg.color)}--text`">
                        <v-row>
                          <v-col cols="12" class="mb-4">
                            <span class="font-italic">
                              {{ wg.description }}
                            </span>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <span class="text-uppercase title font-weight-light"
                              >Members</span
                            >
                          </v-col>
                        </v-row>
                        <v-row v-if="wg.members && wg.members.length != 0">
                          <v-col cols="12" class="my-1">
                            <v-avatar
                              left
                              v-for="(user, index) in wg.members"
                              :key="index"
                              class="ma-1"
                            >
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <template v-if="user.avatar != ''">
                                    <v-img :src="user.avatar" v-on="on"></v-img>
                                  </template>
                                  <template v-else>
                                    <v-icon color="primary" v-on="on"
                                      >fas fa-user</v-icon
                                    >
                                  </template>
                                </template>
                                <span
                                  class="text-right caption font-weight-light"
                                  >{{ user.username }}</span
                                >
                              </v-tooltip>
                            </v-avatar>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <span class="text-uppercase title font-weight-light"
                              >Answers</span
                            >
                          </v-col>
                        </v-row>
                        <template
                          v-for="(answer, i) in searchedUser.workgroups"
                        >
                          <v-row v-bind:key="i" v-if="answer._wgId == wg._id">
                            <template
                              v-if="
                                !answer.answers.includes(
                                  'Joined by Coordinator/Admin:'
                                )
                              "
                            >
                              <v-list-item
                                v-for="(ans, index) in wg.questions"
                                v-bind:key="index"
                              >
                                <v-list-item-content>
                                  <v-list-item-title
                                    :class="`${textColor(wg.color)}--text`"
                                    >{{ ans.name }}</v-list-item-title
                                  >
                                  <v-list-item-subtitle>
                                    <v-chip-group
                                      column
                                      :class="`${textColor(wg.color)}--text`"
                                    >
                                      <template
                                        v-for="(select, x) in ans.selections"
                                      >
                                        <template v-if="ans.type != 'text'">
                                          <template
                                            v-if="
                                              Array.isArray(
                                                answer.answers[index].answer
                                              )
                                            "
                                          >
                                            <v-chip
                                              x-small
                                              v-bind:key="x"
                                              v-if="
                                                answer.answers[
                                                  index
                                                ].answer.some(
                                                  (a) => a == select
                                                )
                                              "
                                            >
                                              {{ select }}
                                            </v-chip>
                                          </template>
                                          <template v-else>
                                            <v-chip
                                              x-small
                                              v-bind:key="x"
                                              v-if="
                                                answer.answers[index].answer ==
                                                select
                                              "
                                            >
                                              {{ select }}
                                            </v-chip>
                                          </template>
                                        </template>
                                        <span
                                          v-bind:key="x"
                                          v-else
                                          :class="`${textColor(
                                            wg.color
                                          )}--text`"
                                          >{{
                                            answer.answers[index].answer
                                          }}</span
                                        >
                                      </template>
                                    </v-chip-group>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                            <v-list-item v-else>
                              <v-list-item-content>
                                <v-list-item-title
                                  :class="`${textColor(wg.color)}--text`"
                                  >{{ answer.answers }}</v-list-item-title
                                >
                              </v-list-item-content>
                            </v-list-item>
                          </v-row>
                        </template>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </template>
              </v-row>
              <template
                v-if="
                  loginUser.rol.value == 'coor' ||
                  loginUser.rol.value == 'admin'
                "
              >
                <v-col
                  cols="12"
                  class="text-uppercase display-1 font-weight-thin"
                >
                  Comments
                  <v-chip
                    label
                    x-small
                    color="secondary"
                    class="font-weight-light"
                    >In development</v-chip
                  >
                </v-col>
                <v-col cols="12">
                  <v-alert
                    dense
                    color="info"
                    icon="fas fa-comment"
                    border="left"
                  >
                    <v-row align="center" no-gutters>
                      <v-col class="grow"> User </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="shrink"> Date </v-col>
                    </v-row>
                    <v-divider class="my-4" color="primary"></v-divider>
                    <v-row align="center" no-gutters>
                      <v-col class="grow">
                        Proin magna. Vivamus in erat ut urna cursus vestibulum.
                        Etiam imperdiet imperdiet orci.
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="shrink">
                        <v-btn icon>
                          <v-icon small color="error">fas fa-trash</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-alert>
                  <v-badge overlap bordered icon="fas fa-lock">
                    <v-btn block color="primary"
                      ><v-icon small left>fas fa-comments</v-icon>Add
                      comment</v-btn
                    >
                  </v-badge>
                </v-col>
              </template>
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
  },
  created() {
    this.searchUser(this.$route.params.id);
    this.loadQuestions();
    this.loadWorkgroups();
  },
};
</script>