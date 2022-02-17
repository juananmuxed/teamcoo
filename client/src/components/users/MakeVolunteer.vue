<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Be a volunteer</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader
            type="article"
            max-width="1080"
            class="mx-auto"
            transition="fade-transition"
            :loading="skeleton"
          >
            <v-card flat max-width="1080" class="mx-auto pa-4">
              <v-card-title class="mb-3">
                <v-icon size="60" color="primary">{{
                  registerPage.icon
                }}</v-icon>
                <span class="display-2 font-weight-medium ml-6">{{
                  registerPage.title
                }}</span>
              </v-card-title>
              <v-card-text v-html="registerPage.value"></v-card-text>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            dense
            color="primary"
            v-model="newVolunteer.volunteer"
            :rules="[rules.acceptVolunteer]"
          >
            <template v-slot:label>
              <div>I want to be a Volunteer</div>
            </template>
          </v-checkbox>

          <v-checkbox
            color="primary"
            v-model="newVolunteer.accept.termsConditions"
            :rules="[rules.acceptTerms]"
            dense
          >
            <template v-slot:label>
              <div>
                I accept the
                <router-link to="/terms-and-conditions"
                  >Terms & Conditions</router-link
                >
                of {{ webName }}. *
              </div>
            </template>
          </v-checkbox>

          <v-checkbox
            dense
            color="primary"
            v-model="newVolunteer.accept.privacyCookiePolicy"
            :rules="[rules.acceptChecks]"
          >
            <template v-slot:label>
              <div>
                I accept the
                <router-link to="/privacy-policy">Privacy Policy</router-link>
                and
                <router-link to="/cookies-policy">Cookie Policy</router-link>
                *
              </div>
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
        class="mt-8"
        @click="makeUserVolunteer(user._id)"
        :disabled="!isCheckedVolunteer()"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { sleep } from "../../utils/utils";
export default {
  data() {
    return {
      skeleton: true,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      rules: (state) => state.general.rules,
      webName: (state) => state.menu.web.name,
      newVolunteer: (state) => state.users.newVolunteer,
      menu: (state) => state.menu.menu,
      registerPage: (state) => state.general.pagesSpecials.register,
    }),
  },
  methods: {
    ...mapActions("general", ["getPage"]),
    ...mapActions("users", ["makeUserVolunteer"]),
    ...mapGetters("users", ["isCheckedVolunteer"]),
  },
  async created() {
    this.skeleton = true;
    await this.getPage("register");
    await sleep(400);
    this.skeleton = false;
  },
};
</script>