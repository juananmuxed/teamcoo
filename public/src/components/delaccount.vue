<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Are you absolutely sure?</v-card-title>
        <v-card-text>
            <p>
                This action cannot be undone. This will permanently delete your Account. Its remove all data associations. Please type your Password and DELETE in the second field to confirm. 
            </p>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        outlined
                        label="Password"
                        v-model="del.password"
                        :rules="[rules.required]"
                        :type="del.show ? 'text' : 'password'"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="del.password != ''" @click="del.password = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                        <template v-slot:append-outer>
                            <v-icon color="primary" @click="del.show = !del.show">{{del.show ? 'fas fa-eye' : 'fas fa-eye-slash'}}</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        outlined
                        v-model="del.del"
                        label="Are you sure?"
                        :rules="[rules.required,rules.delete]"
                        hint="Ok, bye!"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="del.del != ''" @click="del.del = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-btn
                        block
                        depressed
                        color="primary"
                        :disabled="deleteIsValid()"
                        @click="deleteAccount()"
                    >
                        I understand the consecuences, delete
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            loginuser: state => state.user.loginuser,
            del: state => state.user.del,
            rules: state => state.user.rules
        })
    },
    methods: {
        ...mapGetters('user',['deleteIsValid']),
        ...mapActions('user',['deleteAccount'])
    },
}
</script>