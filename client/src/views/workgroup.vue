<template>
    <v-container
        class="pa-10"
    >
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="skeleton" :types="{skeleton:'card,article, table-tfoot'}" max-width="1080" class="mx-auto" transition="fade-transition" :loading="skeleton">
                    <v-card :color="searchedWorkgroup.color" :class="`${textColor(searchedWorkgroup.color)}--text mx-auto`" max-width="1080" v-if="searchedWorkgroup._id">
                        <v-card-title>
                            <v-btn class="ml-n12" absolute fab top left color="info" @click="goBack()">
                                <v-icon>fas fa-arrow-left</v-icon>
                            </v-btn>
                            <v-tooltip right :color="loginuser.workgroups.some(wg => wg._wgId === searchedWorkgroup._id) ? 'info' : 'error'" transition="scroll-x-transition">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on" class="text-uppercase font-weight-thin display-1">{{ searchedWorkgroup.name }}</span>
                                </template>
                                <span class="text-right caption font-weight-light">{{loginuser.workgroups.some(wg => wg._wgId === searchedWorkgroup._id) ? 'Joined' : 'Unjoined'}}</span>
                            </v-tooltip>
                            <v-spacer></v-spacer>
                            <v-dialog
                                v-if="!loginuser.workgroups.some(wg => wg._wgId === searchedWorkgroup._id)"
                                v-model="dialogs.suscribeto"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" color="primary" rounded v-if="!searchedWorkgroup.secret">Join</v-btn>
                                </template>
                                <suscribe-to-work-group :id="searchedWorkgroup._id"></suscribe-to-work-group>
                            </v-dialog>
                            <v-dialog
                                v-else
                                v-model="dialogs.unsuscribeworkgroup"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn rounded v-on="on" color="secondary">Unjoin</v-btn>
                                </template>
                                <confirmation-template 
                                    :title="`Unjoin from <span class='${searchedWorkgroup.color}--text pl-2'>${searchedWorkgroup.name}</span>`" 
                                    description="You are about to unjoin this Work Group. Your questions are saved in the Database for future stats. <br><br>Are you sure?" 
                                    :cancelFunction="null" 
                                    textButton="Unsuscribe" 
                                    :actionparams="{idWorkgroup:searchedWorkgroup._id, idUser:loginuser.id, suscribe:false}" 
                                    :action="unsuscribeWorkgroup"
                                ></confirmation-template>
                            </v-dialog>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text :class="`${textColor(searchedWorkgroup.color)}--text`">
                            <v-dialog
                                v-model="dialogs.editmembers"
                                max-width="650"
                            >
                                <edit-members></edit-members>
                            </v-dialog>
                            <v-row>
                                <v-col cols="12">
                                    <v-chip color="secondary" v-if="searchedWorkgroup.secret">
                                        Private
                                    </v-chip>
                                </v-col>
                                <v-col cols="12" class="mb-4">
                                    <span class="text-uppercase headline font-weight-light">Description<br></span>
                                    <span class="font-italic">
                                        {{ searchedWorkgroup.description }}
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" v-if="searchedWorkgroup.dossier != null"><v-btn color="info" target="_blank" :href="searchedWorkgroup.dossier" block height="80">Dossier <v-icon right x-small>fas fa-link</v-icon></v-btn></v-col>
                                <v-col cols="12" md="6" v-if="searchedWorkgroup.linktodocuments != ''"><v-btn color="accent" target="_blank" :href="searchedWorkgroup.linktodocuments" block height="80">Link to Documents <v-icon right x-small>fas fa-link</v-icon></v-btn></v-col>
                            </v-row>
                            <v-toolbar dense elevation="2" color="primary" class="my-1">
                                <v-toolbar-title class="text-uppercase title font-weight-light">Coordinators</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn v-if="(loginuser.rol.value == 'admin' || loginuser.id == searchedWorkgroup.creator.id || searchedWorkgroup.coordinators.some(coor => coor.id == loginuser.id))" depressed small color="secondary" @click="loadMembers({members:searchedWorkgroup.members,coordinators:searchedWorkgroup.coordinators}); dialogs.editmembers = true">Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn>
                            </v-toolbar>
                            <v-row v-if="searchedWorkgroup.coordinators && searchedWorkgroup.coordinators.length != 0">
                                <v-col cols="12" class="my-1">
                                    <v-chip v-for="(coor , index) in searchedWorkgroup.coordinators" v-bind:key="index" class="mx-1">
                                        <v-avatar left v-if="coor.avatar != ''"><v-img :src="coor.avatar"></v-img></v-avatar>
                                        <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                        {{ coor.username }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="12" class="my-1">
                                    <v-btn block color="info" @click="loadMembers({members:searchedWorkgroup.members,coordinators:searchedWorkgroup.coordinators}); dialogs.editmembers = true">Add <v-icon right x-small>fas fa-plus</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <v-toolbar dense elevation="2" color="secondary" class="my-1">
                                <v-toolbar-title class="text-uppercase title font-weight-light">Members</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWorkgroup.creator.id || searchedWorkgroup.coordinators.some(coor => coor.id == loginuser.id)" depressed small color="primary" @click="loadMembers({members:searchedWorkgroup.members,coordinators:searchedWorkgroup.coordinators}); dialogs.editmembers = true">Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn>
                            </v-toolbar>
                            <v-row v-if="searchedWorkgroup.members && searchedWorkgroup.members.length != 0">
                                <v-col cols="12" class="my-1">
                                    <v-chip v-for="(member , index) in searchedWorkgroup.members" v-bind:key="index" class="mx-1">
                                        <v-avatar left v-if="member.avatar != ''"><v-img :src="member.avatar"></v-img></v-avatar>
                                        <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                        {{ member.username }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row v-if="searchedWorkgroup.members && searchedWorkgroup.members.length == 0 && (loginuser.rol.value == 'admin' || searchedWorkgroup.coordinators.some(coor => coor.id == loginuser.id))">
                                <v-col cols="12" class="my-1">
                                    <v-btn block color="info" @click="loadMembers({members:searchedWorkgroup.members,coordinators:searchedWorkgroup.coordinators}), dialogs.editmembers = true">Add <v-icon right x-small>fas fa-plus</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <template v-if="loginuser.rol.value == 'coor' || loginuser.rol.value == 'admin'">
                                <v-col cols="12" class="text-uppercase headline font-weight-light">
                                    Comments
                                    <v-chip label x-small color="secondary">In development</v-chip>
                                </v-col>
                                <v-col cols="12">
                                    <v-alert
                                        dense
                                        color="info"
                                        icon="fas fa-comment"
                                        border="left"
                                    >
                                        <v-row align="center" no-gutters>
                                            <v-col class="grow">
                                                User
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col class="shrink">
                                                Date
                                            </v-col>
                                        </v-row>
                                        <v-divider class="my-4" color="primary"></v-divider>
                                        <v-row align="center" no-gutters>
                                            <v-col class="grow">
                                                Proin magna. Vivamus in erat ut urna cursus vestibulum. Etiam imperdiet imperdiet orci.
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col class="shrink">
                                                <v-btn icon>
                                                    <v-icon small color="error">fas fa-trash</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-alert>
                                    <v-badge overlap bordered icon="fas fa-lock">
                                        <v-btn block color="primary"><v-icon small left>fas fa-comments</v-icon>Add comment</v-btn>
                                    </v-badge>
                                </v-col>
                            </template>
                        </v-card-text>
                        <template v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWorkgroup.creator.id || searchedWorkgroup.coordinators.some(coor => coor.id == loginuser.id)">
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" class="font-weight-light ml-5">Created by
                                        <v-chip class="font-italic ml-2" :to="`/users/`+ searchedWorkgroup.creator.id">
                                            <v-avatar left v-if="searchedWorkgroup.creator.avatar != ''"><v-img :src="searchedWorkgroup.creator.avatar"></v-img></v-avatar>
                                            <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                            {{ searchedWorkgroup.creator.username }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                                <v-spacer></v-spacer>
                                <v-dialog
                                    max-width="650"
                                    v-model="dialogs.editworkgroup"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn class="mx-1" @click="loadEditedWorkgroup" depressed small color="info" v-on="on" v-if="loginuser.rol.value == 'admin' || searchedWorkgroup.creator.id == loginuser.id || searchedWorkgroup.coordinators.some(coor => coor.id == loginuser.id)">
                                            Edit
                                            <v-icon x-small class="ml-1">fas fa-edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <edit-work-group></edit-work-group>
                                </v-dialog>
                                <v-dialog
                                    max-width="400"
                                    v-model="dialogs.confirm"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn class="mx-1" depressed small color="error" v-on="on" v-if="loginuser.rol.value == 'admin' || searchedWorkgroup.creator.id == loginuser.id">
                                            Delete
                                            <v-icon x-small class="ml-1">fas fa-trash</v-icon>
                                        </v-btn>
                                    </template>
                                    <confirmation-template 
                                        :title="`Delete ${searchedWorkgroup.name}`" 
                                        description="You are about to delete this Work Group. <br><br>Are you sure?" 
                                        :cancelFunction="null" 
                                        textButton="Delete" 
                                        :actionparams="{id:searchedWorkgroup._id,type:'workgroup'}" 
                                        :action="delWorkgroup"
                                    ></confirmation-template>
                                </v-dialog>
                            </v-card-actions>
                        </template>
                    </v-card>
                    <invalid-static
                        v-else
                        item="Workgroup"
                        goto="/workgroups"
                    ></invalid-static>
                </v-skeleton-loader>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import suscribeto from '../components/workgroups/suscribeto.vue'
import confirm from '../components/general/confirm.vue'
import invalidstatic from '../components/general/invalid.vue'
import editworkgroup from '../components/workgroups/editworkgroup.vue'
import editmembers from '../components/workgroups/editmembers.vue'
import { idealTextColor } from '../utils/utils'
export default {
    data() {
        return {
            polling:null
        }
    },
    components:{
        'suscribe-to-work-group': suscribeto,
        'edit-work-group': editworkgroup,
        'confirmation-template': confirm,
        'edit-members':editmembers,
        'invalid-static': invalidstatic
    },
    computed: {
        ...mapState({
            searchedWorkgroup: state => state.workgroups.searchedWorkgroup,
            loginuser: state => state.user.loginuser,
            dialogs: state => state.menu.menu.dialogs,
            skeleton: state => state.workgroups.skeleton,
        })
    },
    methods: {
        ...mapActions('workgroups',['searchWorkgroup','searchWorkgroupSilent','delWorkgroup','unsuscribeWorkgroup']),
        ...mapActions('menu',['goBack']),
        ...mapMutations('workgroups',['loadMembers','loadEditedWorkgroup']),
        refreshing() {
            this.polling = setInterval(() => {
                this.searchWorkgroupSilent(this.$route.params.id)
            }, 5 * 60 * 1000);
        },
        textColor(color) {
            return idealTextColor(color);
        },
    },
    created() {
        this.refreshing()
        if(this.searchedWorkgroup == {} || this.searchedWorkgroup._id != this.$route.params.id){
            this.searchWorkgroup(this.$route.params.id)
        }
    },
    beforeDestroy() {
        clearInterval(this.polling)  
    },
}
</script>