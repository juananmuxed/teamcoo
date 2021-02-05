<template>
    <v-row>
        <v-col cols="12" class="pa-2" v-if="!isLogged()">
            <v-btn color="success" block height="160" @click="goToSignUpAsVolunteer()" class="display-1">Be a Volunteer</v-btn>
        </v-col>
        <v-col cols="12" class="pa-2" v-if="isLogged() && loginuser.rol.value == 'user'">
            <v-btn color="warning" block height="160" class="display-1">Be a Volunteer</v-btn>
        </v-col>
        <v-col cols="12" class="pa-2" v-if="isLogged()">
            <v-btn color="secondary" block height="160" class="display-1" v-if="loginuser.membership.state == 'inactive'">Be a Member</v-btn>
            <v-btn color="secondary" block height="160" class="display-1" v-else>Go to membership</v-btn>
        </v-col>
        <v-col cols="12" class="pa-2" v-if="isLogged() && this.$route.path != '/dashboard'">
            <v-btn color="warning" block height="160" to="/dashboard" class="display-1">Manage your account</v-btn>
        </v-col>
        <v-col cols="12" class="pa-2" v-if="!isLogged()">
            <v-dialog
                v-model="dialogs.login"
                max-width="500"
            >
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" block height="160" v-on="on" class="display-1">Manage your data</v-btn>
                </template>
                <login-template></login-template>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters , mapState, mapActions } from 'vuex'
import logintemplate from '../users/logintemplate.vue'
export default {
    components:{
        'login-template': logintemplate
    },
    computed: {
    ...mapState({
      loginuser: state => state.user.loginuser,
      newuser: state => state.user.newuser,
      dialogs: state => state.menu.menu.dialogs,
    })
  },
  methods: {
    ...mapGetters("user", ["isLogged"]),
    ...mapActions("user", ["goToSignUpAsVolunteer"])
  }
}
</script>