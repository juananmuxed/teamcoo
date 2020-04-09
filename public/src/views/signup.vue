<template>
    <v-container class="pa-1">
        <v-row>
            <v-col cols="12" md="6" class="pa-4 text-justify">
                <p class="display-1">Why register in this page</p>
                <p>If you are interested in colaborate with the Asociation, this is your place.</p>
                <p>By signing up you will receive marketing emails, which you may unsubscribe from anytime.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris accumsan est et maximus eleifend. Suspendisse elementum, lectus quis consequat ornare, ipsum turpis tempus nibh, ut blandit lorem ex nec nisl. Praesent varius lectus risus, eget vulputate libero euismod a. Duis porta purus lorem, eget maximus enim convallis et. Fusce convallis purus eu sapien aliquet, eu convallis odio faucibus. Integer vel nibh bibendum, rutrum ipsum a, cursus est. Aliquam erat volutpat. Vivamus scelerisque bibendum justo at consequat. Etiam ornare augue augue, quis pretium neque congue in. Vestibulum ut fermentum quam. </p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris accumsan est et maximus eleifend. Suspendisse elementum, lectus quis consequat ornare, ipsum turpis tempus nibh, ut blandit lorem ex nec nisl. Praesent varius lectus risus, eget vulputate libero euismod a. Duis porta purus lorem, eget maximus enim convallis et. Fusce convallis purus eu sapien aliquet, eu convallis odio faucibus. Integer vel nibh bibendum, rutrum ipsum a, cursus est. Aliquam erat volutpat. Vivamus scelerisque bibendum justo at consequat. Etiam ornare augue augue, quis pretium neque congue in. Vestibulum ut fermentum quam. </p>
            </v-col>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title class="headline font-weight-medium text-uppercase">Create an account</v-card-title>
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
                                        <template v-slot:append>
                                            <v-slide-x-transition>
                                                <v-icon color="primary" v-if="newuser.firstname != ''" @click="newuser.firstname = ''">fas fa-times</v-icon>
                                            </v-slide-x-transition>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        outlined
                                        label="Last Name *"
                                        v-model="newuser.lastname"
                                        :rules="[rules.required]"
                                    >
                                        <template v-slot:append>
                                            <v-slide-x-transition>
                                                <v-icon color="primary" v-if="newuser.lastname != ''" @click="newuser.lastname = ''">fas fa-times</v-icon>
                                            </v-slide-x-transition>
                                        </template>
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
                                        <template v-slot:append>
                                            <v-slide-x-transition>
                                                <v-icon color="primary" v-if="newuser.email != ''" @click="newuser.email = ''">fas fa-times</v-icon>
                                            </v-slide-x-transition>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field 
                                        v-model="newuser.password"
                                        outlined
                                        :type="newuser.passshow ? 'text' : 'password'"
                                        label="Password *"
                                        :rules="[rules.required,rules.passwordrules,rules.nospaces]"
                                    >
                                        <template v-slot:append>
                                            <v-slide-x-transition>
                                                <v-icon color="primary" v-if="newuser.password != ''" @click="newuser.password = ''">fas fa-times</v-icon>
                                            </v-slide-x-transition>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field 
                                        v-model="newuser.passwordconfirm"
                                        outlined
                                        :type="newuser.passshow ? 'text' : 'password'"
                                        label="Password Confirm *"
                                        :rules="[rules.required,rules.passwordconfirm]"
                                    >
                                        <template v-slot:append>
                                            <v-slide-x-transition>
                                                <v-icon color="primary" v-if="newuser.passwordconfirm != ''" @click="newuser.passwordconfirm = ''">fas fa-times</v-icon>
                                            </v-slide-x-transition>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-expand-transition>
                                        <v-btn
                                            block
                                            color="primary"
                                            @click="newuser.passshow = !newuser.passshow"
                                            v-if="newuser.password != '' || newuser.passwordconfirm != ''"
                                        >
                                            <v-icon class="px-4">{{newuser.passshow ? 'fas fa-eye' : 'fas fa-eye-slash'}}</v-icon><span class="px-4">{{newuser.passshow ? 'Hidden passwords' : 'Show passwords'}}</span>
                                        </v-btn>
                                    </v-expand-transition>
                                </v-col>
                                <v-col cols="12">
                                    <span class="font-weight-bold">Minimum for correct password</span>
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
                                            <div>
                                                I want to be a Volunteer
                                            </div>
                                        </template>
                                    </v-checkbox>

                                    <v-checkbox
                                        color="primary"
                                        v-model="newuser.accept.termsconditions"
                                        :rules="[rules.acceptchecks]"
                                        dense
                                    >
                                        <template v-slot:label>
                                            <div>I accept the <router-link to="/terms-and-conditions">Terms & Conditions</router-link> of Catapa Belgium. *</div>
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
                                                I accept the <router-link to="/privacy-policy">Privacy Policy</router-link> and <router-link to="/cookies-policy">Cookie Policy</router-link> *
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
                                    <span class="subtitle-1">Have an account? <router-link to="/login">Login</router-link></span><br>
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
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            rules: state => state.user.rules,
            newuser: state => state.user.newuser
        })
    },
    methods: {
        ...mapGetters('user',['signUpIsValid']),
        ...mapActions('user',['signup'])
    },
}
</script>