<template>
  <v-container class="pa-12">
    <v-row no-gutters>
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
            v-if="workgroup._id && isAccessibleUser(workgroup)"
            max-width="1080"
          >
            <v-overlay absolute :value="workgroup.deleted">
              <v-alert color="error" dark icon="fas fa-archive" dense>
                Archived
              </v-alert>
            </v-overlay>
            <v-img
              height="200"
              class="align-end"
              :style="`background:linear-gradient(to bottom, ${workgroup.color}, rgba(245,245,245,0))`"
            >
            </v-img>
            <v-card-title>
              <v-dialog
                v-if="
                  !workgroup.members.some(
                    (member) => member._id == loginUser._id
                  )
                "
                v-model="dialogs.suscribeto"
                max-width="650"
              >
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
                        color="primary"
                        rounded
                        @click="loadInterests"
                        v-if="!workgroup.secret"
                      >
                        <v-icon>fas fa-user-plus</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-right caption font-weight-light"
                      >Join</span
                    >
                  </v-tooltip>
                </template>
                <suscribe-to-work-group></suscribe-to-work-group>
              </v-dialog>
              <v-dialog
                v-else
                v-model="dialogs.unsuscribeworkgroup"
                max-width="650"
              >
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
                        color="error"
                        rounded
                        v-if="!workgroup.secret"
                      >
                        <v-icon>fas fa-user-minus</v-icon>
                      </v-btn>
                    </template>
                    <span class="text-right caption font-weight-light"
                      >Unjoin</span
                    >
                  </v-tooltip>
                </template>
                <confirmation-template
                  :title="`Unjoin from <span class='${workgroup.color}--text pl-2'>${workgroup.name}</span>`"
                  description="You are about to unjoin this Work Group. Your answers are saved in the Database for future stats. <br><br>Are you sure?"
                  :cancelFunction="null"
                  textButton="Unjoin"
                  :actionparams="{ userId: loginUser._id }"
                  :action="unjoinWorkgroup"
                ></confirmation-template>
              </v-dialog>
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
              <v-tooltip
                top
                :color="
                  workgroup.members.some(
                    (member) => member._id == loginUser._id
                  )
                    ? 'info'
                    : 'error'
                "
                transition="scroll-y-reverse-transition"
              >
                <template v-slot:activator="{ on }">
                  <span
                    v-on="on"
                    class="text-uppercase font-weight-thin display-1"
                    >{{ workgroup.name }}</span
                  >
                </template>
                <span class="text-right caption font-weight-light">{{
                  workgroup.members.some(
                    (member) => member._id == loginUser._id
                  )
                    ? "Joined"
                    : "Unjoined"
                }}</span>
              </v-tooltip>
              <template v-if="workgroup.parent">
                <span class="text-uppercase font-weight-thin subtitle-4 ml-4">
                  in
                </span>
                <v-btn
                  class="ml-4"
                  v-text="workgroup.parent.name"
                  text
                  small
                  :to="`/workgroups/${workgroup.parent._id}`"
                ></v-btn>
              </template>
              <v-spacer></v-spacer>
              <v-chip small label color="secondary" v-if="workgroup.secret">
                Private
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-dialog v-model="dialogs.editmembers" max-width="650">
                <edit-members></edit-members>
              </v-dialog>
              <v-row no-gutters>
                <v-col cols="12" class="mb-4">
                  <span class="font-italic">
                    {{ workgroup.description }}
                  </span>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="6" v-if="workgroup.dossier != null"
                  ><v-btn
                    color="info"
                    target="_blank"
                    :href="workgroup.dossier"
                    block
                    height="80"
                    >Dossier <v-icon right x-small>fas fa-link</v-icon></v-btn
                  ></v-col
                >
                <v-col cols="12" md="6" v-if="workgroup.link != ''"
                  ><v-btn
                    color="accent"
                    target="_blank"
                    :href="workgroup.link"
                    block
                    height="80"
                    >Link to Documents
                    <v-icon right x-small>fas fa-link</v-icon></v-btn
                  ></v-col
                >
              </v-row>
              <v-divider class="my-4"></v-divider>
              <v-toolbar dense elevation="0" color="secondary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Children workgroups</v-toolbar-title
                >
              </v-toolbar>
              <v-row no-gutters>
                <v-col v-if="childreWorkgroups.length != 0">
                  <v-data-iterator
                    :items="childreWorkgroups"
                    items-per-page.sync="6"
                  >
                    <template v-slot:default="props">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          xl="3"
                          class="pa-3"
                          v-for="(child, index) in props.items"
                          :key="index"
                        >
                          <v-hover>
                            <template v-slot:default="{ hover }">
                              <v-card>
                                <v-img
                                  height="100"
                                  class="align-end"
                                  :style="`background:${child.color}`"
                                >
                                </v-img>
                                <v-card-title
                                  class="text-uppercase font-weight-light"
                                >
                                  <v-list-item two-line>
                                    <v-list-item-content>
                                      <v-list-item-title>{{
                                        child.name
                                      }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-card-title>
                                <v-fade-transition>
                                  <v-overlay
                                    v-if="hover"
                                    absolute
                                    color="#036358"
                                  >
                                    <v-btn
                                      :to="`/workgroups/${child._id}`"
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
                    </template>
                  </v-data-iterator>
                </v-col>
                <v-col class="text-uppercase title font-weight-light" v-else>
                  No children workgroups
                </v-col>
              </v-row>
              <v-divider class="my-4"></v-divider>
              <v-toolbar dense elevation="0" color="primary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Coordinators</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="
                    loginUser.rol.value == 'admin' ||
                    loginUser._id == workgroup.creator._id ||
                    workgroup.coordinators.some(
                      (coor) => coor._id == loginUser._id
                    )
                  "
                  depressed
                  small
                  color="secondary"
                  @click="
                    loadMembers();
                    dialogs.editmembers = true;
                  "
                  >Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn
                >
              </v-toolbar>
              <v-row no-gutters
                v-if="
                  workgroup.coordinators && workgroup.coordinators.length != 0
                "
              >
                <v-col cols="12" class="my-1">
                  <user-options-menu-component
                    v-for="(user, index) in workgroup.coordinators"
                    v-bind:key="index"
                    :user="user"
                  ></user-options-menu-component>
                </v-col>
              </v-row>
              <v-row no-gutters v-else>
                <v-col class="text-uppercase title font-weight-light">
                  No coordinators for this workgroup
                </v-col>
              </v-row>
              <v-toolbar dense elevation="0" color="secondary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Members</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="
                    loginUser.rol.value == 'admin' ||
                    loginUser._id == workgroup.creator._id ||
                    workgroup.coordinators.some(
                      (coor) => coor._id == loginUser._id
                    )
                  "
                  depressed
                  small
                  color="primary"
                  @click="
                    loadMembers();
                    dialogs.editmembers = true;
                  "
                  >Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn
                >
              </v-toolbar>
              <v-row no-gutters v-if="workgroup.members && workgroup.members.length != 0">
                <v-col cols="12" class="my-1">
                  <user-options-menu-component
                    v-for="(user, index) in workgroup.members"
                    v-bind:key="index"
                    :user="user"
                  ></user-options-menu-component>
                </v-col>
              </v-row>
              <v-row no-gutters v-else>
                <v-col class="text-uppercase title font-weight-light">
                  No members for this workgroup
                </v-col>
              </v-row>
              <v-divider class="my-4"></v-divider>
              <v-toolbar dense elevation="0" color="primary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Tasks</v-toolbar-title
                >
              </v-toolbar>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="mb-4"
                  v-if="tasksByWorkgroup.length > 0"
                >
                  <v-data-iterator
                    :items="tasksByWorkgroup"
                    items-per-page.sync="6"
                  >
                    <template v-slot:default="props">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="4"
                          xl="3"
                          class="pa-3"
                          v-for="(task, index) in props.items"
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
                        </v-col>
                      </v-row>
                    </template>
                  </v-data-iterator>
                </v-col>
                <v-col class="text-uppercase title font-weight-light" v-else>
                  No task for this workgroup
                </v-col>
              </v-row>
            </v-card-text>
            <template
              v-if="
                loginUser.rol.value == 'admin' ||
                loginUser._id == workgroup.creator._id ||
                workgroup.coordinators.some((coor) => coor._id == loginUser._id)
              "
            >
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-dialog max-width="650" v-model="dialogs.editworkgroup">
                  <template v-slot:activator="{ on: onDialog }">
                    <v-tooltip
                      top
                      transition="slide-y-reverse-transition"
                      open-delay="100"
                    >
                      <template v-slot:activator="{ on: onTooltip }">
                        <v-btn
                          class="mx-1"
                          @click="loadEditedWorkgroup"
                          depressed
                          fab
                          small
                          color="info"
                          v-on="{ ...onTooltip, ...onDialog }"
                        >
                          <v-icon small class="ml-1">fas fa-edit</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-right font-weight-light">Edit</span>
                    </v-tooltip>
                  </template>
                  <edit-work-group></edit-work-group>
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
                          @click="loadEditedWorkgroup"
                          depressed
                          fab
                          small
                          color="error"
                          v-on="{ ...onTooltip, ...onDialog }"
                        >
                          <v-icon small class="ml-1">fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span class="text-right font-weight-light">Delete</span>
                    </v-tooltip>
                  </template>
                  <confirmation-template
                    :title="`Delete ${workgroup.name}`"
                    description="You are about to delete this Work Group. <br><br>Are you sure?"
                    :cancelFunction="null"
                    textButton="Delete"
                    :actionparams="{ id: workgroup._id }"
                    :action="delWorkgroupSoft"
                  ></confirmation-template>
                </v-dialog>
              </v-card-actions>
            </template>
          </v-card>
          <invalid-static
            v-else
            item="Workgroup"
            goto="/workgroups"
          ></invalid-static>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { dateToBeauty, outdated } from "../utils/utils";
import SuscribeToVue from "../components/workgroups/SuscribeTo.vue";
import EditWorkgroupVue from "../components/workgroups/EditWorkgroup.vue";
import ConfirmVue from "../components/general/Confirm.vue";
import EditMembersVue from "../components/workgroups/EditMembers.vue";
import InvalidVue from "../components/general/Invalid.vue";
import UserOptionsMenuVue from "../components/users/UserOptionsMenu.vue";
export default {
  data() {
    return {
      polling: null,
    };
  },
  components: {
    "suscribe-to-work-group": SuscribeToVue,
    "edit-work-group": EditWorkgroupVue,
    "confirmation-template": ConfirmVue,
    "edit-members": EditMembersVue,
    "invalid-static": InvalidVue,
    "user-options-menu-component": UserOptionsMenuVue,
  },
  computed: {
    ...mapState({
      workgroup: (state) => state.workgroups.workgroup,
      childreWorkgroups: (state) => state.workgroups.childreWorkgroups,
      tasksByWorkgroup: (state) => state.tasks.tasksByWorkgroup,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      skeleton: (state) => state.workgroups.skeleton,
    }),
  },
  methods: {
    ...mapActions("workgroups", [
      "searchWorkgroup",
      "delWorkgroupSoft",
      "unjoinWorkgroup",
      "searchWorkgroupSilent",
      "loadChildrenWorkgroups",
    ]),
    ...mapActions("menu", ["goBack"]),
    ...mapActions("interests", ["loadInterests"]),
    ...mapActions("tasks", ["loadTasksByWorkgroup"]),
    ...mapMutations("workgroups", ["loadMembers", "loadEditedWorkgroup"]),
    refreshing() {
      this.polling = setInterval(() => {
        this.searchWorkgroupSilent(this.$route.params.id);
        this.loadChildrenWorkgroups(this.$route.params.id);
        this.loadTasksByWorkgroup(this.$route.params.id);
      }, 5 * 60 * 1000);
    },
    dateFormated(date) {
      return dateToBeauty(date);
    },
    outdated(date) {
      return outdated(date);
    },
    isAccessibleUser(workgroup) {
      return this.$store.getters["workgroups/isAccessibleUser"](workgroup);
    },
  },
  created() {
    this.refreshing();
    this.searchWorkgroup(this.$route.params.id);
    this.loadChildrenWorkgroups(this.$route.params.id);
    this.loadTasksByWorkgroup(this.$route.params.id);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>