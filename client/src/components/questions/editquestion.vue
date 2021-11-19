<template>
  <v-card
    max-width="650"
    class="mx-auto"
    :loading="questionForm.loading"
    :disabled="questionForm.loading"
  >
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit "{{ question.name }}"</v-card-title
    >
    <v-card-text>
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
            v-model="questionForm.question.interests"
            :items="interests"
            outlined
            multiple
            small-chips
            hide-selected
            return-object
            item-value="_id"
            item-text="name"
            hint="Select at least 1"
            :rules="[rules.zerolength]"
            label="Answers"
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
                    No results matching. Press <kbd>enter</kbd> to create a new
                    one
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
        @click="saveEditedQuestion(question._id)"
        :disabled="validQuestion() || !isEditedQuestion()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="info"
        @click="loadEditedQuestion(question)"
        :disabled="!isEditedQuestion()"
        class="mt-8 mr-12"
      >
        <v-icon small>fas fa-undo</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
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
      question: (state) => state.questions.question,
      interests: (state) => state.interests.interests,
      loginuser: (state) => state.user.loginuser,
      questionForm: (state) => state.questions.questionForm,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapMutations("questions", ["loadEditedQuestion", "updateInterests"]),
    ...mapGetters("questions", ["validQuestion", "isEditedQuestion"]),
    ...mapActions("questions", ["saveEditedQuestion"]),
    ...mapActions("interests", ["loadInterests"]),
  },
  created() {
    this.loadInterests();
  },
};
</script>