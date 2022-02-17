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
          <v-card
            elevation="0"
            v-if="
              user._id &&
              (loginUser.rol.value != 'user' ||
                loginUser._id == this.$route.params.id)
            "
            color="rgba(0,0,0,0)"
          >
            <v-overlay absolute :value="user.deleted">
              <v-alert color="error" dark icon="fas fa-archive" dense>
                Archived
              </v-alert>
            </v-overlay>
            <v-row>
              <v-col cols="12" md="5" xl="4">
                <v-tooltip
                  max-width="200"
                  bottom
                  transition="scroll-y-transition"
                >
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
                  <span class="text-right caption font-weight-light">Back</span>
                </v-tooltip>
                <user-card-component
                  :user="user"
                  interests
                  sendMessage
                ></user-card-component>
              </v-col>
              <v-col
                cols="12"
                md="7"
                xl="8"
                v-if="loginUser.rol.value == 'user'"
              >
                <v-alert
                  transition="slide-y-transition"
                  border="left"
                  type="error"
                  dismissible
                >
                  <v-row no-gutters align="center">
                    <v-col class="grow"> You are not yet a volunteer </v-col>
                    <v-col class="shrink">
                      <v-btn
                        depressed
                        small
                        color="primary"
                        @click="dialogs.makeVolunteer = true"
                      >
                        Volunteer now
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
                <v-dialog max-width="650" v-model="dialogs.makeVolunteer">
                  <make-volunteer :user="loginUser"></make-volunteer>
                </v-dialog>
              </v-col>
              <v-col
                v-if="
                  isAccessibleVolunteerForUser(user._id) &&
                  loginUser.rol.value != 'user'
                "
                cols="12"
                md="7"
                xl="8"
                class="display-1 font-weight-thin"
              >
                <v-card class="mx-auto">
                  <v-card-title
                    class="text-uppercase headline font-weight-light"
                  >
                    Common Questions
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-list two-line>
                      <v-list-item
                        v-for="(question, index) in commonQuestions"
                        :key="index"
                      >
                        <template>
                          <v-list-item-icon>
                            <v-icon color="secondary"> fas fa-question </v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="question.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              class="text--primary text-uppercase"
                              v-text="question.type"
                            >
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-text="question.description">
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action
                            v-if="
                              answers.filter(
                                (answer) => answer.question == question._id
                              )[0]
                            "
                          >
                            <v-list-item-action-text
                              v-text="
                                dateFormated(
                                  answers.filter(
                                    (answer) => answer.question == question._id
                                  )[0].updatedAt
                                )
                              "
                            ></v-list-item-action-text>
                            <v-tooltip
                              max-width="200"
                              left
                              transition="scroll-x-reverse-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" color="primary darken-1">
                                  fas fa-eye
                                </v-icon>
                              </template>
                              <span
                                v-if="question.type == 'text'"
                                v-text="
                                  answers.filter(
                                    (answer) => answer.question == question._id
                                  )[0].text
                                "
                              ></span>
                              <v-chip
                                v-else
                                small
                                class="ma-1"
                                v-for="(answer, index) in answers.filter(
                                  (answer) => answer.question == question._id
                                )[0].answers"
                                :key="index"
                                :color="answer.color"
                                v-text="answer.name"
                              ></v-chip>
                            </v-tooltip>
                          </v-list-item-action>
                          <v-list-item-action v-else>
                            <v-tooltip
                              max-width="200"
                              left
                              transition="scroll-x-reverse-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" color="secondary darken-1">
                                  fas fa-exclamation
                                </v-icon>
                              </template>
                              <span class="text-right caption font-weight-light"
                                >Not answered</span
                              >
                            </v-tooltip>
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-dialog
                      max-width="650"
                      v-model="dialogs.editCommonQuestion"
                    >
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
                              color="info"
                              v-on="{ ...onTooltip, ...onDialog }"
                            >
                              <v-icon small>fas fa-question</v-icon>
                            </v-btn>
                          </template>
                          <span class="text-right font-weight-light"
                            >Answer questions</span
                          >
                        </v-tooltip>
                      </template>
                      <edit-common-question :user="user"></edit-common-question>
                    </v-dialog>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <template
              v-if="
                isAccessibleVolunteerForUser(user._id) &&
                loginUser.rol.value != 'user'
              "
            >
              <v-row>
                <v-col
                  cols="12"
                  class="text-uppercase display-1 font-weight-thin"
                >
                  Joined Workgroups
                </v-col>
              </v-row>
              <v-row>
                <v-col v-if="workgroupsByUser.length != 0">
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      xl="3"
                      class="pa-3"
                      v-for="(workgroup, indexW) in workgroupsByUser"
                      :key="indexW"
                    >
                      <template v-if="isWorkgroupPermit(workgroup)">
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
                              <v-list-item-action>
                                <v-tooltip left>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      icon
                                      :to="`/workgroups/${workgroup._id}`"
                                      v-on="on"
                                    >
                                      <v-icon color="primary darken-2"
                                        >fas fa-arrow-right</v-icon
                                      >
                                    </v-btn>
                                  </template>
                                  <span
                                    class="text-right caption font-weight-light"
                                    >See more</span
                                  >
                                </v-tooltip>
                              </v-list-item-action>
                            </v-list-item>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-text>
                            <v-list two-line>
                              <v-list-item
                                v-for="(question, index) in workgroup.questions"
                                :key="index"
                              >
                                <template
                                  v-if="
                                    answers.filter(
                                      (answer) =>
                                        answer.workgroup == workgroup._id &&
                                        answer.question == question._id
                                    )[0]
                                  "
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
                                        max-width="200"
                                        bottom
                                        transition="scroll-y-transition"
                                      >
                                        <template v-slot:activator="{ on }">
                                          <span v-on="on">
                                            Answers<v-icon right
                                              >fas fa-eye</v-icon
                                            >
                                          </span>
                                        </template>
                                        <v-chip
                                          small
                                          class="ma-1"
                                          v-for="(
                                            answer, index
                                          ) in answers.filter(
                                            (answer) =>
                                              answer.workgroup ==
                                                workgroup._id &&
                                              answer.question == question._id
                                          )[0].answers"
                                          :key="index"
                                          :color="answer.color"
                                          v-text="answer.name"
                                        ></v-chip>
                                      </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle v-else>
                                      <v-tooltip
                                        max-width="200"
                                        bottom
                                        transition="scroll-y-transition"
                                      >
                                        <template v-slot:activator="{ on }">
                                          <span v-on="on">
                                            Answer<v-icon right
                                              >fas fa-eye</v-icon
                                            >
                                          </span>
                                        </template>
                                        <span
                                          v-text="
                                            answers.filter(
                                              (answer) =>
                                                answer.workgroup ==
                                                  workgroup._id &&
                                                answer.question == question._id
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
                                              answer.workgroup ==
                                                workgroup._id &&
                                              answer.question == question._id
                                          )[0].updatedAt
                                        )
                                      "
                                    ></v-list-item-action-text>
                                  </v-list-item-action>
                                </template>
                                <template v-else>
                                  <v-list-item-icon>
                                    <v-icon color="secondary">
                                      fas fa-question
                                    </v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title
                                      v-text="question.name"
                                    ></v-list-item-title>
                                    <v-list-item-subtitle>
                                      <v-tooltip
                                        max-width="200"
                                        bottom
                                        transition="scroll-y-transition"
                                      >
                                        <template v-slot:activator="{ on }">
                                          <span v-on="on">
                                            Answer<v-icon right
                                              >fas fa-eye</v-icon
                                            >
                                          </span>
                                        </template>
                                        <span
                                          >Not answered, added by Admin or
                                          Coordinator</span
                                        >
                                      </v-tooltip>
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </template>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-col>
                  </v-row>
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
              </v-row>
              <v-row>
                <v-col v-if="tasksByUser.length != 0">
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      xl="3"
                      class="pa-3"
                      v-for="(task, index) in tasksByUser"
                      :key="index"
                    >
                      <template v-if="isTaskPermit(task._id)">
                        <v-hover>
                          <template v-slot:default="{ hover }">
                            <v-card>
                              <v-img
                                v-if="task.image"
                                height="100"
                                :src="task.image"
                                class="align-end"
                              >
                              </v-img>
                              <v-img
                                v-else
                                height="100"
                                class="align-end"
                                :style="`background:${task.color}`"
                              >
                              </v-img>
                              <v-card-title
                                class="text-uppercase font-weight-light"
                              >
                                <v-list-item two-line>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      task.name
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle
                                      >{{ dateFormated(task.eventStartDate) }}
                                      -
                                      {{
                                        dateFormated(task.eventEndDate)
                                      }}</v-list-item-subtitle
                                    >
                                  </v-list-item-content>
                                </v-list-item>
                              </v-card-title>
                              <v-card-actions
                                v-if="outdated(task.eventEndDate)"
                              >
                                <v-spacer></v-spacer>
                                <v-chip color="error">Outdated</v-chip>
                              </v-card-actions>
                              <v-fade-transition>
                                <v-overlay
                                  v-if="hover"
                                  absolute
                                  :color="
                                    outdated(task.eventEndDate)
                                      ? 'error'
                                      : 'primary'
                                  "
                                >
                                  <v-btn
                                    :to="`/tasks/${task._id}`"
                                    color="primary"
                                    fab
                                  >
                                    <v-icon>fas fa-eye</v-icon>
                                  </v-btn>
                                </v-overlay>
                              </v-fade-transition>
                            </v-card>
                          </template>
                        </v-hover>
                      </template>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="text-uppercase title font-weight-light" v-else>
                  Not joined to tasks
                </v-col>
              </v-row>
            </template>
          </v-card>
          <invalid-static v-else item="User" goto="/users"></invalid-static>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { dateToBeauty, idealTextColor, outdated } from "../utils/utils";
