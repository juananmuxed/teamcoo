<template>
  <v-row>
    <v-col
      cols="12"
      v-if="!isCommonQuestionAnswered() && loginUser.rol.value == 'volu'"
    >
      <v-alert
        transition="slide-y-transition"
        border="left"
        type="warning"
        dismissible
      >
        <v-row no-gutters align="center">
          <v-col class="grow">
            There are several common unanswered questions, please help us by
            finishing answering them
          </v-col>
          <v-col class="shrink">
            <v-btn
              depressed
              small
              color="warning"
              @click="dialogs.editCommonQuestion = true"
            >
              Answer now
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-dialog max-width="650" v-model="dialogs.editCommonQuestion">
        <edit-common-question :user="loginUser"></edit-common-question>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import EditCommonQuestionsVue from "../users/EditCommonQuestions.vue";
export default {
  components: {
    "edit-common-question": EditCommonQuestionsVue,
  },
  computed: {
    ...mapState({
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
    }),
  },
  methods: {
    ...mapActions("questions", ["loadAnswersByUser", "loadCommonQuestions"]),
    ...mapGetters("questions", ["isCommonQuestionAnswered"]),
  },
  created() {
    this.loadAnswersByUser(this.loginUser._id);
    this.loadCommonQuestions();
  },
};
</script>
