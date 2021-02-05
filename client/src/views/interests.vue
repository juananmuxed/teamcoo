<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Interests</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :items="interests" :headers="headers" :loading="loaded">
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5"
              >Loading Interests</span
            >
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin"
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
            <v-chip class="mx-1" :to="'/users/' + item._userId">
              <v-avatar left v-if="item.creator.avatar != ''"><v-img :src="item.creator.avatar"></v-img></v-avatar>
              <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
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
            <v-btn
              depressed
              small
              color="info"
              @click="
                searchInterest(item._id);
                dialogs.editinterest = true;
              "
              class="mx-1"
              v-if="item.creator.id == loginuser.id"
            >
              Edit
              <v-icon x-small class="ml-1">fas fa-edit</v-icon>
            </v-btn>
            <v-btn
              depressed
              small
              color="error"
              @click="
                searchInterest(item._id);
                dialogs.confirm = true;
              "
              class="mx-1"
              v-if="loginuser.rol.value == 'admin'"
            >
              Delete
              <v-icon x-small class="ml-1">fas fa-trash</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogs.editinterest" max-width="650">
          <edit-interest></edit-interest>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirm">
          <confirmation-template
            :title="`Delete '${searchedInterest.name}'`"
            description="You are about to delete this Question. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: searchedInterest._id, name: searchedInterest.name }"
            :action="delInterest"
          ></confirmation-template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row
      class="px-3"
      v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'"
    >
      <v-col>
        <v-dialog max-width="650" v-model="dialogs.createinterest">
          <template v-slot:activator="{ on }">
            <v-btn
              height="160"
              v-on="on"
              block
              color="info"
              class="my-2"
              @click="clearInterestForm();randomInterestColor()"
            >
              <v-icon left>fas fa-question</v-icon>Create Interest
            </v-btn>
          </template>
          <create-interest></create-interest>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import createinterest from "../components/interests/createinterest.vue";
import editinterest from "../components/interests/editinterest.vue";
import confirm from "../components/general/confirm.vue";
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
          sortable: false,
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
      searchedInterest: (state) => state.interests.searchedInterest,
      loginuser: (state) => state.user.loginuser,
      dialogs: (state) => state.menu.menu.dialogs,
      loaded: (state) => state.interests.loaded,
    }),
  },
  methods: {
    ...mapActions("interests", ["loadInterests", "delInterest",'searchInterest']),
    ...mapMutations("interests", ["clearInterestForm","randomInterestColor"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadInterests();
  },
};
</script>