import UserCardVue from "../components/users/UserCard.vue";
import EditCommonQuestionsVue from "../components/users/EditCommonQuestions.vue";
import InvalidVue from "../components/general/Invalid.vue";
import MakeVolunteerVue from "../components/users/MakeVolunteer.vue";
export default {
  components: {
    "invalid-static": InvalidVue,
    "edit-common-question": EditCommonQuestionsVue,
    "user-card-component": UserCardVue,
    "make-volunteer": MakeVolunteerVue,
  },
  data() {
    return {
      polling: null,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.users.user,
      skeleton: (state) => state.users.skeleton,
      skeletonQuestions: (state) => state.questions.skeleton,
      workgroupsByUser: (state) => state.workgroups.workgroupsByUser,
      tasksByUser: (state) => state.tasks.tasksByUser,
      commonQuestions: (state) => state.questions.commonQuestions,
      dialogs: (state) => state.menu.menu.dialogs,
      loginUser: (state) => state.user.loginUser,
      answers: (state) => state.questions.answersByUser,
    }),
  },
  methods: {
    ...mapActions("menu", ["goBack"]),
    ...mapActions("users", ["searchUser", "searchUserSilent"]),
    ...mapActions("questions", [
      "loadAnswersByUser",
      "filterAnswer",
      "loadCommonQuestions",
    ]),
    ...mapActions("workgroups", ["loadWorkgroupsByUser"]),
    ...mapActions("tasks", ["loadTasksByUser"]),
    textColor(color) {
      return idealTextColor(color);
    },
    refreshing() {
      this.polling = setInterval(() => {
        this.searchUserSilent(this.$route.params.id);
        this.loadAnswersByUser(this.$route.params.id);
        this.loadWorkgroupsByUser(this.$route.params.id);
        this.loadTasksByUser(this.$route.params.id);
        this.loadCommonQuestions();
      }, 5 * 60 * 1000);
    },
    dateFormated(date) {
      return dateToBeauty(date);
    },
    outdated(date) {
      return outdated(date);
    },
    isAccessibleVolunteerForUser(user) {
      return this.$store.getters["workgroups/isAccessibleVolunteer"](user);
    },
    isWorkgroupPermit(workgroupId) {
      return this.$store.getters["workgroups/isWorkgroupPermit"](workgroupId);
    },
    isTaskPermit(taskId) {
      return this.$store.getters["tasks/isTaskPermit"](taskId);
    },
  },
  created() {
    this.refreshing();
    this.searchUser(this.$route.params.id);
    this.loadAnswersByUser(this.$route.params.id);
    this.loadWorkgroupsByUser(this.$route.params.id);
    this.loadTasksByUser(this.$route.params.id);
    this.loadCommonQuestions();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>
