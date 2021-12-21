<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Questions</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :loading="loading" :items="questions">
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5"
              >Loading Questions</span
            >
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin"
              >No Questions</span
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
            <v-chip class="mx-1" :to="'/users/' + item._id">
              <v-avatar left v-if="item.creator.image != ''"
                ><v-img :src="item.creator.image"></v-img
              ></v-avatar>
              <v-avatar left v-else
                ><v-icon small color="info">fas fa-user</v-icon></v-avatar
              >
              {{ item.creator.username }}
            </v-chip>
          </template>
          <template v-slot:item.type="{ item }">
            <span class="text-uppercase">{{ item.type }}</span>
          </template>
          <template v-slot:item.common="{ item }">
            <v-switch v-model="item.common" inset disabled></v-switch>
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
                    searchQuestion(item);
                    dialogs.editquestion = true;
                  "
                  class="mx-1"
                  v-if="
                    item.creator._id == loginuser.id ||
                    loginuser.role == 'admin'
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
          <template v-slot:item.selections="{ item }">
            <template v-if="item.type == 'text'">
              <span>{{ item.text }}</span>
            </template>
            <template v-else>
              <v-chip
                small
                v-for="(answer, index) in item.interests"
                v-bind:key="index"
                class="ma-1"
                :color="answer.color"
                :text-color="textColor(answer.color)"
                >{{ answer.name }}</v-chip
              >
            </template>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogs.editquestion" max-width="650">
          <edit-question></edit-question>
        </v-dialog>
        <v-dialog max-width="400" v-model="dialogs.confirm">
          <confirmation-template
            :title="`Delete '${question.name}'`"
            description="You are about to delete this Question. <br><br>Are you sure?"
            :cancelFunction="null"
            textButton="Delete"
            :actionparams="{ id: question._id }"
            :action="delQuestionSoft"
          ></confirmation-template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-dialog
      max-width="650"
      v-model="dialogs.createinterest"
      v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'"
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
              @click="clearquestionForm"
            >
              <v-icon>fas fa-question</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">Create new</span>
        </v-tooltip>
      </template>
      <create-question></create-question>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import createquestion from "../components/questions/CreateQuestion.vue";
import editquestion from "../components/questions/EditQuestion.vue";
import confirm from "../components/general/Confirm.vue";
import { idealTextColor } from "../utils/utils";
export default {
  data() {
    return {
      headers: [
        {
          text: "Question name",
          align: "start",
          value: "name",
        },
        {
          text: "Description",
          value: "description",
          sortable: false,
        },
        { text: "Type", value: "type", sortable: false },
        { text: "Common", value: "common", sortable: false },
        { text: "Answers", value: "selections", sortable: false },
        { text: "Creator", value: "creator", sortable: false },
        { text: "", value: "actions", sortable: false },
      ],
    };
  },
  components: {
    "create-question": createquestion,
    "edit-question": editquestion,
    "confirmation-template": confirm,
  },
  computed: {
    ...mapState({
      questions: (state) => state.questions.questions,
      question: (state) => state.questions.question,
      loginuser: (state) => state.user.loginuser,
      dialogs: (state) => state.menu.menu.dialogs,
      loading: (state) => state.questions.loading,
    }),
  },
  methods: {
    ...mapActions("questions", [
      "loadQuestions",
      "delQuestionSoft",
      "searchQuestion",
    ]),
    ...mapMutations("questions", ["clearquestionForm", "loadEditedQuestion"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadQuestions();
  },
};
</script>