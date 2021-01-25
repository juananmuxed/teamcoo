<template>
    <v-container
        class="pa-10"
    >
    
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="skeleton" :types="{skeleton:'card,article, table-tfoot'}" max-width="1080" class="mx-auto" transition="fade-transition" :loading="menu.loader.itembig">
                    <v-card :color="searchedWG.color" :class="`${searchedWG.textcolor}--text mx-auto`" max-width="1080">
                        <v-card-title>
                            <v-btn class="mr-n12" absolute fab top right color="info" @click="goBack()">
                                <v-icon>fas fa-arrow-left</v-icon>
                            </v-btn>
                            <v-tooltip right :color="loginuser.workgroups.some(wg => wg._wgId === searchedWG._id) ? 'info' : 'error'" transition="scroll-x-transition">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on" class="text-uppercase font-weight-thin display-1">{{ searchedWG.name }}</span>
                                </template>
                                <span class="text-right caption font-weight-light">{{loginuser.workgroups.some(wg => wg._wgId === searchedWG._id) ? 'Joined' : 'Unjoined'}}</span>
                            </v-tooltip>
                            <v-spacer></v-spacer>
                            <v-dialog
                                v-if="!loginuser.workgroups.some(wg => wg._wgId === searchedWG._id)"
                                v-model="dialogs.suscribeto"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" color="primary" rounded v-if="!searchedWG.secret">Join</v-btn>
                                </template>
                                <suscribe-to-work-group :id="searchedWG._id"></suscribe-to-work-group>
                            </v-dialog>
                            <v-dialog
                                v-else
                                v-model="dialogs.unsuscribewg"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn rounded v-on="on" color="secondary">Unjoin</v-btn>
                                </template>
                                <confirmation-template 
                                    :title="`Unjoin from <span class='${searchedWG.color}--text pl-2'>${searchedWG.name}</span>`" 
                                    description="You are about to unjoin this Work Group. Your questions are saved in the Database for future stats. <br><br>Are you sure?" 
                                    :cancelFunction="null" 
                                    textButton="Unsuscribe" 
                                    :actionparams="{id:searchedWG._id}" 
                                    :action="unsuscribeto"
                                ></confirmation-template>
                            </v-dialog>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text :class="`${searchedWG.textcolor}--text`">
                            <v-dialog
                                v-model="dialogs.editmembers"
                                max-width="650"
                            >
                                <edit-members></edit-members>
                            </v-dialog>
                            <v-row>
                                <v-col cols="12" class="mb-4">
                                    <span class="text-uppercase headline font-weight-light">Description<br></span>
                                    <span class="font-italic">
                                        {{ searchedWG.description }}
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6" v-if="searchedWG.dossier != null"><v-btn color="info" target="_blank" :href="searchedWG.dossier" block height="80">Dossier <v-icon right x-small>fas fa-link</v-icon></v-btn></v-col>
                                <v-col cols="12" md="6" v-if="searchedWG.linktodocuments != ''"><v-btn color="accent" target="_blank" :href="searchedWG.linktodocuments" block height="80">Link to Documents <v-icon right x-small>fas fa-link</v-icon></v-btn></v-col>
                            </v-row>
                            <v-toolbar dense elevation="2" color="primary" class="my-1">
                                <v-toolbar-title class="text-uppercase title font-weight-light">Coordinators</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn v-if="(loginuser.rol.value == 'admin' || loginuser.id == searchedWG.creator.id || searchedWG.coordinators.some(coor => coor.id == loginuser.id))" depressed small color="secondary" @click="loadmembers({members:searchedWG.members,coordinators:searchedWG.coordinators}); dialogs.editmembers = true">Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn>
                            </v-toolbar>
                            <v-row v-if="searchedWG.coordinators.length != 0">
                                <v-col cols="12" class="my-1">
                                    <v-chip v-for="(coor , index) in searchedWG.coordinators" v-bind:key="index" class="mx-1">
                                        <v-avatar left v-if="coor.avatar != ''"><v-img :src="coor.avatar"></v-img></v-avatar>
                                        <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                        {{ coor.firstname }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="12" class="my-1">
                                    <v-btn block color="info" @click="loadmembers({members:searchedWG.members,coordinators:searchedWG.coordinators}); dialogs.editmembers = true">Add <v-icon right x-small>fas fa-plus</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <v-toolbar dense elevation="2" color="secondary" class="my-1">
                                <v-toolbar-title class="text-uppercase title font-weight-light">Members</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWG.creator.id || searchedWG.coordinators.some(coor => coor.id == loginuser.id)" depressed small color="primary" @click="loadmembers({members:searchedWG.members,coordinators:searchedWG.coordinators}); dialogs.editmembers = true">Modify <v-icon right x-small>fas fa-edit</v-icon></v-btn>
                            </v-toolbar>
                            <v-row v-if="searchedWG.members.length != 0">
                                <v-col cols="12" class="my-1">
                                    <v-chip v-for="(member , index) in searchedWG.members" v-bind:key="index" class="mx-1">
                                        <v-avatar left v-if="member.avatar != ''"><v-img :src="member.avatar"></v-img></v-avatar>
                                        <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                        {{ member.firstname }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row v-if="searchedWG.members.length == 0 && (loginuser.rol.value == 'admin' || searchedWG.coordinators.some(coor => coor.id == loginuser.id))">
                                <v-col cols="12" class="my-1">
                                    <v-btn block color="info" @click="loadmembers({members:searchedWG.members,coordinators:searchedWG.coordinators}), dialogs.editmembers = true">Add <v-icon right x-small>fas fa-plus</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            
                        </v-card-text>
                        <v-divider v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWG.creator.id || searchedWG.coordinators.some(coor => coor.id == loginuser.id)"></v-divider>
                        <v-card-actions>
                            <template v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWG.creator.id || searchedWG.coordinators.some(coor => coor.id == loginuser.id)">
                                <v-row>
                                    <v-col cols="12" class="caption font-weight-light ml-5">Created by
                                        <v-chip x-small class="font-italic ml-2" :to="`/users/`+ searchedWG.creator.id">
                                            {{ searchedWG.creator.firstname }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </template>
                            <v-spacer></v-spacer>
                            <v-dialog
                                max-width="650"
                                v-model="dialogs.editwg"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || searchedWG.creator.id == loginuser.id || searchedWG.coordinators.some(coor => coor.id == loginuser.id)"><v-icon :color="searchedWG.textcolor" small>fas fa-edit</v-icon></v-btn>
                                </template>
                                <edit-work-group></edit-work-group>
                            </v-dialog>
                            <v-dialog
                                max-width="400"
                                v-model="dialogs.confirm"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || searchedWG.creator.id == loginuser.id"><v-icon :color="searchedWG.textcolor" small>fas fa-trash</v-icon></v-btn>
                                </template>
                                <confirmation-template 
                                    :title="`Delete ${searchedWG.name}`" 
                                    description="You are about to delete this Work Group. <br><br>Are you sure?" 
                                    :cancelFunction="null" 
                                    textButton="Delete" 
                                    :actionparams="{id:searchedWG._id,type:'workgroup'}" 
                                    :action="delSomething"
                                ></confirmation-template>
                            </v-dialog>
                        </v-card-actions>
                    </v-card>
                </v-skeleton-loader>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import suscribeto from '../components/suscribeto.vue'
import confirm from '../components/confirm.vue'
import editwg from '../components/editwg.vue'
import editmembers from '../components/editmembers.vue'
export default {
    data() {
        return {
            polling:null
        }
    },
    components:{
        'suscribe-to-work-group': suscribeto,
        'edit-work-group': editwg,
        'confirmation-template': confirm,
        'edit-members':editmembers
    },
    computed: {
        ...mapState({
            searchedWG: state => state.actions.searchedWG,
            loginuser: state => state.user.loginuser,
            dialogs: state => state.menu.menu.dialogs,
            menu: state => state.menu.menu
        })
    },
    methods: {
        ...mapActions('actions',['searchWG','delSomething','loadWG','refreshingWG']),
        ...mapActions('user',['unsuscribeto']),
        ...mapActions('menu',['goBack']),
        ...mapMutations('actions',['loadmembers']),
        refreshing() {
            this.polling = setInterval(() => {
                this.refreshingWG(this.$route.params.id)
            }, 5 * 60 * 1000);
        }
    },
    created() {
        this.refreshing()
        if(this.searchedWG == {} || this.searchedWG._id != this.$route.params.id){
            this.searchWG(this.$route.params.id)
        }
    },
    beforeDestroy() {
        clearInterval(this.polling)  
    },
}
</script>