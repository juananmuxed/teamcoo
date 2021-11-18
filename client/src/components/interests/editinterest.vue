<template>
  <v-card
    max-width="650"
    class="mx-auto"
    :loading="interestForm.loading"
    :disabled="interestForm.loading"
  >
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit "{{ interest.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Name"
            v-model="interestForm.name"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-textarea
            outlined
            label="Description"
            v-model="interestForm.description"
            :rules="[rules.maxdescletters]"
            counter
            auto-grow
          >
          </v-textarea>
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
                :color="interestForm.color"
                block
                depressed
                v-on="on"
                :ripple="false"
                elevation="0"
                ><span :class="`${textColor(interestForm.color)}--text`">{{
                  interestForm.color
                }}</span></v-btn
              >
            </template>
            <v-card :color="interestForm.color" elevation="0">
              <v-color-picker
                hide-mode-switch
                hide-inputs
                mode.sync="hex"
                flat
                v-model="interestForm.color"
              ></v-color-picker>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="2" class="py-1">
          <v-btn
            class="mb-3"
            :color="interestForm.color"
            block
            depressed
            :ripple="false"
            elevation="0"
            @click="randomInterestColor()"
            ><v-icon :color="textColor(interestForm.color)"
              >fas fa-dice</v-icon
            ></v-btn
          >
        </v-col>
      </v-row>
      <v-slide-y-transition origin="center center">
        <v-btn
          fab
          right
          small
          top
          absolute
          color="primary"
          @click="saveEditedInterest(interest._id)"
          v-show="!validInterest() && isEditedInterest()"
          class="mt-8 mr-12"
        >
          <v-icon small>fas fa-save</v-icon>
        </v-btn>
      </v-slide-y-transition>
      <v-slide-y-transition origin="center center">
        <v-btn
          fab
          right
          small
          top
          absolute
          color="info"
          @click="loadEditedInterest(interest)"
          v-show="isEditedInterest()"
          class="mt-8"
        >
          <v-icon small>fas fa-undo</v-icon>
        </v-btn>
      </v-slide-y-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { idealTextColor } from "../../utils/utils";
export default {
  computed: {
    ...mapState({
      interest: (state) => state.interests.interest,
      loginuser: (state) => state.user.loginuser,
      interestForm: (state) => state.interests.interestForm,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapGetters("interests", ["validInterest", "isEditedInterest"]),
    ...mapMutations("interests", ["randomInterestColor", "loadEditedInterest"]),
    ...mapActions("interests", ["saveEditedInterest"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
};
</script>

<style scoped>
.custom-btn::before {
  color: transparent;
}
</style>