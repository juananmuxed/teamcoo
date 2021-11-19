<template>
  <v-card flat class="pa-6">
    <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
      >Common questions</v-card-title
    >
    <v-row
      v-for="(question, index) in questions.filter((q) => q.common)"
      v-bind:key="index"
    >
      <v-col
        class="display-1 text-uppercase font-weight-thin"
        cols="12"
        md="6"
        >{{ question.name }}</v-col
      >
      <v-col cols="12" md="6">
        <v-btn
          depressed
          small
          color="error"
          @click="
            searchQuestion(question);
            dialogs.confirm = true;
          "
          class="mx-1 float-right"
        >
          Delete<v-icon x-small class="ml-1">fas fa-trash</v-icon>
        </v-btn>
        <v-btn
          depressed
          small
          color="info"
          @click="
            searchQuestion(question);
            dialogs.editquestion = true;
          "
          class="mx-1 float-right"
        >
          Edit<v-icon x-small class="ml-1">fas fa-edit</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" class="mt-2 headline">
            Type:
            <span class="text-uppercase font-weight-light">{{
              question.type
            }}</span>
          </v-col>
          <v-col cols="12" class="mt-2 headline"> Description </v-col>
          <v-col cols="12">
            {{ question.description }}
          </v-col>
          <v-col cols="12" class="mt-2 headline" v-if="question.type != 'text'"
            >Answers</v-col
          >
          <v-col cols="12" class="mt-2 headline" v-else>Question</v-col>
          <v-col cols="12" md="6" v-if="question.type == 'text'" class="py-1">
            {{ question.text }}
          </v-col>
          <v-col cols="12" v-else class="py-1">
            <v-chip
              :color="answer.color"
              :text-color="textColor(answer.color)"
              small
              v-for="(answer, index) in question.interests"
              v-bind:key="index"
              class="ma-1"
              >{{ answer.name }}</v-chip
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <p class="headline font-weight-medium text-uppercase primary--text">
              Preview
            </p>
          </v-col>
          <v-col cols="12" v-if="question.type == 'select'" class="py-1">
            <v-card outlined class="pa-2">
              <v-card-title class="title font-weight-medium">{{
                question.name
              }}</v-card-title>
              <v-card-subtitle>{{ question.description }}</v-card-subtitle>
              <v-select
                class="px-5"
                outlined
                :items="question.interests"
                item-text="name"
                :label="question.name"
                :hint="question.description"
                color="primary"
              ></v-select>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="question.type == 'checkbox'" class="py-1">
            <v-card outlined class="pa-2">
              <v-card-title class="title font-weight-medium">{{
                question.name
              }}</v-card-title>
              <v-card-subtitle>{{ question.description }}</v-card-subtitle>
              <v-autocomplete
                no-data-text="Not a valid search"
                class="px-5"
                :items="question.interests"
                multiple
                :label="question.name"
                item-text="name"
                color="primary"
                chips
                outlined
              ></v-autocomplete>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="question.type == 'radio'" class="py-1">
            <v-card outlined class="pa-2">
              <v-card-title class="title font-weight-medium">{{
                question.name
              }}</v-card-title>
              <v-card-subtitle>{{ question.description }}</v-card-subtitle>
              <v-row class="px-5">
                <v-col cols="6" md="4" class="py-0">
                  <v-radio-group column>
                    <v-radio
                      v-for="(radio, index) in question.interests"
                      v-bind:key="index"
                      outlined
                      :label="radio.name"
                      color="primary"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="question.type == 'text'" class="py-1">
            <v-card outlined class="pa-2">
              <v-card-title class="title font-weight-medium">{{
                question.name
              }}</v-card-title>
              <v-card-subtitle>{{ question.description }}</v-card-subtitle>
              <v-text-field
                class="px-5"
                :label="question.text"
                outlined
                color="primary"
              ></v-text-field>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-divider inset v-if="index < questions.length - 1"></v-divider>
    </v-row>
    <v-row>
      <v-dialog max-width="650" v-model="dialogs.createquestion">
        <template v-slot:activator="{ on }">
          <v-btn
            height="160"
            v-on="on"
            block
            color="primary"
            class="my-2"
            @click="
              clearquestionForm();
              checkCommonQuestion();
            "
          >
            <v-icon left>fas fa-question</v-icon>Create Common Question
          </v-btn>
        </template>
        <create-question></create-question>
      </v-dialog>
    </v-row>
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
        :action="delQuestion"
      ></confirmation-template>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import createquestion from "../../components/questions/createquestion.vue";
import editquestion from "../../components/questions/editquestion.vue";
import confirmation from "../../components/general/confirm.vue";
import { idealTextColor } from "../../utils/utils";
export default {
  components: {
    "create-question": createquestion,
    "edit-question": editquestion,
    "confirmation-template": confirmation,
  },
  computed: {
    ...mapState({
      questions: (state) => state.questions.questions,
      questionForm: (state) => state.questions.questionForm,
      question: (state) => state.questions.question,
      dialogs: (state) => state.menu.menu.dialogs,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapActions("questions", [
      "searchQuestion",
      "delQuestion",
      "loadQuestions",
    ]),
    ...mapMutations("questions", ["clearquestionForm", "checkCommonQuestion"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadQuestions();
  },
};
</script>