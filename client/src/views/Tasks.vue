<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Tasks</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :items="tasks" :headers="headers" :loading="loading">
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >Loading Tasks</span
            >
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >No Tasks</span
            >
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip bottom max-width="220" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <span
                  class="d-inline-block text-truncate font-italic"
                  style="max-width: 250px"
                  v-on="on"
                  >{{ item.description }}</span
                >
              </template>
              <span class="caption font-italic">{{ item.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.workgroups="{ item }">
            <v-chip
              small
              class="ma-1"
              v-for="(wg, index) in item.workgroups"
              v-bind:key="index"
              :color="wg.color"
              :text-color="textColor(wg.color)"
              :to="'/workgroups/' + wg._id"
              >{{ wg.name }}</v-chip
            >
          </template>
          <template v-slot:item.interests="{ item }">
            <v-chip
              small
              class="ma-1"
              v-for="(interest, index) in item.interests"
              v-bind:key="index"
              :color="interest.color"
              >{{ interest.name }}</v-chip
            >
          </template>
          <template v-slot:item.suscribers="{ item }">
            <v-avatar
              size="24px"
              left
              v-for="(user, index) in item.suscribers"
              :key="index"
              class="ma-1"
            >
              <v-tooltip bottom transition="slide-y-transition">
                <template v-slot:activator="{ on }">
                  <template v-if="user.image != ''">
                    <v-img :src="user.image" v-on="on"></v-img>
                  </template>
                  <template v-else>
                    <v-icon small color="info" v-on="on">fas fa-user</v-icon>
                  </template>
                </template>
                <span class="text-right caption font-weight-light">{{
                  user.username
                }}</span>
              </v-tooltip>
            </v-avatar>
          </template>
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color" :text-color="textColor(item.color)">{{
              item.color
            }}</v-chip>
          </template>
          <template v-slot:item.creator="{ item }">
            <v-chip class="mx-1" :to="'/users/' + item.creator._id">
              <v-avatar left v-if="item.creator.image != ''"
                ><v-img :src="item.creator.image"></v-img
              ></v-avatar>
              <v-avatar left v-else
                ><v-icon small color="info">fas fa-user</v-icon></v-avatar
              >
              {{ item.creator.username }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip
              top
              transition="slide-y-reverse-transition"
              open-delay="100"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  depressed
                  fab
                  x-small
                  v-on="on"
                  color="info"
                  :to="'/tasks/' + item._id"
                  class="mx-1"
                >
                  <v-icon x-small>fas fa-eye</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">See more</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog max-width="650" v-model="dialogs.createtask">
      <template v-slot:activator="{ on: onDialog }">
        <v-tooltip transition="slide-x-transition" open-delay="100" right>
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn
              v-on="{ ...onDialog, ...onTooltip }"
              fab
              left
              top
              absolute
              color="info"
              class="mt-12 ml-2"
              @click="
                clearTaskForm();
                randomTaskColor();
              "
              v-if="
                loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'
              "
            >
              <v-icon>fas fa-tasks</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">Create new</span>
        </v-tooltip>
      </template>
      <create-task></create-task>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import createtask from "../components/tasks/CreateTask.vue";
import { idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      headers: [
        {
          text: "Task name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description", sortable: false },
        { text: "Joined", value: "suscribers", sortable: false },
        {
          text: "Workgroups",
          value: "workgroups",
          sortable: false,
        },
        { text: "Interests", value: "interests", sortable: false },
        { text: "Creator", value: "creator", sortable: false },
        { text: "Color", value: "color", sortable: false },
        { text: "", value: "actions", sortable: false },
      ],
    };
  },
  components: {
    "create-task": createtask,
  },
  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      loginUser: (state) => state.user.loginUser,
      loading: (state) => state.tasks.loading,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  methods: {
    ...mapActions("tasks", ["loadTasks"]),
    ...mapMutations("tasks", ["clearTaskForm", "randomTaskColor"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadTasks();
  },
};
</script>