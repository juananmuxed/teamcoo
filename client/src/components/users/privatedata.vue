<template>          
    <v-col>
        <v-row v-if="!loginuser.verifiedemail" class="px-3">
            <v-col class="subtitle-1 font-weight-light text-justify">
                You need verify your email to edit or change data from this web.
                <v-btn color="primary" block class="my-6" @click="sendVerificationMail(loginuser.email)">
                    Verify your Email
                </v-btn>
            </v-col>
        </v-row>
        <v-card elevation="8" :disabled="!loginuser.verifiedemail">
            <v-card-title>
                <v-avatar v-if="loginuser.image">
                    <img :src="loginuser.image">
                </v-avatar>
                <v-avatar v-else color="primary">
                    <v-icon>fas fa-user</v-icon>
                </v-avatar>
                <span class="title font-weight-light pa-3">{{ loginuser.username }}</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        Email: {{ loginuser.email }}<br>
                        <span cols="12" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor' || loginuser.rol.value == 'dire'">Rol: {{ loginuser.rol.name }}</span>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row class="px-3">
            <v-col>
                <v-btn :to="'/users/' + loginuser.id" block color="primary" class="my-2" :disabled="!loginuser.verifiedemail">
                    <v-icon left>fas fa-user-edit</v-icon> Edit Information
                </v-btn>
                <v-dialog
                    max-width="650"
                    v-model="menu.dialogs.changepassword"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" block color="accent" class="my-2">
                            <v-icon left>fas fa-key</v-icon> Change your Password
                        </v-btn>
                    </template>
                    <change-pass></change-pass>
                </v-dialog>
            </v-col>
        </v-row>  
        <v-card elevation="5" :disabled="!loginuser.verifiedemail" v-if="loginuser.rol.value != 'user'" class="my-3">
            <v-card-title class="title font-weight-light pa-3">Working Groups</v-card-title>
            <v-card-text>
                <v-skeleton-loader
                    transition="fade-transition"
                    :loading="menu.loader.wg"
                    :types="{skeleton:'list-item-avatar-two-line,list-item-avatar-two-line'}"
                    type="skeleton"
                >
                    <v-treeview
                        :items="workgroups"
                        item-children="childs"
                        expand-icon="fas fa-angle-down"
                        transition
                        open-all
                    >
                        <template v-slot:label="{ item }">
                            <span class="font-weight-bold subtitle-2 text-uppercase text-truncate grey--text">{{ item.name }}</span>
                        </template>
                        <template v-slot:prepend="{ item }">
                            <v-tooltip
                                transition="slide-x-transition"
                                open-delay="100"
                                right
                            >
                                <template v-slot:activator="{ on }">
                                    <router-link :to="'/workgroups/' + item._id">
                                        <v-avatar v-on="on" :color="item.color" size="36"><span :class="`font-weight-regular ${item.textcolor}--text`">{{ item.name.substring(0,2) }}</span></v-avatar>
                                    </router-link>
                                </template>
                                <span class="text-right caption font-weight-light">See more</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:append="{ item }">
                            <v-tooltip 
                                transition="slide-x-transition"
                                open-delay="100"
                                right
                            >
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" :color="loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'info' : 'error'">{{loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'fas fa-check' : 'fas fa-times'}}</v-icon>
                                </template>
                                <span class="text-right caption font-weight-light">{{loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'Joined' : 'Unjoined'}}</span>
                            </v-tooltip>
                        </template>
                    </v-treeview>
                </v-skeleton-loader>
                <v-row v-if="loginuser.rol.value == 'admin' && secretworkgroups.length != 0">
                    <v-col cols="12">
                        Privated Groups
                    </v-col>
                </v-row>
                <v-skeleton-loader
                    v-if="loginuser.rol.value == 'admin' && secretworkgroups.length != 0"
                    transition="fade-transition"
                    :loading="menu.loader.secretwg"
                    :types="{skeleton:'list-item-avatar-two-line,list-item-avatar-two-line'}"
                    type="skeleton"
                >
                    <v-treeview
                        :items="secretworkgroups"
                        item-children="childs"
                        expand-icon="fas fa-angle-down"
                        transition
                        open-all
                    >
                        <template v-slot:label="{ item }">
                            <span class="font-weight-bold subtitle-2 text-uppercase text-truncate grey--text">{{ item.name }}</span>
                        </template>
                        <template v-slot:prepend="{ item }">
                            <v-tooltip
                                transition="slide-x-transition"
                                open-delay="100"
                                right
                            >
                                <template v-slot:activator="{ on }">
                                    <router-link :to="'/workgroups/' + item._id">
                                        <v-avatar v-on="on" :color="item.color" size="36"><span :class="`font-weight-regular ${item.textcolor}--text`">{{ item.name.substring(0,2) }}</span></v-avatar>
                                    </router-link>
                                </template>
                                <span class="text-right caption font-weight-light">See more</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:append="{ item }">
                            <v-tooltip 
                                transition="slide-x-transition"
                                open-delay="100"
                                right
                            >
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" :color="loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'info' : 'error'">{{loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'fas fa-check' : 'fas fa-times'}}</v-icon>
                                </template>
                                <span class="text-right caption font-weight-light">{{loginuser.workgroups.some(wg => wg._wgId === item._id) ? 'Joined' : 'Unjoined'}}</span>
                            </v-tooltip>
                        </template>
                    </v-treeview>
                </v-skeleton-loader>
            </v-card-text>
            <v-row class="px-3" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
                <v-col>
                    <v-dialog
                        max-width="650"
                        v-model="menu.dialogs.createworkgroup"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" block color="secondary" class="my-2" @click="clearWorkgroupForm">
                                <v-icon left>fas fa-users</v-icon> Create Work Group
                            </v-btn>
                        </template>
                        <create-work-group></create-work-group>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card>
    </v-col>
</template>

<script>
import { mapState, mapActions , mapMutations, mapGetters } from 'vuex'
import changePassword from './changepass.vue'
import createworkgroup from '../workgroups/createworkgroup.vue'

export default {
    components:{
        'change-pass': changePassword,
        'create-work-group': createworkgroup
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu,
            loginuser: state => state.user.loginuser,
            tasks: state => state.tasks.tasks,
            workgroups: state => state.workgroups.nestedWorkgroups,
            secretworkgroups: state => state.workgroups.secretNestedWorkgroups
        })
    },
    methods: {
        ...mapMutations('menu',['cancelDialog']),
        ...mapMutations('workgroups',['clearLoadedWG','clearWorkgroupForm']),
        ...mapActions('user',['sendVerificationMail']),
        ...mapGetters('user',['isSuscribed'])
    }
}   
</script>