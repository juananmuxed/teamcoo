<template>
  <v-row>
    <v-col cols="12">
      <v-data-iterator :items="tasks" items-per-page.sync="6">
        <template v-slot:header>
          <v-toolbar class="mb-1" elevation="0">
            <v-text-field
              v-model="search"
              outlined
              dense
              hide-details
              append-icon="fas fa-search"
              label="Search task"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              outlined
              dense
              hide-details
              :items="keys"
              prepend-inner-icon="fas fa-sort"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn :value="false">
                <v-icon>fas fa-arrow-up</v-icon>
              </v-btn>
              <v-btn :value="true">
                <v-icon>fas fa-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
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
                  v-if="task.image != ''"
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
                  <template v-if="task.usersjoined.length != 0">
                    <v-row>
                      <h3 class="pa-1">
                        <span class="text-uppercase font-weight-light"
                          >Volunteers</span
                        >
                      </h3>
                      <v-col cols="12" class="pa-0">
                        <v-avatar
                          left
                          v-for="(user, index) in task.usersjoined"
                          :key="index"
                          class="ma-1"
                        >
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <template v-if="user.avatar != ''">
                                <v-avatar size="36">
                                  <img :src="user.avatar" v-on="on" />
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
                            <span
                              class="text-right caption font-weight-light"
                              >{{ user.username }}</span
                            >
                          </v-tooltip>
                        </v-avatar>
                      </v-col>
                    </v-row>
                  </template>
                </v-card-text>
                <v-card-actions>
                  <v-chip>
                    <v-avatar v-if="task.creator.avatar != ''" left
                      ><v-img :src="task.creator.avatar"></v-img
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
    </v-col>
    <template
      v-if="
        loginuser.rol.value == 'coor' ||
        loginuser.rol.value == 'admin' ||
        loginuser.rol.value == 'volu'
      "
    >
      <v-col cols="12"><v-divider></v-divider></v-col>
      <v-col cols="12" class="display-1 font-weight-thin text-uppercase">
        Joined Tasks
      </v-col>
      <v-col cols="12">
        <v-data-iterator :items="tasks" items-per-page.sync="6">
          <template v-slot:header>
            <v-toolbar class="mb-1" elevation="0">
              <v-text-field
                v-model="search"
                outlined
                dense
                hide-details
                append-icon="fas fa-search"
                label="Search task"
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row>
              <template v-for="(task, index) in props.items">
                <v-col
                  cols="12"
                  md="6"
                  xl="3"
                  class="pa-3"
                  :key="index + '-own'"
                  v-if="task.usersjoined.some((u) => u.id == loginuser.id)"
                >
                  <v-card>
                    <v-img
                      v-if="task.image != ''"
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
                      <template v-if="task.usersjoined.length != 0">
                        <v-row>
                          <h3 class="pa-1">
                            <span class="text-uppercase font-weight-light"
                              >Volunteers</span
                            >
                          </h3>
                          <v-col cols="12" class="pa-0">
                            <v-avatar
                              left
                              v-for="(user, index) in task.usersjoined"
                              :key="index"
                              class="ma-1"
                            >
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <template v-if="user.avatar != ''">
                                    <v-avatar size="36">
                                      <img :src="user.avatar" v-on="on" />
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
                                <span
                                  class="text-right caption font-weight-light"
                                  >{{ user.username }}</span
                                >
                              </v-tooltip>
                            </v-avatar>
                          </v-col>
                        </v-row>
                      </template>
                    </v-card-text>
                    <v-card-actions>
                      <v-chip>
                        <v-avatar v-if="task.creator.avatar != ''" left
                          ><v-img :src="task.creator.avatar"></v-img
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
              </template>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </template>
    <template
      v-if="loginuser.rol.value == 'coor' || loginuser.rol.value == 'admin'"
    >
      <v-col cols="12"><v-divider></v-divider></v-col>
      <v-col cols="12" class="display-1 font-weight-thin text-uppercase">
        Your Tasks
      </v-col>
      <v-col cols="12">
        <v-data-iterator :items="tasks" items-per-page.sync="6">
          <template v-slot:header>
            <v-toolbar class="mb-1" elevation="0">
              <v-text-field
                v-model="search"
                outlined
                dense
                hide-details
                append-icon="fas fa-search"
                label="Search task"
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col cols="12" class="pa-3">
                <v-dialog max-width="650" v-model="menu.dialogs.createtask">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      block
                      small
                      color="primary"
                      height="120"
                      class="headline"
                      v-on="on"
                    >
                      <v-icon left>fas fa-plus</v-icon> New task
                    </v-btn>
                  </template>
                  <create-new-task></create-new-task>
                </v-dialog>
              </v-col>
              <template v-for="(task, index) in props.items">
                <v-col
                  cols="12"
                  md="6"
                  xl="3"
                  class="pa-3"
                  :key="index + '-own'"
                  v-if="task.creator.id == loginuser.id"
                >
                  <v-card>
                    <v-img
                      v-if="task.image != ''"
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
                      <template v-if="task.usersjoined.length != 0">
                        <v-row>
                          <h3 class="pa-1">
                            <span class="text-uppercase font-weight-light"
                              >Volunteers</span
                            >
                          </h3>
                          <v-col cols="12" class="pa-0">
                            <v-avatar
                              left
                              v-for="(user, index) in task.usersjoined"
                              :key="index"
                              class="ma-1"
                            >
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <template v-if="user.avatar != ''">
                                    <v-avatar size="36">
                                      <img :src="user.avatar" v-on="on" />
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
                                <span
                                  class="text-right caption font-weight-light"
                                  >{{ user.username }}</span
                                >
                              </v-tooltip>
                            </v-avatar>
                          </v-col>
                        </v-row>
                      </template>
                    </v-card-text>
                    <v-card-actions>
                      <v-chip>
                        <v-avatar v-if="task.creator.avatar != ''" left
                          ><v-img :src="task.creator.avatar"></v-img
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
              </template>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { idealTextColor } from "../../utils/utils";
import createtask from "../tasks/createtask.vue";

export default {
  data() {
    return {
      search: "",
      sortBy: "name",
      keys: ["Name"],
      sortDesc: false,
    };
  },
  components: {
    "create-new-task": createtask,
  },
  computed: {
    ...mapState({
      tasks: (state) => state.tasks.tasks,
      loginuser: (state) => state.user.loginuser,
      loading: (state) => state.tasks.loading,
      menu: (state) => state.menu.menu,
    }),
  },
  methods: {
    ...mapMutations("menu", ["cancelDialog"]),
    ...mapActions("tasks", ["loadTasks", "delSomething"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadTasks();
  },
};
</script>