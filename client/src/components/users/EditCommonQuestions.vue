<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit Common Questions from "{{ loadedUser.username }}"</v-card-title
    >
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row
          v-for="(question, index) in common"
          v-bind:key="index"
          class="px-3"
        >
          <v-col cols="12" md="3">
            <v-row class="medium font-weight-bold">{{ question.name }}</v-row>
            <v-row class="caption">{{ question.description }}</v-row>
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field
              outlined
              v-if="question.type == 'text'"
              class="px-5"
              :label="question.text"
              color="primary"
              v-model="answers[index].answer"
              :rules="[rules[index]]"
              required
            ></v-text-field>
            <v-select
              outlined
              v-if="question.type == 'select'"
              class="px-5"
              :items="question.selections"
              item-text="name"
              :label="question.name"
              :hint="question.description"
              color="primary"
              v-model="answers[index].answer"
              item-value="id"
              :rules="[rules[index]]"
              required
            ></v-select>
            <v-autocomplete
              class="px-5"
              no-data-text="No data"
              v-if="question.type == 'checkbox'"
              v-model="answers[index].answer"
              :items="question.interests"
              multiple
              :label="question.name"
              item-text="name"
              item-value="name"
              color="primary"
              chips
              :rules="[rules[index]]"
              outlined
              required
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 3">
                  <span>{{ item.name }}</span>
                </v-chip>
                <span v-if="index === 3" class="grey--text caption"
                  >(+{{ question.selections.length - 3 }} others)</span
                >
              </template>
            </v-autocomplete>
            <v-radio-group
              row
              v-model="answers[index].answer"
              :rules="[rules[index]]"
              required
              class="px-5"
              v-if="question.type == 'radio'"
            >
              <v-radio
                class="pa-1"
                v-for="(radio, index) in question.selections"
                v-bind:key="index"
                color="primary"
                :value="radio.name"
                :label="radio.name"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-form>
      <v-slide-y-transition origin="center center">
        <v-btn
          fab
          right
          small
          top
          absolute
          color="primary"
          @click="
            saveCommonQuestions({ idUser: loadedUser._id, answers: answers })
          "
          v-show="valid"
          class="mt-8"
        >
          <v-icon small>fas fa-save</v-icon>
        </v-btn>
      </v-slide-y-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      common: [],
      answers: [],
      rules: [],
      valid: true,
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      questions: (state) => state.questions.questions,
      loginUser: (state) => state.user.loginUser,
      loadedUser: (state) => state.users.loadedUser,
    }),
  },
  methods: {
    ...mapActions("users", ["saveCommonQuestions"]),
  },
  async created() {
    this.common = this.questions.filter((v) => v.common);
    for (let i = 0; i < this.common.length; i++) {
      let answer;
      let rule;
      switch (this.common[i].type) {
        case "checkbox":
          rule = (v) => v.length != 0 || "Select one at least";
          answer = [];
          break;

        case "text":
          rule = (v) => !!v || "Required";
          answer = "";
          break;

        case "select":
          rule = (v) => !!v || "Select one";
          answer = null;
          break;

        case "radio":
          rule = (v) => !!v || "A selection is required";
          answer = "";
          break;

        default:
          break;
      }
      let obj = {
        _id: this.common[i]._id,
        answer: this.loadedUser.commonquestions.some(
          (q) => q._id == this.common[i]._id
        )
          ? this.loadedUser.commonquestions[i].answer
          : answer,
      };
      this.rules.push(rule);
      this.answers.push(obj);
    }
  },
};
</script>