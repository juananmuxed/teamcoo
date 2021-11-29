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
            :color="workgroup.color"
            :class="`${textColor(workgroup.color)}--text mx-auto`"
            max-width="1080"
            v-if="workgroup._id"
          >
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
              <v-tooltip
                right
                :color="
                  workgroup.members.some((member) => member._id == loginuser.id)
                    ? 'info'
                    : 'error'
                "
                transition="scroll-x-transition"
              >
                <template v-slot:activator="{ on }">
                  <span
                    v-on="on"
                    class="text-uppercase font-weight-thin display-1"
                    >{{ workgroup.name }}</span
                  >
                </template>
                <span class="text-right caption font-weight-light">{{
                  workgroup.members.some((member) => member._id == loginuser.id)
                    ? "Joined"
                    : "Unjoined"
                }}</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-dialog
                v-if="
                  !workgroup.members.some(
                    (member) => member._id == loginuser.id
                  )
                "
                v-model="dialogs.suscribeto"
                max-width="650"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary"
                    rounded
                    @click="loadInterests"
                    v-if="!workgroup.secret"
                    >Join</v-btn
                  >
                </template>
                <suscribe-to-work-group></suscribe-to-work-group>
              </v-dialog>
              <v-dialog
                v-else
                v-model="dialogs.unsuscribeworkgroup"
                max-width="650"
              >
                <template v-slot:activator="{ on }">
                  <v-btn rounded v-on="on" color="secondary">Unjoin</v-btn>
                </template>
                <confirmation-template
                  :title="`Unjoin from <span class='${workgroup.color}--text pl-2'>${workgroup.name}</span>`"
                  description="You are about to unjoin this Work Group. Your answers are saved in the Database for future stats. <br><br>Are you sure?"
                  :cancelFunction="null"
                  textButton="Unjoin"
                  :actionparams="{ userId: loginuser.id }"
                  :action="unjoinWorkgroup"
                ></confirmation-template>
              </v-dialog>
              <v-chip small label color="secondary" v-if="workgroup.secret">
                Private
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text :class="`${textColor(workgroup.color)}--text`">
              <v-dialog v-model="dialogs.editmembers" max-width="650">
                <edit-members></edit-members>
              </v-dialog>
              <v-row>
                <v-col cols="12" class="mb-4">
                  <span class="font-italic">
                    {{ workgroup.description }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
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
              <v-divider
                class="my-4"
                :color="textColor(workgroup.color)"
              ></v-divider>
              <v-toolbar dense elevation="2" color="primary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Coordinators</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="
                    loginuser.rol.value == 'admin' ||
                    loginuser.id == workgroup.creator.id ||
                    workgroup.coordinators.some(
                      (coor) => coor.id == loginuser.id
                    )
                  "
                  depressed
                  small
                  color="secondary"
                  @click="
                    loadMembers({
                      members: workgroup.members,
                      coordinators: workgroup.coordinators,
                    });
                    dialogs.editmembers = true;
                  "
                  >Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn
                >
              </v-toolbar>
              <v-row
                v-if="
                  workgroup.coordinators && workgroup.coordinators.length != 0
                "
              >
                <v-col cols="12" class="my-1">
                  <v-chip
                    v-for="(coor, index) in workgroup.coordinators"
                    v-bind:key="index"
                    class="mx-1"
                  >
                    <v-avatar left v-if="coor.image != ''"
                      ><v-img :src="coor.image"></v-img
                    ></v-avatar>
                    <v-avatar left v-else
                      ><v-icon small color="info">fas fa-user</v-icon></v-avatar
                    >
                    {{ coor.username }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-toolbar dense elevation="2" color="secondary" class="my-1">
                <v-toolbar-title class="text-uppercase title font-weight-light"
                  >Members</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="
                    loginuser.rol.value == 'admin' ||
                    loginuser.id == workgroup.creator.id ||
                    workgroup.coordinators.some(
                      (coor) => coor.id == loginuser.id
                    )
                  "
                  depressed
                  small
                  color="primary"
                  @click="
                    loadMembers({
                      members: workgroup.members,
                      coordinators: workgroup.coordinators,
                    });
                    dialogs.editmembers = true;
                  "
                  >Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn
                >
              </v-toolbar>
              <v-row v-if="workgroup.members && workgroup.members.length != 0">
                <v-col cols="12" class="my-1">
                  <v-chip
                    v-for="(member, index) in workgroup.members"
                    v-bind:key="index"
                    class="mx-1"
                  >
                    <v-avatar left v-if="member.image != ''"
                      ><v-img :src="member.image"></v-img
                    ></v-avatar>
                    <v-avatar left v-else
                      ><v-icon small color="info">fas fa-user</v-icon></v-avatar
                    >
                    {{ member.username }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-divider
                class="my-4"
                :color="textColor(workgroup.color)"
                v-if="workgroup.tasks.length > 0"
              ></v-divider>
              <v-row>
                <v-col cols="12" class="mb-4" v-if="workgroup.tasks.length > 0">
                  <v-data-iterator
                    :items="workgroup.tasks"
                    items-per-page.sync="6"
                  >
                    <template v-slot:default="props">
                      <v-row>
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
                                  v-if="task.image != ''"
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
                                <v-fade-transition>
                                  <v-overlay
                                    v-if="hover"
                                    absolute
                                    color="#036358"
                                  >
                                    <v-btn
                                      :to="`/tasks/${task._id}`"
                                      color="primary"
                                    >
                                      <v-icon left>fas fa-eye</v-icon> See more
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
              </v-row>
            </v-card-text>
            <template
              v-if="
                loginuser.rol.value == 'admin' ||
                loginuser.id == workgroup.creator.id ||
                workgroup.coordinators.some((coor) => coor.id == loginuser.id)
              "
            >
              <v-divider></v-divider>
              <v-card-actions>
                <v-row>
                  <v-col cols="12" class="font-weight-light ml-5"
                    >Created by
                    <v-chip
                      class="font-italic ml-2"
                      :to="`/users/` + workgroup.creator._id"
                    >
                      <v-avatar left v-if="workgroup.creator.image != ''"
                        ><v-img :src="workgroup.creator.image"></v-img
                      ></v-avatar>
                      <v-avatar left v-else
                        ><v-icon small color="info"
                          >fas fa-user</v-icon
                        ></v-avatar
                      >
                      {{ workgroup.creator.username }}
                    </v-chip>
                  </v-col>
                </v-row>
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
                          v-if="
                            loginuser.rol.value == 'admin' ||
                            workgroup.creator.id == loginuser.id ||
                            workgroup.coordinators.some(
                              (coor) => coor.id == loginuser.id
                            )
                          "
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
                          v-if="
                            loginuser.rol.value == 'admin' ||
                            workgroup.creator.id == loginuser.id
                          "
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
import suscribeto from "../components/workgroups/SuscribeTo.vue";
import confirm from "../components/general/Confirm.vue";
import invalidstatic from "../components/general/Invalid.vue";
import editworkgroup from "../components/workgroups/EditWorkgroup.vue";
import editmembers from "../components/workgroups/EditMembers.vue";
import { dateToBeauty, idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      polling: null,
    };
  },
  components: {
    "suscribe-to-work-group": suscribeto,
    "edit-work-group": editworkgroup,
    "confirmation-template": confirm,
    "edit-members": editmembers,
    "invalid-static": invalidstatic,
  },
  computed: {
    ...mapState({
      workgroup: (state) => state.workgroups.workgroup,
      loginuser: (state) => state.user.loginuser,
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
    ]),
    ...mapActions("menu", ["goBack"]),
    ...mapActions("interests", ["loadInterests"]),
    ...mapMutations("workgroups", ["loadMembers", "loadEditedWorkgroup"]),
    refreshing() {
      this.polling = setInterval(() => {
        this.searchWorkgroupSilent(this.$route.params.id);
      }, 5 * 60 * 1000);
    },
    textColor(color) {
      return idealTextColor(color);
    },
    dateFormated(date) {
      return dateToBeauty(date);
    },
  },
  created() {
    this.refreshing();
    if (this.workgroup == {} || this.workgroup._id != this.$route.params.id) {
      this.searchWorkgroup(this.$route.params.id);
    }
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>