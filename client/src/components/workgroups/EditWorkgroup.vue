<template>
  <v-card
    max-width="650"
    class="mx-auto"
    :loading="workgroupForm.loading"
    :disabled="workgroupForm.loading"
  >
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit "{{ workgroup.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Name"
            v-model="workgroupForm.workgroup.name"
            :rules="[rules.required, rules.minletter]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-select
            label="Parent Work Group"
            v-model="workgroupForm.workgroup.parent"
            outlined
            :items="
              workgroups.filter(
                (wg) =>
                  wg._id != workgroupForm.workgroup._id &&
                  wg.parent != workgroupForm.workgroup._id
              )
            "
            item-text="name"
            item-value="_id"
            :menu-props="{ closeOnContentClick: true }"
          >
            <template v-slot:prepend-item>
              <v-list-item @click="workgroupForm.workgroup.parent = null">
                <v-list-item-content>
                  <v-list-item-title class="grey--text"
                    >No parent</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-select>
        </v-col>
        <v-col cols="10" class="py-1">
          <v-menu
            :close-on-content-click="false"
            :nudge-height="0"
            offset-y
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="custom-btn mb-3"
                :color="workgroupForm.workgroup.color"
                block
                depressed
                v-on="on"
                :ripple="false"
                elevation="0"
                ><span
                  :class="`${textColor(workgroupForm.workgroup.color)}--text`"
                  >{{ workgroupForm.workgroup.color }}</span
                ></v-btn
              >
            </template>
            <v-card :color="workgroupForm.workgroup.color" elevation="0">
              <v-color-picker
                hide-mode-switch
                hide-inputs
                mode.sync="hex"
                flat
                v-model="workgroupForm.workgroup.color"
              ></v-color-picker>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="2" class="py-1">
          <v-btn
            class="mb-3"
            :color="workgroupForm.workgroup.color"
            block
            depressed
            :ripple="false"
            elevation="0"
            @click="randomWorkgroupColor()"
            ><v-icon :color="textColor(workgroupForm.workgroup.color)"
              >fas fa-dice</v-icon
            ></v-btn
          >
        </v-col>
        <v-col cols="12" class="py-1">
          <v-textarea
            outlined
            label="Description"
            auto-grow
            counter
            rows="3"
            v-model="workgroupForm.workgroup.description"
            :rules="[rules.required, rules.maxdescletters]"
          >
          </v-textarea>
        </v-col>
        <v-col
          cols="12"
          class="py-1"
          v-if="workgroupForm.workgroup.dossier != null"
        >
          <a :href="workgroupForm.workgroup.dossier" target="_blank"
            >Actual Dossier</a
          ><br />
          If you change the Dossier, the Actual Dossier will be deleted.
        </v-col>
        <v-col cols="6" class="py-1">
          <v-file-input
            chips
            :label="
              workgroupForm.workgroup.dossier != null
                ? 'New Dossier'
                : 'Dossier'
            "
            outlined
            prepend-icon="fas fa-file"
            hint="PDF"
            v-model="workgroupForm.workgroup.newDossier"
            accept="application/pdf"
            :rules="[rules.maxSize]"
          >
          </v-file-input>
        </v-col>
        <v-col cols="6" class="py-1">
          <v-text-field
            outlined
            label="Link to documents"
            v-model="workgroupForm.workgroup.link"
            :rules="[rules.validlink]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-autocomplete
            label="Questions"
            v-model="workgroupForm.workgroup.questions"
            multiple
            return-object
            small-chips
            outlined
            item-value="_id"
            item-text="name"
            :items="questions"
            hint="Select at least 1"
            :rules="[rules.zerolength]"
          >
            <template v-slot:prepend>
              <v-tooltip top>
                <template v-slot:activator="{ on: onTooltip }">
                  <v-dialog
                    max-width="650"
                    v-model="menu.dialogs.createquestion"
                  >
                    <template v-slot:activator="{ on: onDialog }">
                      <v-btn
                        @click="clearquestionForm"
                        icon
                        class="mb-3"
                        v-on="{ ...onDialog, ...onTooltip }"
                      >
                        <v-icon>fas fa-question</v-icon>
                      </v-btn>
                    </template>
                    <create-question></create-question>
                  </v-dialog>
                </template>
                Create new question
              </v-tooltip>
            </template>
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs" :input-value="data.selected">
                <span class="pr-2">
                  {{ data.item.name }}
                </span>
                <v-icon small @click="data.parent.selectItem(data.item)">
                  fas fa-times-circle
                </v-icon>
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  data.item.type.toUpperCase()
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" class="py-1" v-if="loginUser.rol.value == 'admin'">
          <v-switch
            color="primary"
            v-model="workgroupForm.workgroup.secret"
            label="Private Work Group"
          ></v-switch>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="saveEditedworkgroup(workgroupForm.workgroup._id)"
        :disabled="editedWorkgroup() || validWorkgroup()"
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
        @click="loadEditedWorkgroup()"
        :disabled="editedWorkgroup()"
        class="mt-8 mr-12"
      >
        <v-icon small>fas fa-undo</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { idealTextColor } from "../../utils/utils";
import CreateQuestionVue from "../questions/CreateQuestion.vue";
export default {
  components: {
    "create-question": CreateQuestionVue,
  },
  computed: {
    ...mapState({
      workgroupForm: (state) => state.workgroups.workgroupForm,
      workgroup: (state) => state.workgroups.workgroup,
      questions: (state) => state.questions.notCommonQuestions,
      loginUser: (state) => state.user.loginUser,
      menu: (state) => state.menu.menu,
      workgroups: (state) => state.workgroups.workgroups,
      secretWorkgroups: (state) => state.workgroups.secretWorkgroups,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapMutations("workgroups", [
      "loadEditedWorkgroup",
      "randomWorkgroupColor",
    ]),
    ...mapGetters("workgroups", ["editedWorkgroup", "validWorkgroup"]),
    ...mapActions("workgroups", ["saveEditedworkgroup", "loadWorkgroups"]),
    ...mapActions("questions", ["loadNotCommonQuestions"]),
    ...mapMutations("questions", ["clearquestionForm"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  async created() {
    this.workgroupForm.loading = true;
    await this.loadNotCommonQuestions();
    await this.loadWorkgroups();
    this.workgroupForm.loading = false;
  },
};
</script>

<style scoped>
.custom-btn::before {
  color: transparent;
}
</style>