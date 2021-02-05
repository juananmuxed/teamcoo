<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase">Join to {{ workgroup.name }}</v-card-title>
    <v-card-text>
      <v-row v-if="suscribed != null">
        <v-col
          cols="12"
          class="py-0 caption font-italic font-weight-light"
        >You are previously Joined this Work Group: {{ suscribed.formatedDate }}</v-col>
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
          <p v-if="workgroup.linktodocuments != ''">
            <span>
              In addition you have more info in
              <a
                target="_blank"
                :href="workgroup.linktodocuments"
              >this Drive folder</a>
              <v-icon x-small color="primary">fas fa-link</v-icon>
            </span>
          </p>
        </v-col>
      </v-row>
      <v-form ref="form" v-model="valid">
        <v-row v-for="( question, index) in workgroup.questions" v-bind:key="index" class="px-3">
          <v-col cols="12" md="3">
            <v-row class="medium font-weight-bold">{{ index + 1 }}. {{ question.name }}</v-row>
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
              item-text="answer"
              :label="question.name"
              :hint="question.description"
              color="primary"
              v-model="answers[index].answer"
              item-value="answer"
              :rules="[rules[index]]"
              required
            ></v-select>
            <v-autocomplete
              class="px-5"
              no-data-text="No data"
              v-if="question.type == 'checkbox'"
              v-model="answers[index].answer"
              :items="question.selections"
              multiple
              :label="question.name"
              color="primary"
              chips
              :rules="[rules[index]]"
              outlined
              required
            >
              <template v-slot:selection="{ data, item, index }">
                <v-chip v-if="index < 3">
                  <span>{{ item }}</span>
                </v-chip>
                <span
                  v-if="index === 3"
                  class="grey--text caption"
                >(+{{ answers[index].answer.length - 3 }} others)</span>
              </template>
            </v-autocomplete>
            <v-radio-group
              row
              v-model="answers[index].answer"
              :rules="[rules[index]]"
              mandatory
              required
              class="px-5"
              v-if="question.type == 'radio'"
            >
              <v-radio
                class="pa-1"
                v-for="( radio , index) in question.selections"
                v-bind:key="index"
                :value="radio"
                :label="radio"
                color="primary"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12">
          <v-btn
            block
            color="primary"
            :disabled="!valid"
            @click="joinWorkgroup({idWorkgroup:workgroup._id,idUser:loginuser.id,answers:answers}); saveMember({idWorkgroup:workgroup._id,idUser:loginuser.id,suscribe:true})"
          >Suscribe</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { dateToFormat } from '../../utils/utils'
export default {
  data() {
    return {
      workgroup: {},
      answers: [],
      rules: [],
      valid: true,
      suscribed: null
    };
  },
  props: {
    id: String
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu,
      searchedWorkgroup: state => state.workgroups.searchedWorkgroup,
      loginuser: state => state.user.loginuser
    })
  },
  methods: {
    ...mapActions("workgroups", ["joinWorkgroup","saveMember"])
  },
  async created() {
    this.workgroup = this.searchedWorkgroup;
    if (this.loginuser.unsuscribedworkgroups.some( w => w._wgId === this.workgroup._id)){
        this.suscribed = this.loginuser.unsuscribedworkgroups.find( w => w._wgId === this.workgroup._id)
        this.suscribed.formatedDate = dateToFormat(this.suscribed.updatedDate)
    }
    for (let i = 0; i < this.workgroup.questions.length; i++) {
      let answer;
      let rule;
      switch (this.workgroup.questions[i].type) {
        case "checkbox":
          rule = v => v.length != 0 || "Select one at least";
          answer = [];
          break;

        case "text":
          rule = v => !!v || "Required";
          answer = "";
          break;

        case "select":
          rule = v => !!v || "Select one";
          answer = null;
          break;

        case "radio":
          rule = v => !!v || "A selection is required";
          answer = "";
          break;

        default:
          break;
      }
      let obj = {
        _id: this.workgroup.questions[i]._id,
        answer: answer
      };
      this.rules.push(rule);
      this.answers.push(obj);
    }
  }
};
</script>