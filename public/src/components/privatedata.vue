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
                <span class="title font-weight-light pa-3">{{ loginuser.firstname }} {{ loginuser.lastname }}</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        Email: {{ loginuser.email }}<br>
                        <span cols="12" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor' || loginuser.rol.value == 'dire'">Rol: {{ loginuser.rol.name }}</span>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="px-3">
                    <v-col cols="12" class="headline">
                        Email Configuration
                    </v-col>
                    <v-col cols="12">
                        <v-icon left color="primary" v-if="loginuser.emailconfig.includes('newsletter')">fas fa-check</v-icon><v-icon left color="secondary" v-else>fas fa-times</v-icon> Newsletter
                    </v-col>
                    <v-col cols="12">
                        <v-icon left color="primary" v-if="loginuser.emailconfig.includes('yearreport')">fas fa-check</v-icon><v-icon left color="secondary" v-else>fas fa-times</v-icon> Annual Report
                    </v-col>
                    <v-col cols="12">
                        <v-icon left color="primary" v-if="loginuser.emailconfig.includes('newstaks')">fas fa-check</v-icon><v-icon left color="secondary" v-else>fas fa-times</v-icon> New tasks
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row class="px-3">
            <v-col>
                <v-dialog
                    max-width="650"
                    v-model="menu.dialogs.edituser"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" block color="primary" class="my-2" :disabled="!loginuser.verifiedemail">
                            <v-icon left>fas fa-user-edit</v-icon> Edit Information
                        </v-btn>
                    </template>
                    <edit-user></edit-user>
                </v-dialog>
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
                <v-dialog
                    max-width="650"
                    v-model="menu.dialogs.deleteaccount"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" block color="error" class="my-2">
                            <v-icon left>fas fa-trash</v-icon> Delete Account
                        </v-btn>
                    </template>
                    <delete-account></delete-account>
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
                            <v-menu
                                :close-on-content-click="false" 
                                offset-y
                                max-width="360" 
                                min-width="180" 
                                transition="slide-y-transition"
                            >
                                <template v-slot:activator="{ on }">
                                    <a v-on="on">
                                        <v-avatar :color="item.color" size="36"><span :class="`font-weight-regular ${item.textcolor}--text`">{{ item.name.substring(0,2) }}</span></v-avatar>
                                    </a>
                                </template>
                                <v-card :color="item.color" :class="`${item.textcolor}--text`">
                                    <v-card-title>{{ item.name }}</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text :class="`${item.textcolor}--text`">
                                        <v-row>
                                            <v-col cols="12" class="py-0">
                                                {{ item.description }}
                                            </v-col>
                                            <v-col class="caption font-weight-lightf font-italic text-right py-0">
                                                By:
                                                <v-chip>
                                                    <v-avatar v-if="item.creator.avatar != ''" left><v-img :src="item.creator.avatar"></v-img></v-avatar>
                                                    <v-avatar v-else left color="primary"><v-icon x-small>fas fa-user</v-icon></v-avatar>
                                                    {{ item.creator.firstname }} {{ item.creator.lastname }}
                                                </v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <template v-if="item.dossier != null || item.linktodocuments != ''">
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn v-if="item.dossier != null" target="_blank" :href="item.dossier" color="info">Dossier <v-icon x-small class="ml-2">fas fa-link</v-icon></v-btn>
                                            <v-btn v-if="item.linktodocuments != ''" target="_blank" :href="item.linktodocuments" color="info">Docs <v-icon x-small class="ml-2">fas fa-link</v-icon></v-btn>
                                        </v-card-actions>
                                    </template>
                                </v-card>
                            </v-menu>
                        </template>
                        <template v-slot:append="{ item }">
                            <v-dialog
                                v-if="!loginuser.workgroups.some(wg => wg._wgId === item._id)"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on: onDialog }">
                                    <v-tooltip
                                        transition="slide-x-transition"
                                        open-delay="100"
                                        right
                                    >
                                        <template v-slot:activator="{ on: onTooltip }">
                                            <v-icon color="accent" v-on="{...onDialog,...onTooltip}">fas fa-check</v-icon>
                                        </template>
                                        <span class="text-right caption font-weight-light">Join</span>
                                    </v-tooltip>
                                </template>
                                <suscribe-to-work-group :id="item._id"></suscribe-to-work-group>
                            </v-dialog>
                            <v-dialog
                                v-else
                                max-width="400"
                            >
                                <template v-slot:activator="{ on: onDialog }">
                                    <v-tooltip
                                        transition="slide-x-transition"
                                        open-delay="100"
                                        right
                                    >
                                        <template v-slot:activator="{ on: onTooltip }">
                                            <v-icon color="error" v-on="{...onDialog,...onTooltip}">fas fa-times</v-icon>
                                        </template>
                                        <span class="text-right caption font-weight-light">Unjoin</span>
                                    </v-tooltip>
                                </template>
                                <confirmation-template 
                                    :title="`Unjoin from <span class='${item.color}--text pl-2'>${item.name}</span>`" 
                                    description="You are about to unjoin this Work Group. Your questions are saved in the Database for future stats. <br><br>Are you sure?" 
                                    :cancelFunction="null" 
                                    textButton="Unsuscribe" 
                                    :actionparams="{id:item._id,name:item.name}" 
                                    :action="unsuscribeto"
                                ></confirmation-template>
                            </v-dialog>
                        </template>
                    </v-treeview>
                </v-skeleton-loader>
                <v-row v-if="loginuser.rol.value == 'admin'">
                    <v-col cols="12">
                        Privated Groups
                    </v-col>
                </v-row>
                <v-skeleton-loader
                    v-if="loginuser.rol.value == 'admin'"
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
                            <v-menu
                                :close-on-content-click="false" 
                                offset-y
                                max-width="360" 
                                min-width="180" 
                                transition="slide-y-transition"
                            >
                                <template v-slot:activator="{ on }">
                                    <a v-on="on">
                                        <v-avatar :color="item.color" size="36"><span :class="`font-weight-regular ${item.textcolor}--text`">{{ item.name.substring(0,2) }}</span></v-avatar>
                                    </a>
                                </template>
                                <v-card :color="item.color" :class="`${item.textcolor}--text`">
                                    <v-card-title>{{ item.name }}</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text :class="`${item.textcolor}--text`">
                                        <v-row>
                                            <v-col cols="12" class="py-0">
                                                {{ item.description }}
                                            </v-col>
                                            <v-col class="caption font-weight-lightf font-italic text-right py-0">
                                                By:
                                                <v-chip>
                                                    <v-avatar v-if="item.creator.avatar != ''" left><v-img :src="item.creator.avatar"></v-img></v-avatar>
                                                    <v-avatar v-else left color="primary"><v-icon x-small>fas fa-user</v-icon></v-avatar>
                                                    {{ item.creator.firstname }} {{ item.creator.lastname }}
                                                </v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <template v-if="item.dossier != null || item.linktodocuments != ''">
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn v-if="item.dossier != null" target="_blank" :href="item.dossier" color="info">Dossier <v-icon x-small class="ml-2">fas fa-link</v-icon></v-btn>
                                            <v-btn v-if="item.linktodocuments != ''" target="_blank" :href="item.linktodocuments" color="info">Docs <v-icon x-small class="ml-2">fas fa-link</v-icon></v-btn>
                                        </v-card-actions>
                                    </template>
                                </v-card>
                            </v-menu>
                        </template>
                    </v-treeview>
                </v-skeleton-loader>
            </v-card-text>
            <v-row class="px-3" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
                <v-col>
                    <v-dialog
                        max-width="650"
                        v-model="menu.dialogs.createwg"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" block color="secondary" class="my-2">
                                <v-icon left>fas fa-users</v-icon> Create Work Group
                            </v-btn>
                        </template>
                        <create-work-group></create-work-group>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card>
        <v-row class="px-3">
            <v-col>
                <v-btn block color="info" class="my-2 headline" height="180" to="/membership" v-if="loginuser.membership.state == 'inactive'">
                    <v-icon left>fas fa-star</v-icon> Be a member
                </v-btn>
                <v-btn block color="accent" class="my-2 headline text-center" height="180" to="/membership" v-else>
                    Manage your <br> Membership
                </v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
import { mapState, mapActions , mapMutations, mapGetters } from 'vuex'
import editUser from './edituser.vue'
import confirm from './confirm.vue'
import deleteAccount from './delaccount.vue'
import changePassword from './changepass.vue'
import createwg from './createwg.vue'
import suscribeto from './suscribeto.vue'

export default {
    components:{
        'edit-user':editUser,
        'delete-account': deleteAccount,
        'change-pass': changePassword,
        'suscribe-to-work-group': suscribeto,
        'create-work-group': createwg,
        'confirmation-template': confirm
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu,
            loginuser: state => state.user.loginuser,
            actions: state => state.actions.actions,
            workgroups: state => state.actions.nestedWGs,
            secretworkgroups: state => state.actions.secretnestedWGs,
            edituser: state => state.user.edituser
        })
    },
    methods: {
        ...mapMutations('menu',['cancelDialog']),
        ...mapMutations('actions',['clearLoadedWG']),
        ...mapActions('user',['sendVerificationMail','unsuscribeto']),
        ...mapGetters('user',['isSuscribed'])
    }
}   
</script>