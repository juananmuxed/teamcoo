<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit Common Questions from "{{ user.username }}"</v-card-title
    >
    <v-card-text>
      <v-row
        v-for="(question, index) in commonQuestions"
        v-bind:key="index"
        class="px-3"
      >
        <v-col cols="12">
          <h3>{{ question.name }}</h3>
        </v-col>
        <v-col cols="12">
          <p>{{ question.description }}</p>
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            v-if="question.type == 'text'"
            class="px-5"
            :label="question.text"
            color="primary"
            v-model="answers[index].text"
            :rules="[rules[index]]"
          ></v-text-field>
          <v-select
            outlined
            v-if="question.type == 'select'"
            class="px-5"
            :items="question.interests"
            item-text="name"
            :label="question.name"
            :hint="question.description"
            color="primary"
            v-model="answers[index].answer"
            item-value="_id"
            :rules="[rules[index]]"
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
            item-value="_id"
            color="primary"
            chips
            :rules="[rules[index]]"
            outlined
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 3">
                <span>{{ item.name }}</span>
              </v-chip>
              <span v-if="index === 3" class="grey--text caption"
                >(+{{ question.interests.length - 3 }} others)</span
              >
            </template>
          </v-autocomplete>
          <v-radio-group
            row
            v-model="answers[index].answer"
            :rules="[rules[index]]"
            class="px-5"
            v-if="question.type == 'radio'"
          >
            <v-radio
              class="pa-1"
              v-for="(radio, index) in question.interests"
              v-bind:key="index"
              color="primary"
              :value="radio._id"
              :label="radio.name"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="saveCommonQuestions(user._id)"
        :disabled="!isValidQuestions()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      commonQuestions: (state) => state.questions.commonQuestions,
      answers: (state) => state.questions.answers,
      rules: (state) => state.questions.rules,
      loginUser: (state) => state.user.loginUser,
      user: (state) => state.users.user,
    }),
  },
  methods: {
    ...mapActions("questions", [
      "createRules",
      "createAnswers",
      "saveCommonQuestions",
    ]),
    ...mapGetters("questions", ["isValidQuestions"]),
  },
  created() {
    this.createRules();
    this.createAnswers();
  },
};
</script>