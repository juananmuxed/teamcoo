<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Users</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="users"
          :headers="headers"
          :loading="loading"
          :options.sync="search.options"
          :server-items-length="totalUsers"
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
                          >Search by username, name, role and interests</span
                        >
                        <v-row v-else>
                          <v-chip
                            class="mx-1"
                            v-if="search.name"
                            v-text="'Text: ' + search.name"
                            color="primary"
                          ></v-chip>
                          <v-chip
                            class="mx-1"
                            v-if="search.rol && search.rol.value"
                            v-text="'Role: ' + search.rol.name"
                            :color="getColor(search.rol.value)"
                            :text-color="getTextColor(search.rol.value)"
                          ></v-chip>
                          <v-chip
                            v-if="search.interests.length > 0"
                            color="success"
                            class="mx-1"
                            v-text="
                              search.interestsAll
                                ? 'All of this:'
                                : 'One of this:'
                            "
                          ></v-chip>
                          <v-chip
                            v-for="(interest, index) in search.interests"
                            class="mx-1"
                            v-text="interest.name"
                            :color="interest.color"
                            :key="index"
                          ></v-chip>
                          <v-chip
                            v-if="search.workgroups.length > 0"
                            color="success"
                            class="mx-1"
                            v-text="
                              search.workgroupsAll
                                ? 'All of this:'
                                : 'One of this:'
                            "
                          ></v-chip>
                          <v-chip
                            v-for="(workgroup, index) in search.workgroups"
                            class="mx-1"
                            v-text="workgroup.name"
                            :color="workgroup.color"
                            :key="index + '_wg'"
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
                        label="Username or name"
                        clearable
                        clear-icon="fas fa-times"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <role-select-component
                        label="Role"
                        return-object
                        clearable
                        v-model="search.rol"
                      >
                      </role-select-component>
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
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin"
              >No Users</span
            >
          </template>
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >Loading Users</span
            >
          </template>
          <template v-slot:no-results>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4"
              >No Users found</span
            >
          </template>
          <template v-slot:item.rol="{ item }">
            <v-chip
              class="text-uppercase"
              :color="getColor(item.rol.value)"
              :text-color="getTextColor(item.rol.value)"
              >{{ item.rol.name }}</v-chip
            >
          </template>
          <template v-slot:item.username="{ item }">
            <v-avatar v-if="item.image" size="32">
              <img :src="item.image" />
            </v-avatar>
            <v-avatar v-else color="primary" size="32">
              <v-icon size="18">fas fa-user</v-icon>
            </v-avatar>
            <span class="font-italic pl-3">{{ item.username }}</span>
          </template>
          <template v-slot:item.name="{ item }"
            >{{ item.firstName }} {{ item.lastName }}</template
          >
          <template v-slot:item.createdAt="{ item }">
            <v-chip color="secondary" small>{{
              formatDate(item.createdAt)
            }}</v-chip>
          </template>
          <template v-slot:item.interests="{ item }">
            <v-chip
              small
              class="ma-1"
              v-for="(interest, index) in item.interests"
              v-bind:key="index"
              :color="interest.color"
              v-text="interest.name"
            >
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
                  :to="'/users/' + item._id"
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
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import RoleSelectorVue from "../components/general/RoleSelector.vue";
import InterestsSearchVue from "../components/interests/InterestsSearch.vue";
import WorkgroupsSearchVue from "../components/workgroups/WorkgroupsSearch.vue";
import { dateToFormat, idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      headers: [
        {
          text: "Username",
          value: "username",
        },
        {
          text: "Role",
          value: "rol",
          sortable: true,
        },
        {
          text: "Name",
          value: "name",
          sortable: true,
        },
        {
          text: "Interests",
          value: "interests",
          sortable: false,
          width: 400,
        },
        {
          text: "Registration date",
          value: "createdAt",
          sortable: true,
        },
        {
          text: "",
          value: "actions",
          sortable: false,
          width: 120,
        },
      ],
    };
  },
  components: {
    "interest-search-component": InterestsSearchVue,
    "role-select-component": RoleSelectorVue,
    "workgroup-search-component": WorkgroupsSearchVue,
  },
  computed: {
    ...mapState({
      users: (state) => state.users.users,
      loginUser: (state) => state.user.loginUser,
      search: (state) => state.users.search,
      totalUsers: (state) => state.users.totalUsers,
      loading: (state) => state.users.loading,
    }),
  },
  watch: {
    search: {
      handler() {
        if (!this.loading) this.loadUsersPaginated();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("users", ["loadUsersPaginated"]),
    getColor(role) {
      return this.$store.getters["users/getRoleColor"](role).color;
    },
    getTextColor(role) {
      return this.$store.getters["users/getRoleColor"](role).textColor;
    },
    textColor(color) {
      return idealTextColor(color);
    },
    formatDate(date) {
      return dateToFormat(date);
    },
  },
};
</script>