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
                    v-model="newUser.firstName"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Last Name *"
                    v-model="newUser.lastName"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    outlined
                    v-model="newUser.email"
                    label="E-mail *"
                    :rules="[rules.required, rules.emailrules]"
                    hint="Correct Format: user@domain.com"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="newUser.password"
                    outlined
                    :type="newUser.passShow ? 'text' : 'password'"
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
                    v-model="newUser.passwordConfirm"
                    outlined
                    :type="newUser.passShow ? 'text' : 'password'"
                    label="Password Confirm *"
                    :rules="[
                      rules.required,
                      rules.passwordconfirm(
                        this.newUser.passwordConfirm,
                        this.newUser.password
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
                      @click="newUser.passShow = !newUser.passShow"
                      v-if="
                        newUser.password != '' || newUser.passwordConfirm != ''
                      "
                    >
                      <v-icon class="px-4">{{
                        newUser.passShow ? "fas fa-eye" : "fas fa-eye-slash"
                      }}</v-icon
                      ><span class="px-4">{{
                        newUser.passShow ? "Hidden passwords" : "Show passwords"
                      }}</span>
                    </v-btn>
                  </v-expand-transition>
                </v-col>
                <v-col cols="12">
                  <v-checkbox dense color="primary" v-model="newUser.volunteer">
                    <template v-slot:label>
                      <div>I want to be a Volunteer</div>
                    </template>
                  </v-checkbox>

                  <v-checkbox
                    color="primary"
                    v-model="newUser.accept.termsConditions"
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
                    v-model="newUser.accept.privacyCookiePolicy"
                    :rules="[rules.acceptChecks]"
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
                    :loading="sendingEmail"
                    block
                    depressed
                    color="primary"
                    :disabled="signUpIsValid()"
                    @click="signUp()"
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
      webName: (state) => state.menu.web.name,
      newUser: (state) => state.user.newUser,
      sendingEmail: (state) => state.user.sendingEmail,
      registerPage: (state) => state.general.pagesSpecials.register,
    }),
  },
  methods: {
    ...mapGetters("user", ["signUpIsValid"]),
    ...mapActions("user", ["signUp"]),
    ...mapActions("general", ["getPage"]),
  },
  async created() {
    this.skeleton = true;
    await this.getPage("register");
    await sleep(400);
    this.skeleton = false;
  },
};
</script>