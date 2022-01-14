<template>
  <v-data-iterator
    :items="tasks"
    :loading="loading"
    :options.sync="search.options"
    :server-items-length="totalTasks"
    :footer-props="{ 'items-per-page-options': [5, 10, 20] }"
  >
    <template v-slot:header>
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
                      v-if="search.interestsAll"
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
                      v-if="search.workgroupsAll"
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
          <v-card>
            <v-img
              v-if="task.image"
              height="200"
              :src="task.image"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.7)"
            >
              <v-chip
                small
                v-for="(workgroup, index) in task.workgroups"
                :key="index"
                :color="workgroup.color"
                class="ma-2"
              >
                <span :class="`${textColor(workgroup.color)}--text`">{{
                  workgroup.name
                }}</span>
              </v-chip>
            </v-img>
            <v-img
              v-else
              height="200"
              class="align-end"
              :gradient="`to bottom, ${task.color}, ${task.color} 30%`"
              :style="`background:linear-gradient(to bottom, ${task.color}, rgba(245,245,245,.2))`"
            >
              <v-chip
                small
                v-for="(workgroup, index) in task.workgroups"
                :key="index"
                :color="workgroup.color"
                class="ma-2"
              >
                <span :class="`${textColor(workgroup.color)}--text`">{{
                  workgroup.name
                }}</span>
              </v-chip>
            </v-img>
            <v-card-title class="text-uppercase font-weight-light">{{
              task.name
            }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <template v-if="task.interests.length != 0">
                <v-row>
                  <h3 class="pa-1">
                    <span class="text-uppercase font-weight-light"
                      >Interests</span
                    >
                  </h3>
                  <v-col cols="12">
                    <v-chip
                      small
                      v-for="(interest, index) in task.interests"
                      :key="index"
                      class="ma-1"
                      >{{ interest.name }}</v-chip
                    >
                  </v-col>
                </v-row>
              </template>
              <template v-if="task.suscribers.length != 0">
                <v-row>
                  <h3 class="pa-1">
                    <span class="text-uppercase font-weight-light"
                      >Volunteers</span
                    >
                  </h3>
                  <v-col cols="12" class="pa-0">
                    <v-avatar
                      left
                      v-for="(user, index) in task.suscribers"
                      :key="index"
                      class="ma-1"
                    >
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <template v-if="user.image != ''">
                            <v-avatar size="36">
                              <img :src="user.image" v-on="on" />
                            </v-avatar>
                          </template>
                          <template v-else>
                            <v-avatar size="36" color="secondary">
                              <v-icon small color="primary" v-on="on"
                                >fas fa-user</v-icon
                              >
                            </v-avatar>
                          </template>
                        </template>
                        <span class="text-right caption font-weight-light">{{
                          user.username
                        }}</span>
                      </v-tooltip>
                    </v-avatar>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
            <v-card-actions>
              <v-chip>
                <v-avatar v-if="task.creator.image != ''" left
                  ><v-img :src="task.creator.image"></v-img
                ></v-avatar>
                <v-avatar v-else left color="primary"
                  ><v-icon x-small>fas fa-user</v-icon></v-avatar
                >
                {{ task.creator.username }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn small color="info" :to="`/tasks/${task._id}`">
                <v-icon left>fas fa-eye</v-icon> See
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { idealTextColor } from "../../utils/utils";
import InterestsSearchVue from "../interests/InterestsSearch.vue";
import UserSearchVue from "../users/UserSearch.vue";
import WorkgroupsSearchVue from "../workgroups/WorkgroupsSearch.vue";
export default {
  components: {
    "user-search-component": UserSearchVue,
    "interest-search-component": InterestsSearchVue,
    "workgroup-search-component": WorkgroupsSearchVue,
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