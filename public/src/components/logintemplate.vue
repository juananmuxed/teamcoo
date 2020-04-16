<template>
    <v-card
        max-width="500"
        class="mx-auto"
        ref="form"
    >

        <v-card-title class="headline font-weight-medium text-uppercase">Login Catapa</v-card-title>

        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field 
                            outlined
                            v-model="user.email"
                            label="E-mail"
                            prepend-inner-icon="fas fa-at"
                            :rules="[rules.required, rules.emailrules]"
                            hint="Correct Format: user@domain.com"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field 
                            v-model="user.password"
                            outlined
                            :type="user.passshow ? 'text' : 'password'"
                            label="Password"
                            prepend-inner-icon="fas fa-key"
                            :rules="[rules.required]"
                            @keyup.enter="login()"
                        >
                            <template v-slot:append>
                                <v-icon width="52" class="pl-2" v-if="!user.passshow" transition="fade-transition" @click="user.passshow = !user.passshow">fas fa-eye-slash</v-icon>
                                <v-icon width="52" class="pl-2" v-else transition="fade-transition" @click="user.passshow = !user.passshow">fas fa-eye</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row v-if="menu.dialogs.login">
                    <v-col cols="12" md="6">
                        <v-btn depressed block color="secondary" @click="cancelDialog('login')">Close</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn depressed block color="primary" @click="login()" :disabled="isvalid()">Enter</v-btn>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="12">
                        <v-btn depressed color="primary" block :disabled="isvalid()" @click="login()">Enter</v-btn>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <span class="subtitle-1">Do not have an account? <a @click="goToSignin()">Sign Up</a></span><br>
                        <span class="subtitle-1">Do not remember your password? <a @click="goToRemeberme()">Remember me</a></span>
                    </v-col>
                </v-row>

            </v-container>
        </v-card-text>

    </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState({
            menu: state => state.menu.menu,
            user: state => state.user.user,
            rules: state => state.user.rules,
        })
    },
    methods: {
        ...mapGetters('user',['isvalid']),
        ...mapActions('user',['login','goToSignin','goToRemeberme']),
        ...mapMutations('menu',['cancelDialog'])
    },
}
</script>   