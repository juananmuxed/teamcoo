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
          :headers="headers"
          :loading="loading"
          :items="questions"
          :options.sync="search.options"
          :server-items-length="totalQuestions"
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
                          >Search by name, description, answers, type and
                          creator</span
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
                            v-if="search.type"
                            v-text="'Type: ' + search.type"
                            color="warning"
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
                      <v-select
                        outlined
                        :items="questionForm.types"
                        v-model="search.type"
                        clearable
                        clear-icon="fas fa-times"
                        label="Question type"
                      ></v-select>
                    </v-col>
                    <v-col cols="11" md="5">
                      <interest-search-component
                        label="Answers"
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
            <user-options-menu-component
              :user="item.creator"
            ></user-options-menu-component>
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
                    searchQuestion(item);
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
          <template v-slot:item.answers="{ item }">
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
      v-model="dialogs.createquestion"
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
import { idealTextColor } from "../utils/utils";
import UserSearchVue from "../components/users/UserSearch.vue";
import InterestsSearchVue from "../components/interests/InterestsSearch.vue";
import CreateQuestionVue from "../components/questions/CreateQuestion.vue";
import EditQuestionVue from "../components/questions/EditQuestion.vue";
import ConfirmVue from "../components/general/Confirm.vue";
import UserOptionsMenuVue from "../components/users/UserOptionsMenu.vue";
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
        },
        { text: "Type", value: "type", width: 100 },
        { text: "Common", value: "common", width: 100 },
        { text: "Answers", value: "answers", sortable: false, width: 800 },
        { text: "Creator", value: "creator" },
        { text: "", value: "actions", sortable: false, width: 120 },
      ],
    };
  },
  components: {
    "create-question": CreateQuestionVue,
    "edit-question": EditQuestionVue,
    "confirmation-template": ConfirmVue,
    "user-search-component": UserSearchVue,
    "interest-search-component": InterestsSearchVue,
    "user-options-menu-component": UserOptionsMenuVue,
  },
  computed: {
    ...mapState({
      questions: (state) => state.questions.questions,
      question: (state) => state.questions.question,
      questionForm: (state) => state.questions.questionForm,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      totalQuestions: (state) => state.questions.totalQuestions,
      search: (state) => state.questions.search,
      loading: (state) => state.questions.loading,
    }),
  },
  watch: {
    search: {
      handler() {
        if (!this.loading) this.loadQuestionsPaginated();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("questions", [
      "loadQuestionsPaginated",
      "delQuestionSoft",
      "searchQuestion",
    ]),
    ...mapMutations("questions", ["clearquestionForm", "loadEditedQuestion"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
};
</script>