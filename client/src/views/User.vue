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
            v-if="user._id && loginUser.rol.value != 'user'"
            color="rgba(0,0,0,0)"
          >
            <v-overlay absolute :value="user.deleted">
              <v-alert color="error" dark icon="fas fa-archive" dense>
                Archived
              </v-alert>
            </v-overlay>
            <v-row>
              <v-col cols="12" md="5" xl="4">
                <v-card>
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
                          <v-list-item-subtitle>Email</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon disabled>
                            <v-icon color="primary darken-1">
                              fas fa-comment-dots
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>

                      <v-divider inset></v-divider>

                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon color="primary">fas fa-user</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            v-text="user.firstName"
                          ></v-list-item-title>
                          <v-list-item-subtitle>Firstname</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-action></v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="user.lastName"
                          ></v-list-item-title>
                          <v-list-item-subtitle>Lastname</v-list-item-subtitle>
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
                      <template
                        v-if="
                          (loginUser.rol.value == 'admin' ||
                            loginUser.rol.value == 'coor') &&
                          user.rol.value == 'user'
                        "
                      >
                        <v-dialog
                          max-width="650"
                          v-model="dialogs.changeToVolunteer"
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
                                  color="primary"
                                  v-on="{ ...onTooltip, ...onDialog }"
                                >
                                  <v-icon small>fas fa-people-arrows</v-icon>
                                </v-btn>
                              </template>
                              <span class="text-right font-weight-light"
                                >Make Volunteer</span
                              >
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
                        <v-dialog
                          max-width="650"
                          v-model="dialogs.changepassword"
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
                                @click="loadEditedUser"
                                depressed
                                fab
                                small
                                color="info"
                                v-on="{ ...onTooltip, ...onDialog }"
                              >
                                <v-icon small>fas fa-edit</v-icon>
                              </v-btn>
                            </template>
                            <span class="text-right font-weight-light"
                              >Edit</span
                            >
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
                            <span class="text-right font-weight-light"
                              >Close account</span
                            >
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
              </v-col>
              <v-col
                v-if="
                  loginUser.rol.value == 'admin' ||
                  loginUser.rol.value == 'coor' ||
                  loginUser._id == user._id
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
                      v-model="dialogs.editcommonquestion"
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
                      <edit-common-question></edit-common-question>
                    </v-dialog>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <template
              v-if="
                loginUser.rol.value == 'admin' ||
                loginUser.rol.value == 'coor' ||
                loginUser._id == user._id
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
                <v-col
                  v-if="workgroupsByUser.length != 0 && answers.length != 0"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      xl="3"
                      class="pa-3"
                      v-for="(workgroup, indexW) in workgroupsByUser"
                      :key="indexW"
                    >
                      <v-card>
                        <v-img
                          height="100"
                          class="align-end"
                          :style="`background:${workgroup.color}`"
                        >
                        </v-img>
                        <v-card-title class="text-uppercase font-weight-light">
                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-title>{{
                                workgroup.name
                              }}</v-list-item-title>
                            </v-list-item-content>
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
                                            answer.workgroup == workgroup._id &&
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
                                            answer.workgroup == workgroup._id &&
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
                            <v-card-actions v-if="outdated(task.eventEndDate)">
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
import { mapActions, mapMutations, mapState } from "vuex";
import confirm from "../components/general/Confirm.vue";
import invalidstatic from "../components/general/Invalid.vue";
import editcommonquestions from "../components/users/EditCommonQuestions.vue";
import changePassword from "../components/users/ChangePass.vue";
import edituser from "../components/users/EditUser.vue";
import { dateToBeauty, idealTextColor, outdated } from "../utils/utils";
export default {
  components: {
    "edit-user": edituser,
    "confirmation-template": confirm,
    "invalid-static": invalidstatic,
    "change-pass": changePassword,
    "edit-common-question": editcommonquestions,
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
    ...mapActions("users", [
      "searchUser",
      "searchUserSilent",
      "deleteUserSoft",
      "makeUserVolunteer",
    ]),
    ...mapMutations("users", ["loadEditedUser"]),
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
