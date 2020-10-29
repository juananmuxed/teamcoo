<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Questions</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="questions"
          :headers="headers"
          :loading="loading.questions"
        >
          <template v-slot:loading>
              <span class="display-1 text-uppercase font-weight-thin ma-5">Loading Questions</span>
          </template>
          <template v-slot:no-data>
              <span class="display-1 text-uppercase font-weight-thin">No Questions</span>
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip bottom max-width="220" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <span
                  class="d-inline-block text-truncate font-italic"
                  style="max-width: 250px;"
                  v-on="on"
                >{{ item.description }}</span>
              </template>
              <span class="caption font-italic">{{ item.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.creator="{ item }">{{ item.creator.firstname }}</template>
          <template v-slot:item.type="{ item }">
            <span class="text-uppercase">{{ item.type }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn depressed color="info" @click="searchQuestion(item._id);dialogs.editquestion = true" class="mx-1" v-if="item.creator.id == loginuser.id">
              Edit
              <v-icon x-small class="ml-1">fas fa-edit</v-icon>
            </v-btn>
            <v-btn depressed color="error" @click="searchQuestion(item._id);dialogs.confirm = true" class="mx-1" v-if="loginuser.rol.value == 'admin'">
              Delete
              <v-icon x-small class="ml-1">fas fa-trash</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.selections="{ item }">
            <template v-if="item.type == 'text'">
              <span>Open Answer</span>
            </template>
            <template v-else>
              <v-chip
                small
                v-for="(answer,index) in item.selections"
                v-bind:key="index"
                class="ma-1"
              >{{ answer }}</v-chip>
            </template>
          </template>
        </v-data-table>
        <v-dialog
          v-model="dialogs.editquestion"
          max-width="650"
        >
          <edit-question></edit-question>
        </v-dialog>
        <v-dialog
            max-width="400"
            v-model="dialogs.confirm"
        >
          <confirmation-template 
              :title="`Delete ${searchedQuestion.name}`" 
              description="You are about to delete this Question. <br><br>Are you sure?" 
              :cancelFunction="null" 
              textButton="Delete" 
              :actionparams="{id:searchedQuestion._id,type:'question'}" 
              :action="delSomething"
          ></confirmation-template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="px-3" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
      <v-col>
        <v-dialog max-width="650" v-model="dialogs.createquestion">
          <template v-slot:activator="{ on }">
            <v-btn
              height="160"
              v-on="on"
              block
              color="info"
              class="my-2"
              @click="clearquestionForm"
            >
              <v-icon left>fas fa-question</v-icon>Create Question
            </v-btn>
          </template>
          <create-question></create-question>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import createquestion from "../components/createquestion.vue"
import editquestion from "../components/editquestion.vue"
import confirm from "../components/confirm.vue"
export default {
  data() {
    return {
      headers: [
        {
          text: "Questions",
          align: "start",
          value: "name",
          width: 30
        },
        {
          text: "Description",
          value: "description",
          sortable: false,
          width: 20
        },
        { text: "Type", value: "type", sortable: false, width: 20 },
        { text: "Answers", value: "selections", sortable: false, width: 100 },
        { text: "Creator", value: "creator", sortable: false, width: 30 },
        { text: "", value: "actions", sortable: false, width: 20 }
      ]
    };
  },
  components: {
    "create-question": createquestion,
    'edit-question': editquestion,
    'confirmation-template': confirm
  },
  computed: {
    ...mapState({
      questions: state => state.actions.questions,
      searchedQuestion: state => state.actions.searchedQuestion,
      loginuser: state => state.user.loginuser,
      dialogs: state => state.menu.menu.dialogs,
      loading: state => state.actions.loading
    })
  },
  methods: {
    ...mapActions("actions", ["loadQuestions", "delSomething",'searchQuestion']),
    ...mapMutations("actions", ["clearquestionForm"])
  },
  created() {
    this.loadQuestions();
  }
};
</script>