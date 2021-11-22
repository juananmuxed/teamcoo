<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Workgroups</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :items="workgroups" :headers="headers" :loading="loading">
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
                    <template v-if="user.avatar != ''">
                      <v-img :src="user.avatar" v-on="on"></v-img>
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
                  color="error"
                  @click="
                    searchQuestion(item);
                    dialogs.confirm = true;
                  "
                  class="mx-1"
                  v-if="loginuser.rol.value == 'admin'"
                >
                  <v-icon x-small>fas fa-trash</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">Delete</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <template
      v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'"
    >
      <v-row class="text-center">
        <v-col>
          <p class="display-1 font-weight-thin text-uppercase">
            Private Workgroups
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :items="secretWorkgroups"
            :headers="headers"
            :loading="loading"
          >
            <template v-slot:loading>
              <span class="display-1 text-uppercase font-weight-thin ma-5"
                >Loading Work Groups</span
              >
            </template>
            <template v-slot:no-data>
              <span class="display-1 text-uppercase font-weight-thin ma-5"
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
    </template>
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
                loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'
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
import createworkgroup from "../components/workgroups/createworkgroup.vue";
import { idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      headers: [
        {
          text: "Work Groups",
          align: "start",
          value: "name",
          width: 100,
        },
        { text: "Description", value: "description", sortable: false },
        { text: "Link", value: "link", sortable: false, width: 30 },
        { text: "Dossier", value: "dossier", sortable: false, width: 30 },
        {
          text: "Coordinators",
          value: "coordinators",
          sortable: false,
          width: 200,
        },
        { text: "Members", value: "members", sortable: false, width: 200 },
        { text: "Questions", value: "questions", sortable: false, width: 200 },
        { text: "Creator", value: "creator", sortable: false, width: 40 },
        { text: "Color", value: "color", sortable: false, width: 40 },
        { text: "", value: "actions", sortable: false, width: 100 },
      ],
    };
  },
  components: {
    "create-work-group": createworkgroup,
  },
  computed: {
    ...mapState({
      workgroups: (state) => state.workgroups.workgroups,
      secretWorkgroups: (state) => state.workgroups.secretWorkgroups,
      loginuser: (state) => state.user.loginuser,
      loading: (state) => state.workgroups.loading,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  methods: {
    ...mapActions("workgroups", ["loadWorkgroups", "loadSecretWorkgroups"]),
    ...mapMutations("workgroups", [
      "clearWorkgroupForm",
      "randomWorkgroupColor",
    ]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadWorkgroups();
    if (
      this.loginuser.rol.value == "admin" ||
      this.loginuser.rol.value == "coor"
    ) {
      this.loadSecretWorkgroups();
    }
  },
};
</script>