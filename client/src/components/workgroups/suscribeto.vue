<template>
  <v-card max-width="650" class="mx-auto">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Join to {{ workgroup.name }}</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-0 caption font-italic font-weight-light"
          >You are previously Joined this Work Group:</v-col
        >
      </v-row>
      <v-row class="px-3 mb-3">
        <v-col cols="12" class="pa-2">
          <p>Please answer the question to join this Work Group.</p>
          <p v-if="workgroup.dossier != null">
            <span>
              You have more information in the
              <a target="_blank" :href="workgroup.dossier">
                dossier
                <v-icon x-small color="primary">fas fa-link</v-icon>
              </a>
            </span>
          </p>
          <p v-if="workgroup.link != ''">
            <span>
              And more info in
              <a target="_blank" :href="workgroup.link">this link</a>
              <v-icon x-small color="primary">fas fa-link</v-icon>
            </span>
          </p>
        </v-col>
      </v-row>
      <v-row
        v-for="(question, i) in workgroup.questions"
        v-bind:key="i"
        class="px-3"
      >
        <v-col cols="12" md="3">
          <v-row class="medium font-weight-bold"
            >{{ i + 1 }}. {{ question.name }}</v-row
          >
          <v-row class="caption">{{ question.description }}</v-row>
        </v-col>
        <v-col cols="12" md="9">
          <v-text-field
            outlined
            v-if="question.type == 'text'"
            class="px-5"
            :label="question.text"
            color="primary"
            v-model="answers[i].text"
            :rules="[rules[i]]"
          ></v-text-field>
          <v-select
            outlined
            v-if="question.type == 'select'"
            class="px-5"
            :items="
              interests.filter((i) =>
                question.interests.some((interest) => interest == i._id)
              )
            "
            item-text="name"
            :label="question.name"
            :hint="question.description"
            color="primary"
            v-model="answers[i].answer"
            item-value="_id"
            :rules="[rules[i]]"
          ></v-select>
          <v-autocomplete
            class="px-5"
            no-data-text="No data"
            v-if="question.type == 'checkbox'"
            v-model="answers[i].answer"
            :items="
              interests.filter((i) =>
                question.interests.some((interest) => interest == i._id)
              )
            "
            multiple
            :label="question.name"
            color="primary"
            chips
            item-value="_id"
            item-text="name"
            :rules="[rules[i]]"
            outlined
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 3">
                <span>{{ item.name }}</span>
              </v-chip>
              <span v-if="index === 3" class="grey--text caption"
                >(+{{ answers[i].answer.length - 3 }} others)</span
              >
            </template>
          </v-autocomplete>
          <v-radio-group
            row
            v-model="answers[i].answer"
            :rules="[rules[i]]"
            class="px-5"
            v-if="question.type == 'radio'"
          >
            <v-radio
              class="pa-1"
              v-for="(radio, index) in interests.filter((i) =>
                question.interests.some((interest) => interest == i._id)
              )"
              v-bind:key="index"
              :value="radio._id"
              :label="radio.name"
              color="primary"
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
        @click="joinWorkgroup(loginuser.id)"
        :disabled="!isValidJoin()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      workgroup: (state) => state.workgroups.workgroup,
      valid: (state) => state.workgroups.valid,
      answers: (state) => state.workgroups.answers,
      rules: (state) => state.workgroups.rules,
      interests: (state) => state.interests.interests,
      loginuser: (state) => state.user.loginuser,
    }),
  },
  methods: {
    ...mapActions("workgroups", [
      "joinWorkgroup",
      "createRules",
      "createAnswers",
    ]),
    ...mapGetters("workgroups", ["isValidJoin"]),
  },
  created() {
    this.createRules();
    this.createAnswers();
  },
};
</script>