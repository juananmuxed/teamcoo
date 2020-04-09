<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Change your Password</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" v-if="isLogged()">
                    <v-text-field
                        outlined
                        label="Old Password"
                        v-model="password.oldpassword"
                        :rules="[rules.required]"
                        :type="password.oldshow ? 'text' : 'password'"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="password.oldpassword != ''" @click="password.oldpassword = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                        <template v-slot:append-outer>
                            <v-icon color="primary" @click="password.oldshow = !password.oldshow">{{password.oldshow ? 'fas fa-eye' : 'fas fa-eye-slash'}}</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        outlined
                        label="New Password"
                        v-model="password.newpassword"
                        :rules="[rules.required]"
                        :type="password.newshow ? 'text' : 'password'"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="password.newpassword != ''" @click="password.newpassword = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                        <template v-slot:append-outer>
                            <v-icon color="primary" @click="password.newshow = !password.newshow">{{password.newshow ? 'fas fa-eye' : 'fas fa-eye-slash'}}</v-icon>
                        </template>
                    </v-text-field>
                    <v-text-field
                        outlined
                        label="Confirm new Password"
                        v-model="password.confirmnewpassword"
                        :rules="[rules.required,rules.changepassconfirm]"
                        :type="password.confshow ? 'text' : 'password'"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="password.confirmnewpassword != ''" @click="password.confirmnewpassword = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                        <template v-slot:append-outer>
                            <v-icon color="primary" @click="password.confshow = !password.confshow">{{password.confshow ? 'fas fa-eye' : 'fas fa-eye-slash'}}</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" v-if="isLogged()">
                    <v-btn
                        block
                        depressed
                        color="primary"
                        @click="changepassword()"
                        :disabled="isChangePass()"
                    >
                        Change Password
                    </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                    <v-btn
                        block
                        depressed
                        color="primary"
                        @click="changepasswordnotlogged(token)"
                        :disabled="isDiferentPass()"
                    >
                        Change it!
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    data() {
        return {
            token:this.$route.params.token
        }
    },
    computed: {
        ...mapState({
            password: state => state.user.password,
            rules: state => state.user.rules
        })  
    },
    methods: {
        ...mapActions('user',['changepassword','changepasswordnotlogged']),
        ...mapGetters('user',['isChangePass','isLogged','isDiferentPass'])
    }
}
</script>