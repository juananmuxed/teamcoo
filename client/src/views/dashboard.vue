<template>
    <v-container
        class="pa-10"
        fluid
    >

    <v-row>
        <v-col cols="12" class="display-1 font-weight-thin">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="loginuser.membership.state == 'active'" left color="info" class="pr-1">fas fa-star</v-icon>
                </template>
                <span class="text-right caption font-weight-light">Membershiped!!</span>
            </v-tooltip>
            {{ loginuser.username }}'s Dashboard
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-icon v-on="on" v-if="loginuser.verifiedemail" color="primary">fas fa-check</v-icon>
                </template>
                <span class="text-right caption font-weight-light">Verified Email</span>
            </v-tooltip>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="4" xl="2" class="pa-3">
            <private-data-column></private-data-column>
        </v-col>
        <v-col cols="12" md="8" xl="10" class="pa-3">
            <v-row>
                <v-col cols="12" class="pa-2" v-if="loginuser.rol.value != 'user'">
                    <not-user-tasks></not-user-tasks>
                </v-col>

                <v-col cols="12" v-else>
                    <home-buttons></home-buttons>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    </v-container>
</template>

<script>

import { mapState } from 'vuex'
import privatedata from '../components/users/privatedata.vue'
import homebuttons from '../components/general/homebuttons.vue'
import notusertasks from '../components/users/notusertasks.vue'

export default {
    components:{
        'private-data-column':privatedata,
        'home-buttons':homebuttons,
        'not-user-tasks':notusertasks
    },
    computed: {
        ...mapState({
            loginuser: state => state.user.loginuser
        })
    }
}   
</script>