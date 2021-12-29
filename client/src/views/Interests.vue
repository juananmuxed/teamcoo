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
          :options.sync="options"
          :server-items-length="totalInterests"
          :footer-props="{ 'items-per-page-options': [5, 10, 20] }"
          :header-props="{ 'sort-icon': 'fas fa-arrow-up' }"
        >
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
            <v-chip v-if="!item.creator">
              <v-avatar left color="primary"
                ><v-icon x-small>fas fa-user-slash</v-icon></v-avatar
              >Closed account
            </v-chip>
            <v-chip v-else class="mx-1" :to="'/users/' + item.creator._id">
              <v-avatar left v-if="item.creator.image != ''"
                ><v-img :src="item.creator.image"></v-img
              ></v-avatar>
              <v-avatar left v-else
                ><v-icon small color="info">fas fa-user</v-icon></v-avatar
              >
              {{ item.creator.username }}
            </v-chip>
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
import createinterest from "../components/interests/CreateInterest.vue";
import editinterest from "../components/interests/EditInterest.vue";
import confirm from "../components/general/Confirm.vue";
import { idealTextColor } from "../utils/utils";
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
        { text: "Color", value: "color", sortable: false },
        { text: "Creator", value: "creator", sortable: false },
        { text: "", value: "actions", sortable: false },
      ],
    };
  },
  components: {
    "create-interest": createinterest,
    "edit-interest": editinterest,
    "confirmation-template": confirm,
  },
  computed: {
    ...mapState({
      interests: (state) => state.interests.interests,
      interest: (state) => state.interests.interest,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      totalInterests: (state) => state.interests.totalInterests,
      loading: (state) => state.interests.loading,
    }),
    options: {
      get: function () {
        return this.$store.getters["interests/options"];
      },
      set: function (value) {
        this.$store.commit("interests/setOptions", value);
      },
    },
  },
  watch: {
    options: {
      handler() {
        this.loadInterestPaginated();
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