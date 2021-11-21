<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >New Question</v-card-title
    >
    <v-card-text>
      <p>Select one of the 4 types and fill the questions.</p>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-select
            outlined
            :items="questionForm.types"
            v-model="questionForm.question.type"
            label="Question type"
          ></v-select>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Name"
            v-model="questionForm.question.name"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-textarea
            outlined
            label="Description"
            v-model="questionForm.question.description"
            :rules="[rules.maxdescletters]"
            counter
            auto-grow
          >
          </v-textarea>
        </v-col>
        <v-col
          cols="12"
          v-if="
            questionForm.question.type == 'radio' ||
            questionForm.question.type == 'checkbox' ||
            questionForm.question.type == 'select'
          "
          class="py-1"
        >
          <v-combobox
            outlined
            v-model="questionForm.question.interests"
            label="Answers"
            :items="interests"
            :rules="[rules.zerolength]"
            item-text="name"
            multiple
            persistent-hint
            hint="Press Enter to create a new one"
          >
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip v-bind="attrs" :input-value="selected" small>
                <span class="pr-2">
                  {{ item.name }}
                </span>
                <v-icon small @click="parent.selectItem(item)">
                  fas fa-times-circle
                </v-icon>
              </v-chip>
            </template>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
        <v-col
          cols="12"
          v-if="questionForm.question.type == 'text'"
          class="py-1"
        >
          <v-text-field
            outlined
            label="Question"
            v-model="questionForm.question.text"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="loginuser.rol.value == 'admin'">
          <v-checkbox
            dense
            color="primary"
            v-model="questionForm.question.common"
          >
            <template v-slot:label>
              <div>Common question</div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="createQuestion(loginuser._id)"
        :disabled="validQuestion()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  watch: {
    "questionForm.question.interests"(val, prev) {
      if (val.length === prev.length) return;
      this.questionForm.question.interests = val.map((v) => {
        if (typeof v === "string") {
          v = {
            _id: val.length,
            name: v,
            new: true,
          };
          this.interests.push(v);
        }
        return v;
      });
    },
  },
  computed: {
    ...mapState({
      questionForm: (state) => state.questions.questionForm,
      interests: (state) => state.interests.interests,
      loginuser: (state) => state.user.loginuser,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapGetters("questions", ["validQuestion"]),
    ...mapActions("questions", ["createQuestion"]),
    ...mapActions("interests", ["loadInterests"]),
  },
  created() {
    this.loadInterests();
  },
};
</script>