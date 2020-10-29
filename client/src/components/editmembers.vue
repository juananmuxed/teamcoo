<template>
    <v-card
        max-width="650"
        class="mx-auto"
        :loading="editmemberform.loading"
        :disabled="editmemberform.loading"
        loader-height="8"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit Members from {{ searchedWG.name }}</v-card-title>
        <v-card-text>
            <v-row>
                <template v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWG.creator.id">
                    <v-col cols="12" class="py-1 text-uppercase font-weight-light title">Coordinators</v-col>
                    <v-col cols="12" class="py-1">
                        <v-autocomplete
                            label="Members"
                            v-model="editmemberform.coordinators"
                            multiple
                            chips
                            outlined
                            item-value="id"
                            item-text="firstname"
                            :items="usersforadd"
                            return-object
                        >
                            <template v-slot:selection="data">
                                <v-chip>
                                    <v-avatar left v-if="data.item.avatar != ''">
                                        <v-img :src="data.item.avatar"></v-img>
                                    </v-avatar>
                                    <v-avatar left v-else>
                                        <v-icon color="primary" small>fas fa-user</v-icon>
                                    </v-avatar>
                                    {{ data.item.firstname }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
                                <v-list-item-avatar v-if="data.item.avatar != ''">
                                    <img :src="data.item.avatar">
                                </v-list-item-avatar>
                                <v-list-item-avatar v-else color="secondary"><v-icon color="primary">fas fa-user</v-icon></v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item.firstname + ' ' + data.item.lastname"></v-list-item-title>
                                    <v-list-item-subtitle v-html="data.item.rol.name"></v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </template>
                <v-col cols="12" class="py-1 text-uppercase font-weight-light title">Members</v-col>

                <v-col cols="12" class="py-1">
                    <v-autocomplete
                        label="Members"
                        v-model="editmemberform.members"
                        multiple
                        chips
                        outlined
                        item-value="id"
                        item-text="firstname"
                        :items="usersforadd"
                        return-object
                    >
                        <template v-slot:selection="data">
                            <v-chip>
                                <v-avatar left v-if="data.item.avatar != ''">
                                    <v-img :src="data.item.avatar"></v-img>
                                </v-avatar>
                                <v-avatar left v-else>
                                    <v-icon color="primary" small>fas fa-user</v-icon>
                                </v-avatar>
                                {{ data.item.firstname }}
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-avatar v-if="data.item.avatar != ''">
                                <img :src="data.item.avatar">
                            </v-list-item-avatar>
                            <v-list-item-avatar v-else color="secondary"><v-icon color="primary">fas fa-user</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-html="data.item.firstname + ' ' + data.item.lastname"></v-list-item-title>
                                <v-list-item-subtitle v-html="data.item.rol.name"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="primary" @click="saveMembers({idWG:searchedWG._id,idUsers:editmemberform.members,idCoor:editmemberform.coordinators})" v-show="!editedMembers()" class="mt-8 mr-12">
                    <v-icon small>fas fa-save</v-icon>
                </v-btn>
            </v-slide-y-transition>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="info" @click="loadmembers({members:searchedWG.members,coordinators:searchedWG.coordinators})" v-show="!editedMembers()" class="mt-8">
                    <v-icon small>fas fa-undo</v-icon>
                </v-btn>
            </v-slide-y-transition>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions , mapGetters, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState({
            searchedWG: state => state.actions.searchedWG,
            editmemberform: state => state.actions.editmemberform,
            usersforadd: state => state.actions.usersforadd,
            loginuser: state => state.user.loginuser
        })
    },
    methods: {
        ...mapActions('actions',['loadusers','saveMembers']),
        ...mapGetters('actions',['editedMembers']),
        ...mapMutations('actions',['loadmembers'])
    },
    created() {
        this.loadmembers({members:this.searchedWG.members,coordinators:this.searchedWG.coordinators})
        this.loadusers()
    },
}
</script>