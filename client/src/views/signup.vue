<template>
  <v-container class="pa-1">
    <v-row>
      <v-col cols="12" md="6" class="pa-4 text-justify">
        <v-row v-if="registerPage">
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
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline font-weight-medium text-uppercase"
            >Create an account</v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="First Name *"
                    v-model="newuser.firstname"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Last Name *"
                    v-model="newuser.lastname"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    outlined
                    v-model="newuser.email"
                    label="E-mail *"
                    :rules="[rules.required, rules.emailrules]"
                    hint="Correct Format: user@domain.com"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="newuser.password"
                    outlined
                    :type="newuser.passshow ? 'text' : 'password'"
                    label="Password *"
                    :rules="[
                      rules.required,
                      rules.passwordrules,
                      rules.nospaces,
                    ]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="newuser.passwordconfirm"
                    outlined
                    :type="newuser.passshow ? 'text' : 'password'"
                    label="Password Confirm *"
                    :rules="[
                      rules.required,
                      rules.passwordconfirm(
                        this.newuser.passwordconfirm,
                        this.newuser.password
                      ),
                    ]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-expand-transition>
                    <v-btn
                      block
                      color="primary"
                      @click="newuser.passshow = !newuser.passshow"
                      v-if="
                        newuser.password != '' || newuser.passwordconfirm != ''
                      "
                    >
                      <v-icon class="px-4">{{
                        newuser.passshow ? "fas fa-eye" : "fas fa-eye-slash"
                      }}</v-icon
                      ><span class="px-4">{{
                        newuser.passshow ? "Hidden passwords" : "Show passwords"
                      }}</span>
                    </v-btn>
                  </v-expand-transition>
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-bold"
                    >Minimum for secure password</span
                  >
                  <ul>
                    <li>Eight-characters minimun.</li>
                    <li>Include at least 1 number.</li>
                    <li>Include at least 1 capital letter.</li>
                    <li>Include at least 1 lower case letter.</li>
                    <li>Avoid using the same password for multiple sites.</li>
                    <li>No spaces.</li>
                  </ul>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    dense
                    color="primary"
                    v-model="newuser.bevolunteer"
                  >
                    <template v-slot:label>
                      <div>I want to be a Volunteer</div>
                    </template>
                  </v-checkbox>

                  <v-checkbox
                    color="primary"
                    v-model="newuser.accept.termsconditions"
                    :rules="[rules.acceptterms]"
                    dense
                  >
                    <template v-slot:label>
                      <div>
                        I accept the
                        <router-link to="/terms-and-conditions"
                          >Terms & Conditions</router-link
                        >
                        of Catapa Belgium. *
                      </div>
                    </template>
                  </v-checkbox>

                  <v-checkbox
                    dense
                    color="primary"
                    v-model="newuser.accept.privacycookiepolicy"
                    :rules="[rules.acceptchecks]"
                  >
                    <template v-slot:label>
                      <div>
                        I accept the
                        <router-link to="/privacy-policy"
                          >Privacy Policy</router-link
                        >
                        and
                        <router-link to="/cookies-policy"
                          >Cookie Policy</router-link
                        >
                        *
                      </div>
                    </template>
                  </v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    block
                    depressed
                    color="primary"
                    :disabled="signUpIsValid()"
                    @click="signup()"
                  >
                    Create your account
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <span class="subtitle-1"
                    >Have an account?
                    <router-link to="/login">Login</router-link></span
                  ><br />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { sleep } from "../utils/utils";
export default {
  data() {
    return {
      skeleton: true,
    };
  },
  computed: {
    ...mapState({
      rules: (state) => state.general.rules,
      newuser: (state) => state.user.newuser,
      registerPage: (state) => state.general.registerPage,
    }),
  },
  methods: {
    ...mapGetters("user", ["signUpIsValid"]),
    ...mapActions("user", ["signup"]),
    ...mapActions("general", ["getRegisterPage"]),
  },
  async created() {
    this.skeleton = true;
    await this.getRegisterPage();
    await sleep(400);
    this.skeleton = false;
  },
};
</script>