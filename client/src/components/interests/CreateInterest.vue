<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >New Interest</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Name"
            v-model="interestForm.interest.name"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-textarea
            outlined
            label="Description"
            v-model="interestForm.interest.description"
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
                :color="interestForm.interest.color"
                block
                depressed
                v-on="on"
                :ripple="false"
                elevation="0"
                ><span
                  :class="`${textColor(interestForm.interest.color)}--text`"
                  >{{ interestForm.interest.color }}</span
                ></v-btn
              >
            </template>
            <v-card :color="interestForm.interest.color" elevation="0">
              <v-color-picker
                hide-mode-switch
                hide-inputs
                mode.sync="hex"
                flat
                v-model="interestForm.interest.color"
              ></v-color-picker>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="2" class="py-1">
          <v-btn
            class="mb-3"
            :color="interestForm.interest.color"
            block
            depressed
            :ripple="false"
            elevation="0"
            @click="randomInterestColor()"
            ><v-icon :color="textColor(interestForm.interest.color)"
              >fas fa-dice</v-icon
            ></v-btn
          >
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="createInterest(loginuser.id)"
        :disabled="validInterest()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { idealTextColor } from "../../utils/utils";
export default {
  computed: {
    ...mapState({
      interestForm: (state) => state.interests.interestForm,
      rules: (state) => state.general.rules,
      loginuser: (state) => state.user.loginuser,
    }),
  },
  methods: {
    ...mapGetters("interests", ["validInterest"]),
    ...mapMutations("interests", ["randomInterestColor"]),
    ...mapActions("interests", ["createInterest"]),
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