<template>
  <v-container class="pa-12" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Workgroups</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="workgroups"
          :headers="headers"
          :loading="loading"
          :options.sync="search.options"
          :server-items-length="totalWorkgroups"
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
                          >Search by name, description, questions, coordinators,
                          members and creator</span
                        >
                        <v-row v-else no-gutters>
                          <v-chip
                            class="mx-1"
                            v-if="search.name"
                            v-text="'Text: ' + search.name"
                            color="primary"
                          ></v-chip>
                          <v-chip
                            v-if="search.coordinator && search.coordinator._id"
                            color="secondary"
                            class="mx-1"
                            v-text="
                              'Coordinator: ' + search.coordinator.username
                            "
                          ></v-chip>
                          <v-chip
                            v-if="search.member && search.member._id"
                            color="secondary"
                            class="mx-1"
                            v-text="'Member: ' + search.member.username"
                          ></v-chip>
                          <v-chip
                            v-if="search.questions.length > 0"
                            color="success"
                            class="mx-1"
                            v-text="
                              search.questionsAll
                                ? 'All of this:'
                                : 'One of this:'
                            "
                          ></v-chip>
                          <v-chip
                            v-for="(question, index) in search.questions"
                            class="mx-1"
                            v-text="question.name"
                            :key="index"
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
                    <v-col cols="12" md="6">
                      <user-search-component
                        label="Coordinator"
                        return-object
                        v-model="search.coordinator"
                      ></user-search-component>
                    </v-col>
                    <v-col cols="12" md="6">
                      <user-search-component
                        label="Member"
                        return-object
                        v-model="search.member"
                      ></user-search-component>
                    </v-col>
                    <v-col cols="11" md="5">
                      <question-search-component
                        label="Questions"
                        return-object
                        v-model="search.questions"
                      ></question-search-component>
                    </v-col>
                    <v-col cols="1">
                      <v-switch
                        :disabled="
                          search.questions && search.questions.length == 0
                        "
                        v-model="search.questionsAll"
                        :label="search.questionsAll ? 'All' : 'One'"
                        inset
                      ></v-switch>
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
              >Loading Work Groups</span
            >
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >No Work Groups</span
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
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color" :text-color="textColor(item.color)">{{
              item.color
            }}</v-chip>
          </template>
          <template v-slot:item.questions="{ item }">
            <v-chip
              small
              class="ma-1"
              v-for="(question, index) in item.questions"
              v-bind:key="index"
              >{{ question.name }}</v-chip
            >
          </template>
          <template v-slot:item.members="{ item }">
            <span v-if="item.members.length == 0">No members</span>
            <template v-else>
              <v-avatar
                size="24px"
                left
                v-for="(user, index) in item.members"
                :key="index"
                class="ma-1"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <template v-if="user.image != ''">
                      <v-img :src="user.image" v-on="on"></v-img>
                    </template>
                    <template v-else>
                      <v-icon small color="primary" v-on="on"
                        >fas fa-user</v-icon
                      >
                    </template>
                  </template>
                  <span class="text-right caption font-weight-light">{{
                    user.username
                  }}</span>
                </v-tooltip>
              </v-avatar>
            </template>
          </template>
          <template v-slot:item.coordinators="{ item }">
            <span v-if="item.coordinators.length == 0">No coordinators</span>
            <template v-else>
              <v-avatar
                size="24px"
                left
                v-for="(user, index) in item.coordinators"
                :key="index"
                class="ma-1"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <template v-if="user.image != ''">
                      <v-img :src="user.image" v-on="on"></v-img>
                    </template>
                    <template v-else>
                      <v-icon small color="primary" v-on="on"
                        >fas fa-user</v-icon
                      >
                    </template>
                  </template>
                  <span class="text-right caption font-weight-light">{{
                    user.username
                  }}</span>
                </v-tooltip>
              </v-avatar>
            </template>
          </template>
          <template v-slot:item.creator="{ item }">
            <user-options-menu-component
              :user="item.creator"
            ></user-options-menu-component>
          </template>
          <template v-slot:item.link="{ item }">
            <template v-if="item.link != ''">
              <v-btn
                depressed
                fab
                x-small
                color="primary"
                :href="item.link"
                target="_blank"
                class="mx-1"
              >
                <v-icon x-small>fas fa-external-link-alt</v-icon>
              </v-btn>
            </template>
          </template>
          <template v-slot:item.dossier="{ item }">
            <template v-if="item.dossier != null">
              <v-btn
                depressed
                fab
                x-small
                color="info"
                :href="item.dossier"
                target="_blank"
                class="mx-1"
              >
                <v-icon x-small>fas fa-file</v-icon>
              </v-btn>
            </template>
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
                  :to="'/workgroups/' + item._id"
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
    <v-dialog max-width="650" v-model="dialogs.createworkgroup">
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
                clearWorkgroupForm();
                randomWorkgroupColor();
              "
              v-if="
                loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'
              "
            >
              <v-icon>fas fa-network-wired</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">Create new</span>
        </v-tooltip>
      </template>
      <create-work-group></create-work-group>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { idealTextColor } from "../utils/utils";
import QuestionsSearchVue from "../components/questions/QuestionsSearch.vue";
import UserSearchVue from "../components/users/UserSearch.vue";
import CreateWorkgroupVue from "../components/workgroups/CreateWorkgroup.vue";
import UserOptionsMenuVue from "../components/users/UserOptionsMenu.vue";
export default {
  data() {
    return {
      headers: [
        {
          text: "Workgroup name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Link", value: "link", sortable: false },
        { text: "Dossier", value: "dossier", sortable: false },
        {
          text: "Coordinators",
          value: "coordinators",
          sortable: false,
          width: 100,
        },
        { text: "Members", value: "members", sortable: false, width: 300 },
        { text: "Questions", value: "questions", sortable: false, width: 300 },
        { text: "Creator", value: "creator" },
        { text: "Color", value: "color" },
        { text: "", value: "actions", sortable: false, width: 80 },
      ],
    };
  },
  components: {
    "create-work-group": CreateWorkgroupVue,
    "user-search-component": UserSearchVue,
    "question-search-component": QuestionsSearchVue,
    "user-options-menu-component": UserOptionsMenuVue,
  },
  computed: {
    ...mapState({
      workgroups: (state) => state.workgroups.workgroups,
      loginUser: (state) => state.user.loginUser,
      totalWorkgroups: (state) => state.workgroups.totalWorkgroups,
      search: (state) => state.workgroups.search,
      loading: (state) => state.workgroups.loading,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  watch: {
    search: {
      handler() {
        if (!this.loading) this.loadWorkgroupsPaginated();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("workgroups", ["loadWorkgroupsPaginated"]),
    ...mapMutations("workgroups", [
      "clearWorkgroupForm",
      "randomWorkgroupColor",
    ]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
};
</script>