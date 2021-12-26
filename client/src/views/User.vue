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
          <v-card elevation="0" v-if="user._id" color="rgba(0,0,0,0)">
            <v-overlay absolute :value="user.deleted">
              <v-alert color="error" dark icon="fas fa-archive" dense>
                Archived
              </v-alert>
            </v-overlay>
            <v-row>
              <v-col cols="12" md="4" xl="3">
                <v-card>
                  <v-tooltip bottom transition="scroll-y-transition">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="ml-n12"
                        v-on="on"
                        absolute
                        fab
                        top
                        left
                        color="info"
                        @click="goBack()"
                      >
                        <v-icon>fas fa-arrow-left</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-right caption font-weight-light"
                      >Back</span
                    >
                  </v-tooltip>
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
                    <v-icon size="120" class="pa-6" color="primary"
                      >fas fa-user</v-icon
                    >
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
                          <v-list-item-title
                            v-text="user.email"
                          ></v-list-item-title>
                          <v-list-item-subtitle>Personal</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-divider inset></v-divider>

                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary">fas fa-user</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            v-text="user.firstName + ' ' + user.lastName"
                          ></v-list-item-title>
                          <v-list-item-subtitle>Name</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-action></v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title
                            v-text="user.rol.name"
                          ></v-list-item-title>
                          <v-list-item-subtitle>Role</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

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
                  </v-card-text>

                  <template
                    v-if="
                      loginUser.rol.value == 'admin' ||
                      loginUser._id == user._id
                    "
                  >
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-dialog max-width="650" v-model="dialogs.edituser">
                        <template v-slot:activator="{ on: onDialog }">
                          <v-tooltip
                            top
                            transition="slide-y-reverse-transition"
                            open-delay="100"
                          >
                            <template v-slot:activator="{ on: onTooltip }">
                              <v-btn
                                class="mx-1"
                                @click="loadEditedUser"
                                depressed
                                fab
                                small
                                color="info"
                                v-on="{ ...onTooltip, ...onDialog }"
                              >
                                <v-icon small class="ml-1">fas fa-edit</v-icon>
                              </v-btn>
                            </template>
                            <span class="text-right font-weight-light"
                              >Edit</span
                            >
                          </v-tooltip>
                        </template>
                        <edit-user></edit-user>
                      </v-dialog>
                    </v-card-actions>
                  </template>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="8"
                xl="9"
                class="text-uppercase display-1 font-weight-thin"
              >
                <v-card class="mx-auto">
                  <v-card-title
                    class="text-uppercase headline font-weight-light"
                  >
                    Common Questions
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text> Config sdfdsfdsfs </v-card-text>
                  <v-divider class="my-4"></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-dialog
                      max-width="650"
                      v-model="dialogs.editcommonquestion"
                    >
                      <template v-slot:activator="{ on: onDialog }">
                        <v-tooltip
                          top
                          transition="slide-y-reverse-transition"
                          open-delay="100"
                        >
                          <template v-slot:activator="{ on: onTooltip }">
                            <v-btn
                              class="mx-1"
                              @click="loadEditedUser"
                              depressed
                              fab
                              small
                              color="info"
                              v-on="{ ...onTooltip, ...onDialog }"
                            >
                              <v-icon small class="ml-1"
                                >fas fa-question</v-icon
                              >
                            </v-btn>
                          </template>
                          <span class="text-right font-weight-light"
                            >Answer questions</span
                          >
                        </v-tooltip>
                      </template>
                      <edit-common-question></edit-common-question>
                    </v-dialog>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                class="text-uppercase display-1 font-weight-thin"
              >
                Joined Workgroups
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="workgroups.length != 0 || answers.length != 0">
                <v-data-iterator :items="workgroups" items-per-page.sync="6">
                  <template v-slot:default="props">
                    <v-row>
                      <v-col
                        cols="12"
                        md="4"
                        xl="3"
                        class="pa-3"
                        v-for="(workgroup, index) in props.items"
                        :key="index"
                      >
                        <v-card>
                          <v-img
                            height="100"
                            class="align-end"
                            :style="`background:${workgroup.color}`"
                          >
                          </v-img>
                          <v-card-title
                            class="text-uppercase font-weight-light"
                          >
                            <v-list-item two-line>
                              <v-list-item-content>
                                <v-list-item-title>{{
                                  workgroup.name
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-card-title>
                          <v-card-text>
                            <v-list two-line>
                              <v-list-item
                                v-for="(question, index) in workgroup.questions"
                                :key="index"
                              >
                                <v-list-item-icon>
                                  <v-icon color="secondary">
                                    fas fa-question
                                  </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="question.name"
                                  ></v-list-item-title>
                                  <v-list-item-subtitle
                                    v-if="question.type != 'text'"
                                  >
                                    <v-tooltip
                                      bottom
                                      transition="scroll-y-transition"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" text>Answers</v-btn>
                                      </template>
                                      <v-chip
                                        small
                                        class="mx-1"
                                        v-for="(
                                          answer, index
                                        ) in answers.filter(
                                          (answer) =>
                                            answer.question._id == question._id
                                        )[0].answers"
                                        :key="index"
                                        :color="answer.color"
                                        v-text="answer.name"
                                      ></v-chip>
                                    </v-tooltip>
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle v-else>
                                    <v-tooltip
                                      bottom
                                      transition="scroll-y-transition"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" text>Answer</v-btn>
                                      </template>
                                      <span
                                        v-text="
                                          answers.filter(
                                            (answer) =>
                                              answer.question._id ==
                                              question._id
                                          )[0].text
                                        "
                                      ></span>
                                    </v-tooltip>
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <v-list-item-action-text
                                    v-text="
                                      dateFormated(
                                        answers.filter(
                                          (answer) =>
                                            answer.question._id == question._id
                                        )[0].createdAt
                                      )
                                    "
                                  ></v-list-item-action-text>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
              <v-col class="text-uppercase title font-weight-light" v-else>
                Not joined to workgroups
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                class="text-uppercase display-1 font-weight-thin"
              >
                Joined Tasks
              </v-col>
              List
            </v-row>
          </v-card>
          <invalid-static v-else item="User" goto="/users"></invalid-static>
        </v-skeleton-loader>
        <v-dialog max-width="650" v-model="dialogs.changepassword">
          <change-pass></change-pass>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirmSoft">
          <confirmation-template
            title="Close your account"
            description="You are about to close your account. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: user._id }"
            :confirmationPass="true"
            :action="deleteUserSoft"
          ></confirmation-template>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import confirm from "../components/general/Confirm.vue";
import invalidstatic from "../components/general/Invalid.vue";
import editcommonquestions from "../components/users/EditCommonQuestions.vue";
import changePassword from "../components/users/ChangePass.vue";
import edituser from "../components/users/EditUser.vue";
import { dateToBeauty, idealTextColor } from "../utils/utils";
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
      user: (state) => state.users.user,
      skeleton: (state) => state.users.skeleton,
      skeletonQuestions: (state) => state.questions.skeleton,
      workgroups: (state) => state.workgroups.workgroupsByUser,
      dialogs: (state) => state.menu.menu.dialogs,
      loginUser: (state) => state.user.loginUser,
      answers: (state) => state.questions.answersByUser,
    }),
  },
  methods: {
    ...mapActions("menu", ["goBack"]),
    ...mapActions("users", [
      "searchUser",
      "searchUserSilent",
      "deleteUserSoft",
    ]),
    ...mapMutations("users", ["loadEditedUser"]),
    ...mapActions("questions", ["loadAnswersByUser"]),
    ...mapActions("workgroups", ["loadWorkgroupsByUser"]),
    textColor(color) {
      return idealTextColor(color);
    },
    refreshing() {
      this.polling = setInterval(() => {
        this.searchUserSilent(this.$route.params.id);
        this.loadAnswersByUser(this.$route.params.id);
        this.loadWorkgroupsByUser(this.$route.params.id);
      }, 5 * 60 * 1000);
    },
    dateFormated(date) {
      return dateToBeauty(date);
    },
  },
  created() {
    this.refreshing();
    this.searchUser(this.$route.params.id);
    this.loadAnswersByUser(this.$route.params.id);
    this.loadWorkgroupsByUser(this.$route.params.id);
  },
};
</script>