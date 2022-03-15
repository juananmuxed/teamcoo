<template>
  <v-data-iterator
    :items="tasks"
    :loading="loading"
    :options.sync="search.options"
    :server-items-length="totalTasks"
    :footer-props="{ 'items-per-page-options': [4, 8, 12] }"
  >
    <template v-slot:header>
      <v-row no-gutters fluid>
        <v-col class="grow">
          <p class="display-1 font-weight-thin text-uppercase">Tasks</p>
        </v-col>
        <v-col class="shrink">
          <v-tooltip
            left
            transition="slide-x-reverse-transition"
            open-delay="100"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                depressed
                right
                color="success lighten-1"
                fab
                v-on="on"
                @click="
                  clearTaskSearch();
                  feedLoad();
                "
                ><v-icon>fas fa-rss</v-icon></v-btn
              >
            </template>
            <span class="text-right caption font-weight-light">Your feed</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row class="mb-1">
        <v-col cols="12" md="3">
          <v-btn
            depressed
            block
            color="success"
            @click="
              clearTaskSearch();
              setOpenedToSearch();
            "
            >Open tasks</v-btn
          >
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            depressed
            block
            color="primary"
            @click="
              clearTaskSearch();
              setJoinedByMeSearch(loginUser);
            "
            >My tasks</v-btn
          >
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            depressed
            block
            color="secondary"
            @click="
              clearTaskSearch();
              setCreatedByMeSearch(loginUser);
            "
            >Created by me</v-btn
          >
        </v-col>
        <v-col cols="12" md="3">
          <v-btn depressed block color="warning" @click="clearTaskSearch"
            >All</v-btn
          >
        </v-col>
      </v-row>
      <v-expansion-panels class="mb-3">
        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="2">
                <v-icon>fas fa-search</v-icon>
              </v-col>
              <v-col cols="9">
                <v-fade-transition leave-absolute>
                  <span v-if="open"
                    >Search by name, description, interests, workgroups,
                    suscriber and creator</span
                  >
                  <v-row v-else no-gutters>
                    <v-chip
                      class="mx-1 "
                      v-if="search.name"
                      v-text="'Text: ' + search.name"
                      color="primary"
                    ></v-chip>
                    <v-chip
                      v-if="
                        search.interests.length > 0 &&
                        search.interests.length <= 3
                      "
                      color="success"
                      class="mx-1"
                      v-text="
                        search.interestsAll ? 'All of this:' : 'One of this:'
                      "
                    ></v-chip>
                    <v-chip
                      v-if="search.interests.length > 3"
                      color="primary"
                      class="mx-1"
                      >Several interests chosen</v-chip
                    >
                    <template v-else>
                      <v-chip
                        v-for="(interests, index) in search.interests"
                        class="mx-1"
                        v-text="interests.name"
                        :color="interests.color"
                        :key="index + '_int'"
                      ></v-chip>
                    </template>
                    <v-chip
                      v-if="
                        search.workgroups.length > 0 &&
                        search.workgroups.length <= 3
                      "
                      color="success"
                      class="mx-1"
                      v-text="
                        search.workgroupsAll ? 'All of this:' : 'One of this:'
                      "
                    ></v-chip>
                    <v-chip
                      v-if="search.workgroups.length > 3"
                      color="primary"
                      class="mx-1"
                      >Several workgroups chosen</v-chip
                    >
                    <template v-else>
                      <v-chip
                        v-for="(workgroup, index) in search.workgroups"
                        class="mx-1"
                        v-text="workgroup.name"
                        :color="workgroup.color"
                        :key="index + '_wg'"
                      ></v-chip>
                    </template>
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
                    <v-chip
                      v-if="search.status != null"
                      :color="search.status == 1 ? 'error' : 'success'"
                      class="mx-1"
                      v-text="search.status == 1 ? 'Closed' : 'Opened'"
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
                  :disabled="search.interests && search.interests.length == 0"
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
                  :disabled="search.workgroups && search.workgroups.length == 0"
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
              <v-col cols="12" md="6">
                <v-select
                  outlined
                  v-model="search.status"
                  :items="[
                    { value: null, text: 'All' },
                    { value: 0, text: 'Opened' },
                    { value: 1, text: 'Closed' },
                  ]"
                  closable
                  label="Status"
                ></v-select>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-slot:loading>
      <v-row>
        <v-col cols="12" class="pa-3 text-center">
          <v-progress-circular
            indeterminate
            :size="50"
            color="primary"
          ></v-progress-circular>
          <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
            >Loading tasks</span
          >
        </v-col>
      </v-row>
    </template>
    <template v-slot:no-data>
      <v-row>
        <v-col cols="12" class="pa-3 text-center">
          <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
            >No tasks</span
          >
        </v-col>
      </v-row>
    </template>
    <template v-slot:default="props">
      <v-row>
        <v-col
          cols="12"
          md="6"
          xl="3"
          class="pa-3"
          v-for="(task, index) in props.items"
          :key="index"
        >
          <task-complete-card-component
            :task="task"
          ></task-complete-card-component>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import InterestsSearchVue from "../interests/InterestsSearch.vue";
import UserSearchVue from "../users/UserSearch.vue";
import WorkgroupsSearchVue from "../workgroups/WorkgroupsSearch.vue";
import TaskCompleteCardVue from "./TaskCompleteCard.vue";
export default {
  components: {
    "user-search-component": UserSearchVue,
    "interest-search-component": InterestsSearchVue,
    "workgroup-search-component": WorkgroupsSearchVue,
    "task-complete-card-component": TaskCompleteCardVue,
  },
  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      loginUser: (state) => state.user.loginUser,
      workgroupsByUser: (state) => state.workgroups.workgroupsByUser,
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
    ...mapActions("workgroups", ["loadWorkgroupsByUser"]),
    ...mapMutations("tasks", [
      "clearTaskForm",
      "randomTaskColor",
      "setWorkgroupsToSearch",
      "setInterestsToSearch",
      "setOpenedToSearch",
      "setCreatedByMeSearch",
      "setJoinedByMeSearch",
      "clearTaskSearch",
    ]),
    async feedLoad() {
      await this.loadWorkgroupsByUser(this.loginUser._id);
      this.setWorkgroupsToSearch(this.workgroupsByUser);
      this.setInterestsToSearch(this.loginUser.interests);
      this.setOpenedToSearch();
      await this.loadTasksPaged();
    },
  },
  async created() {
    await this.feedLoad();
  },
};
</script>