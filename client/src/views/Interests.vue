<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Interests</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="interests"
          :headers="headers"
          :loading="loading"
          :options.sync="search.options"
          :server-items-length="totalInterests"
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
                          >Search by name, description and creator</span
                        >
                        <v-row v-else>
                          <v-chip
                            class="mx-1"
                            v-if="search.name"
                            v-text="'Text: ' + search.name"
                            color="primary"
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
                        @input="loadInterestPaginated"
                        v-model="search.name"
                        label="Name or description"
                        clearable
                        clear-icon="fas fa-times"
                        class="mx-4"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <user-search-component
                        label="Search by creator"
                        return-object
                        v-model="search.creator"
                        @change="loadInterestPaginated"
                      ></user-search-component>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-5"
              >Loading Interests</span
            >
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-5"
              >No Interests</span
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
          <template v-slot:item.creator="{ item }">
            <user-options-menu-component
              :user="item.creator"
            ></user-options-menu-component>
          </template>
          <template v-slot:item.color="{ item }">
            <v-chip
              small
              :color="item.color"
              :text-color="textColor(item.color)"
            >
              <span class="text-uppercase">{{ item.color }}</span>
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
                  @click="
                    searchInterest(item);
                    dialogs.editinterest = true;
                  "
                  class="mx-1"
                  v-if="
                    !item.creator ||
                    item.creator._id == loginUser._id ||
                    loginUser.rol.value == 'admin'
                  "
                >
                  <v-icon x-small>fas fa-edit</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">Edit</span>
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
                    searchInterest(item);
                    dialogs.confirm = true;
                  "
                  class="mx-1"
                  v-if="
                    !item.creator ||
                    item.creator._id == loginUser._id ||
                    loginUser.rol.value == 'admin'
                  "
                >
                  <v-icon x-small>fas fa-trash</v-icon>
                </v-btn>
              </template>
              <span class="text-right font-weight-light">Delete</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogs.editinterest" max-width="650">
          <edit-interest></edit-interest>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirm">
          <confirmation-template
            :title="`Delete '${interest.name}'`"
            description="You are about to delete this Question. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{
              id: interest._id,
              name: interest.name,
            }"
            :action="delInterestSoft"
          ></confirmation-template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-dialog
      max-width="650"
      v-model="dialogs.createinterest"
      v-if="loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'"
    >
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
                clearInterestForm();
                randomInterestColor();
              "
            >
              <v-icon>fas fa-address-card</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">Create new</span>
        </v-tooltip>
      </template>
      <create-interest></create-interest>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { idealTextColor } from "../utils/utils";
import UserSearchVue from "../components/users/UserSearch.vue";
import CreateInterestVue from "../components/interests/CreateInterest.vue";
import EditInterestVue from "../components/interests/EditInterest.vue";
import ConfirmVue from "../components/general/Confirm.vue";
import UserOptionsMenuVue from "../components/users/UserOptionsMenu.vue";
export default {
  data() {
    return {
      headers: [
        {
          text: "Interest name",
          align: "start",
          value: "name",
        },
        {
          text: "Description",
          value: "description",
        },
        { text: "Color", value: "color" },
        { text: "Creator", value: "creator" },
        { text: "", value: "actions", sortable: false, width: 120 },
      ],
    };
  },
  components: {
    "create-interest": CreateInterestVue,
    "edit-interest": EditInterestVue,
    "confirmation-template": ConfirmVue,
    "user-search-component": UserSearchVue,
    "user-options-menu-component": UserOptionsMenuVue,
  },
  computed: {
    ...mapState({
      interests: (state) => state.interests.interests,
      interest: (state) => state.interests.interest,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      totalInterests: (state) => state.interests.totalInterests,
      search: (state) => state.interests.search,
      loading: (state) => state.interests.loading,
    }),
  },
  watch: {
    search: {
      handler() {
        if (!this.loading) this.loadInterestPaginated();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("interests", [
      "delInterestSoft",
      "searchInterest",
      "loadInterestPaginated",
    ]),
    ...mapMutations("interests", ["clearInterestForm", "randomInterestColor"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
};
</script>