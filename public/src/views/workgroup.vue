<template>
    <v-container
        class="pa-10"
    >
    
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="skeleton" :types="{skeleton:'card,article, table-tfoot'}" max-width="840" class="mx-auto" transition="fade-transition" :loading="menu.loader.itembig">
                    <v-card :color="searchedWG.color" :class="`${searchedWG.textcolor}--text mx-auto`" max-width="840">
                        <v-card-title>
                            <v-btn absolute fab top right depressed color="info" @click="goBack();skeletonOn('itembig')">
                                <v-icon>fas fa-arrow-left</v-icon>
                            </v-btn>
                            <v-tooltip right :color="loginuser.workgroups.some(wg => wg._wgId === searchedWG._id) ? 'info' : 'error'" transition="scroll-x-transition">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on" class="text-uppercase font-weight-thin display-1">{{ searchedWG.name }}</span>
                                </template>
                                <span class="text-right caption font-weight-light">{{loginuser.workgroups.some(wg => wg._wgId === searchedWG._id) ? 'Joined' : 'Unjoined'}}</span>
                            </v-tooltip>
                        </v-card-title>
                        <v-card-text :class="`${searchedWG.textcolor}--text`">
                            <span class="text-uppercase headline font-weight-light">Description<br></span>
                            <span class="font-italic">
                                {{ searchedWG.description }}
                            </span>
                            <v-row>
                                <v-col v-if="searchedWG.dossier != null"><v-btn color="info" target="_blank" :href="searchedWG.dossier" block height="120">Dossier</v-btn></v-col>
                                <v-col v-if="searchedWG.linktodocuments != ''"><v-btn color="accent" target="_blank" :href="searchedWG.linktodocuments" block height="120">Link to Documents</v-btn></v-col>
                                <v-col v-if="!loginuser.workgroups.some(wg => wg._wgId === searchedWG._id)" cols="12">
                                    <v-dialog
                                        v-model="dialogs.suscribeto"
                                        max-width="650"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-btn v-on="on" color="primary" block height="120" v-if="!searchedWG.secret">Join</v-btn>
                                        </template>
                                        <suscribe-to-work-group :id="searchedWG._id"></suscribe-to-work-group>
                                    </v-dialog>
                                </v-col>
                                <v-col cols="12" v-else>
                                    <v-dialog
                                        v-model="dialogs.unsuscribewg"
                                        max-width="650"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-btn block height="120" v-on="on" color="secondary">Unjoin</v-btn>
                                        </template>
                                        <confirmation-template 
                                            :title="`Unjoin from <span class='${searchedWG.color}--text pl-2'>${searchedWG.name}</span>`" 
                                            description="You are about to unjoin this Work Group. Your questions are saved in the Database for future stats. <br><br>Are you sure?" 
                                            :cancelFunction="null" 
                                            textButton="Unsuscribe" 
                                            :actionparams="{id:searchedWG._id,name:searchedWG.name}" 
                                            :action="unsuscribeto"
                                        ></confirmation-template>
                                    </v-dialog>
                                </v-col>
                            </v-row>
                            
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-dialog
                                max-width="650"
                                v-model="dialogs.editwg"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || searchedWG.creator.id == loginuser.id"><v-icon :color="searchedWG.textcolor" small>fas fa-edit</v-icon></v-btn>
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
export default {
    components:{
        'suscribe-to-work-group': suscribeto,
        'edit-work-group': editwg,
        'confirmation-template': confirm
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
        ...mapActions('actions',['searchWG','delSomething','loadWG']),
        ...mapActions('user',['unsuscribeto']),
        ...mapActions('menu',['goBack','skeletonOn']),
        ...mapMutations('menu',['loadingbar','loadingstate'])
    },
    created() {
        if(this.searchedWG == {} || this.searchedWG._id != this.$route.params.id){
            this.searchWG(this.$route.params.id)
        }
    },
    mounted() {
        setTimeout(() => {
            this.loadingstate(['itembig',false])
            this.loadingbar([null, false , null])
        }, 800)
    },
}
</script>