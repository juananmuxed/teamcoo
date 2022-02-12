<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Tasks</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="tasks"
          :headers="headers"
          :loading="loading"
          :options.sync="search.options"
          :server-items-length="totalTasks"
          :footer-props="{ 'items-per-page-options': [5, 10, 20] }"
          :header-props="{ 'sort-icon': 'fas fa-arrow-up' }"
        >
          <template v-slot:top>
            <v-expansion-panels class="mb-3">
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="2">
                      <v-icon>fas fa-search</v-icon>
                    </v-col>
                    <v-col cols="10" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open"
                          >Search by name, description, interests, workgroups,
                          suscriber and creator</span
                        >
                        <v-row v-else>
                          <v-chip
                            class="mx-1"
                            v-if="search.name"
                            v-text="'Text: ' + search.name"
                            color="primary"
                          ></v-chip>
                          <v-chip
                            v-for="(interests, index) in search.interests"
                            class="mx-1"
                            v-text="interests.name"
                            :color="interests.color"
                            :key="index + '_int'"
                          ></v-chip>
                          <v-chip
                            v-if="
                              search.interestsAll &&
                              search.interests.length != 0
                            "
                            color="success"
                            class="mx-1"
                            >All interests</v-chip
                          >
                          <v-chip
                            v-for="(workgroup, index) in search.workgroups"
                            class="mx-1"
                            v-text="workgroup.name"
                            :color="workgroup.color"
                            :key="index + '_wg'"
                          ></v-chip>
                          <v-chip
                            v-if="
                              search.workgroupsAll &&
                              search.workgroups.length != 0
                            "
                            color="success"
                            class="mx-1"
                            >All workgroups</v-chip
                          >
                          <v-chip
                            v-if="search.suscriber && search.suscriber._id"
                            color="secondary"
                            class="mx-1"
                            v-text="'Joined: ' + search.suscriber.username"
                          ></v-chip>
                          <v-chip
                            v-if="search.creator && search.creator._id"
                            color="secondary"
                            class="mx-1"
                            v-text="'Creator: ' + search.creator.username"
                          ></v-chip>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="search.name"
                        label="Name or description"
                        clearable
                        clear-icon="fas fa-times"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="11" md="5">
                      <interest-search-component
                        label="Interests"
                        return-object
                        v-model="search.interests"
                      ></interest-search-component>
                    </v-col>
                    <v-col cols="1">
                      <v-switch
                        :disabled="
                          search.interests && search.interests.length == 0
                        "
                        v-model="search.interestsAll"
                        :label="search.interestsAll ? 'All' : 'One'"
                        inset
                      ></v-switch>
                    </v-col>
                    <v-col cols="11" md="5">
                      <workgroup-search-component
                        label="Workgroups"
                        return-object
                        v-model="search.workgroups"
                      ></workgroup-search-component>
                    </v-col>
                    <v-col cols="1">
                      <v-switch
                        :disabled="
                          search.workgroups && search.workgroups.length == 0
                        "
                        v-model="search.workgroupsAll"
                        :label="search.workgroupsAll ? 'All' : 'One'"
                        inset
                      ></v-switch>
                    </v-col>
                    <v-col cols="12" md="6">
                      <user-search-component
                        label="Joined user"
                        return-object
                        v-model="search.suscriber"
                      ></user-search-component>
                    </v-col>
                    <v-col cols="12" md="6">
                      <user-search-component
                        label="Creator"
                        return-object
                        v-model="search.creator"
                      ></user-search-component>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
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
            <v-row>
              <v-col cols="6">
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
                        <v-icon small color="info" v-on="on"
                          >fas fa-user</v-icon
                        >
                      </template>
                    </template>
                    <span class="text-right caption font-weight-light">{{
                      user.username
                    }}</span>
                  </v-tooltip>
                </v-avatar>
              </v-col>
              <v-col cols="6">
                <span
                  :class="
                    item.suscribers.length >= item.limit ? 'success--text' : ''
                  "
                  >{{ item.suscribers.length }}/{{ item.limit }}</span
                >
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color" :text-color="textColor(item.color)">{{
              item.color
            }}</v-chip>
          </template>
          <template v-slot:item.creator="{ item }">
            <user-options-menu-component
              :user="item.creator"
            ></user-options-menu-component>
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
import { idealTextColor } from "../utils/utils";
import InterestsSearchVue from "../components/interests/InterestsSearch.vue";
import CreateTaskVue from "../components/tasks/CreateTask.vue";
import UserSearchVue from "../components/users/UserSearch.vue";
import WorkgroupsSearchVue from "../components/workgroups/WorkgroupsSearch.vue";
import UserOptionsMenuVue from "../components/users/UserOptionsMenu.vue";
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
        { text: "Joined", value: "suscribers", sortable: false, width: 200 },
        {
          text: "Workgroups",
          value: "workgroups",
          sortable: false,
          width: 300,
        },
        { text: "Interests", value: "interests", sortable: false, width: 200 },
        { text: "Creator", value: "creator", sortable: false },
        { text: "Color", value: "color", sortable: false },
        { text: "", value: "actions", sortable: false, width: 80 },
      ],
    };
  },
  components: {
    "create-task": CreateTaskVue,
    "user-search-component": UserSearchVue,
    "interest-search-component": InterestsSearchVue,
    "workgroup-search-component": WorkgroupsSearchVue,
    "user-options-menu-component": UserOptionsMenuVue,
  },
  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      loginUser: (state) => state.user.loginUser,
      search: (state) => state.tasks.search,
      totalTasks: (state) => state.tasks.totalTasks,
      loading: (state) => state.tasks.loading,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  watch: {
    search: {
      handler() {
        if (!this.loading) this.loadTasksPaged();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("tasks", ["loadTasksPaged"]),
    ...mapMutations("tasks", ["clearTaskForm", "randomTaskColor"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
};
</script>