<template>
  <v-container class="pa-10">
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader
          type="skeleton"
          :types="{ skeleton: 'card,article, table-tfoot' }"
          max-width="1080"
          class="mx-auto"
          transition="fade-transition"
          :loading="skeleton"
        >
          <v-card
            class="mx-auto"
            max-width="1080"
            v-if="task._id"
            :disabled="task.deleted"
          >
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
              <span class="text-right caption font-weight-light">Back</span>
            </v-tooltip>
            <v-overlay absolute :value="task.deleted">
              <v-alert color="error" dark icon="fas fa-archive" dense>
                Archived
              </v-alert>
            </v-overlay>
            <v-img
              v-if="task.image"
              height="200"
              :src="task.image"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.4)"
            >
              <template v-for="(workgroup, index) in task.workgroups">
                <v-chip
                  :to="`/workgroups/` + workgroup._id"
                  small
                  :key="index"
                  :color="workgroup.color"
                  :text-color="textColor(workgroup.color)"
                  class="ma-2"
                  v-if="!workgroup.secret"
                >
                  <span :class="`${textColor(workgroup.color)}--text`">{{
                    workgroup.name
                  }}</span>
                </v-chip>
              </template>
            </v-img>
            <v-img
              v-else
              height="200"
              class="align-end"
              :style="`background:linear-gradient(to bottom, ${task.color}, rgba(245,245,245,0))`"
            >
              <template v-for="(workgroup, index) in task.workgroups">
                <v-chip
                  :to="`/workgroups/` + workgroup._id"
                  small
                  :key="index"
                  :color="workgroup.color"
                  :text-color="textColor(workgroup.color)"
                  class="ma-2"
                  v-if="!workgroup.secret"
                >
                  <span :class="`${textColor(workgroup.color)}--text`">{{
                    workgroup.name
                  }}</span>
                </v-chip>
              </template>
            </v-img>
            <v-card-title>
              <v-dialog v-model="dialogs.savemembertask" max-width="650">
                <template v-slot:activator="{ on: onDialog }">
                  <v-tooltip bottom transition="scroll-y-transition">
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn
                        v-on="{ ...onDialog, ...onTooltip }"
                        class="mr-n12"
                        absolute
                        fab
                        top
                        right
                        :color="
                          !task.suscribers.some((m) => m._id == loginUser._id)
                            ? 'primary'
                            : 'secondary'
                        "
                      >
                        <v-icon>{{
                          !task.suscribers.some((m) => m._id == loginUser._id)
                            ? "fas fa-user-plus"
                            : "fas fa-user-minus"
                        }}</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-right caption font-weight-light">{{
                      !task.suscribers.some((m) => m._id == loginUser._id)
                        ? "Join"
                        : "Unjoin"
                    }}</span>
                  </v-tooltip>
                </template>
                <confirmation-template
                  :title="`${
                    !task.suscribers.some((m) => m._id == loginUser._id)
                      ? 'Join'
                      : 'Unjoin'
                  } to ${task.name}</span>`"
                  :description="`You are about to ${
                    !task.suscribers.some((m) => m._id == loginUser._id)
                      ? 'Join'
                      : 'Unjoin'
                  } this Task.<br><br>Are you sure?`"
                  :cancelFunction="null"
                  :textButton="
                    !task.suscribers.some((m) => m._id == loginUser._id)
                      ? 'Join'
                      : 'Unjoin'
                  "
                  :actionparams="{ userId: loginUser._id }"
                  :action="
                    !task.suscribers.some((m) => m._id == loginUser._id)
                      ? joinTask
                      : unjoinTask
                  "
                ></confirmation-template>
              </v-dialog>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="text-uppercase font-weight-thin display-1"
                    v-text="task.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    >{{ dateFormated(task.eventStartDate) }} -
                    {{ dateFormated(task.eventEndDate) }}</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip color="error" v-if="outdated(task.eventEndDate)">
                    <v-icon left>fas fa-clock</v-icon>Outdated
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="mb-4">
                  <span class="font-italic">
                    {{ task.description }}
                  </span>
                </v-col>
              </v-row>
              <v-divider
                class="my-4"
                :color="textColor(task.color)"
              ></v-divider>
              <v-toolbar dense elevation="0" color="secondary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Interests</v-toolbar-title
                >
              </v-toolbar>
              <v-row>
                <v-col v-if="task.interests.length != 0">
                  <v-chip
                    small
                    v-for="(interest, index) in task.interests"
                    :color="interest.color"
                    :text-color="textColor(interest.color)"
                    :key="index"
                    class="ma-1"
                    >{{ interest.name }}</v-chip
                  >
                </v-col>
                <v-col class="text-uppercase title font-weight-light" v-else>
                  No interests
                </v-col>
              </v-row>
              <v-divider
                class="my-4"
                :color="textColor(task.color)"
              ></v-divider>
              <v-toolbar dense elevation="0" color="primary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Members
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogs.editmembers" max-width="650">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="
                        loginUser.rol.value == 'admin' ||
                        loginUser._id == task.creator._id
                      "
                      @click="loadEditedTask()"
                      v-on="on"
                      depressed
                      small
                      class="ml-2"
                      color="secondary"
                      >Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn
                    >
                  </template>
                  <edit-members></edit-members>
                </v-dialog>
              </v-toolbar>
              <v-row v-if="task.suscribers.length != 0">
                <v-col cols="12" class="my-1">
                  <v-chip
                    v-for="(user, index) in task.suscribers"
                    v-bind:key="index"
                    class="mx-1"
                  >
                    <v-avatar left v-if="user.image != ''"
                      ><v-img :src="user.image"></v-img
                    ></v-avatar>
                    <v-avatar left v-else
                      ><v-icon small color="info">fas fa-user</v-icon></v-avatar
                    >
                    {{ user.username }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col class="text-uppercase title font-weight-light">
                  No members
                </v-col>
              </v-row>
            </v-card-text>
            <template
              v-if="
                loginUser.rol.value == 'admin' ||
                loginUser._id == task.creator._id
              "
            >
              <v-divider></v-divider>
              <v-card-actions>
                <v-row>
                  <v-col cols="12" class="font-weight-light ml-5"
                    >Created by
                    <v-chip
                      class="font-italic ml-2"
                      :to="`/users/` + task.creator._id"
                    >
                      <v-avatar left v-if="task.creator.image != ''"
                        ><v-img :src="task.creator.image"></v-img
                      ></v-avatar>
                      <v-avatar left v-else
                        ><v-icon small color="info"
                          >fas fa-user</v-icon
                        ></v-avatar
                      >
                      {{ task.creator.username }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-spacer></v-spacer>
                <v-dialog max-width="650" v-model="dialogs.edittask">
                  <template v-slot:activator="{ on: onDialog }">
                    <v-tooltip
                      top
                      transition="slide-y-reverse-transition"
                      open-delay="100"
                    >
                      <template v-slot:activator="{ on: onTooltip }">
                        <v-btn
                          class="mx-1"
                          @click="loadEditedTask"
                          depressed
                          fab
                          small
                          color="info"
                          v-on="{ ...onTooltip, ...onDialog }"
                          v-if="
                            loginUser.rol.value == 'admin' ||
                            task.creator._id == loginUser._id
                          "
                        >
                          <v-icon small class="ml-1">fas fa-edit</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-right font-weight-light">Edit</span>
                    </v-tooltip>
                  </template>
                  <edit-task></edit-task>
                </v-dialog>
                <v-dialog max-width="650" v-model="dialogs.confirm">
                  <template v-slot:activator="{ on: onDialog }">
                    <v-tooltip
                      top
                      transition="slide-y-reverse-transition"
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
                          v-if="
                            loginUser.rol.value == 'admin' ||
                            task.creator._id == loginUser._id
                          "
                        >
                          <v-icon small class="ml-1">fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-right font-weight-light">Delete</span>
                    </v-tooltip>
                  </template>
                  <confirmation-template
                    :title="`Delete ${task.name}`"
                    description="You are about to delete this Task. <br><br>Are you sure?"
                    :cancelFunction="null"
                    textButton="Delete"
                    :action="delTaskSoft"
                  ></confirmation-template>
                </v-dialog>
              </v-card-actions>
            </template>
          </v-card>
          <invalid-static v-else item="Task" goto="/tasks"></invalid-static>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import invalidstatic from "../components/general/Invalid.vue";
import confirm from "../components/general/Confirm.vue";
import edittask from "../components/tasks/EditTask.vue";
import editmembers from "../components/tasks/EditMembers.vue";
import { dateToBeauty, idealTextColor, outdated } from "../utils/utils";
export default {
  data() {
    return {
      polling: null,
    };
  },
  components: {
    "invalid-static": invalidstatic,
    "confirmation-template": confirm,
    "edit-task": edittask,
    "edit-members": editmembers,
  },
  computed: {
    ...mapState({
      task: (state) => state.tasks.task,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      skeleton: (state) => state.tasks.skeleton,
    }),
  },
  methods: {
    ...mapActions("tasks", [
      "searchTask",
      "searchTaskSilent",
      "delTaskSoft",
      "joinTask",
      "unjoinTask",
    ]),
    ...mapActions("menu", ["goBack"]),
    ...mapMutations("tasks", ["loadEditedTask"]),
    refreshing() {
      this.polling = setInterval(() => {
        this.searchTaskSilent(this.$route.params.id);
      }, 5 * 60 * 1000);
    },
    textColor(color) {
      return idealTextColor(color);
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
    this.searchTask(this.$route.params.id);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>