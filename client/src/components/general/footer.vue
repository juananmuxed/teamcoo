<template>
    <v-footer
        padless
        app
        elevation="10"
    >
        <v-container fluid class="py-0 px-3">

            <v-row align="center">

                <v-col cols="4">
                    <v-tooltip
                        transition="slide-y-reverse-transition"
                        open-delay="100"
                        top
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn icon @click="changeLight()" class="mx-1" :ripple="false" v-on="on">
                                <v-icon>{{ !loginuser.dark ? 'fas fa-lightbulb' : 'far fa-lightbulb' }}</v-icon>
                            </v-btn>
                        </template>
                        <span class="text-right caption font-weight-light">{{!loginuser.dark ? '🌚 Lights off' : '🌞 Lights on'}}</span>
                    </v-tooltip>

                    <v-dialog
                        v-model="menu.dialogs.login"
                        max-width="500"
                        v-if="!isLogged()"
                    >
                        <template v-slot:activator="{ on: onDialog }">
                            <v-tooltip
                                transition="slide-y-reverse-transition"
                                open-delay="100"
                                top
                            >
                                <template v-slot:activator="{ on: onTooltip}">
                                    <v-btn icon v-on="{...onDialog,...onTooltip}" class="mx-1" :ripple="false">
                                        <v-icon>fas fa-user</v-icon>
                                    </v-btn>
                                </template>
                                <span class="text-right caption font-weight-light">Login</span>
                            </v-tooltip>
                        </template>
                        <login-template></login-template>
                    </v-dialog>
                    <v-dialog
                        v-else
                        v-model="menu.dialogs.logout"
                        max-width="400"
                    >
                        <template v-slot:activator="{ on: onDialog }">
                            <v-tooltip
                                transition="slide-y-reverse-transition"
                                open-delay="100"
                                top
                            >
                                <template v-slot:activator="{ on: onTooltip}">
                                    <v-btn icon v-on="{...onDialog,...onTooltip}" class="mx-1" :ripple="false">
                                        <v-icon>fas fa-sign-out-alt</v-icon>
                                    </v-btn>
                                </template>
                                <span class="text-right caption font-weight-light">Logout</span>
                            </v-tooltip>
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
                    class="text-right caption font-weight-light pr-6"
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
import loginVue from '../users/logintemplate.vue'
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