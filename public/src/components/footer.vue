<template>
    <v-footer
        padless
        app
        elevation="1"
    >
        <v-container fluid class="pa-1 pr-3 pl-3">

            <v-row>

                <v-col cols="4">
                    <v-icon class="ml-2 mr-2"
                        v-if="!loginuser.dark"
                        @click="changeLight()"
                    >fas fa-lightbulb</v-icon>

                    <v-icon class="ml-2 mr-2"
                        v-else
                        @click="changeLight()"
                    >far fa-lightbulb</v-icon>
                    <v-dialog
                        v-model="menu.dialogs.login"
                        max-width="500"
                        v-if="!isLogged()"
                    >
                        <template v-slot:activator="{ on }">
                            <v-icon class="ms-2" v-on="on">fas fa-user</v-icon>
                        </template>
                        <login-template></login-template>
                    </v-dialog>
                    <v-dialog
                        v-else
                        v-model="menu.dialogs.logout"
                        max-width="400"
                    >
                        <template v-slot:activator="{ on }">
                            <v-icon class="ms-2" v-on="on">fas fa-sign-out-alt</v-icon>
                        </template>
                        <confirmation-template 
                            title="Log Out" 
                            description="You are about to disconnect. Are you sure?" 
                            dialog="logout" 
                            :cancelFunction="cancelDialog" 
                            textButton="Log Out" 
                            :action="logOut"
                        >
                        </confirmation-template>
                    </v-dialog>
                </v-col>

                <v-col
                    cols="8"
                    class="text-right caption font-weight-light"
                >
                    <v-btn text x-small href="https://github.com/juananmuxed" target="_blank">
                        <v-icon left x-small>fab fa-github</v-icon> 
                        MuXeD
                    </v-btn> 
                    Catapa &copy; {{ new Date().getFullYear() }}
                </v-col>

            </v-row>

        </v-container>

    </v-footer>
</template>

<script>
import loginVue from './logintemplate.vue'
import confirm from './confirm.vue'
import { mapState , mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    components:{
        'login-template':loginVue,
        'confirmation-template': confirm
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu,
            loginuser: state => state.user.loginuser,
        })
    },
    methods: {
        ...mapMutations('menu',['cancelDialog']),
        ...mapGetters('menu',['isDark']),
        ...mapGetters('user',['isLogged']),
        ...mapActions('menu',['changeLight']),
        ...mapActions('user',['logOut'])
    },
}
</script>