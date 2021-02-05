<template>
    <v-card
        max-width="650"
        class="mx-auto"
        :loading="editmemberform.loading"
        :disabled="editmemberform.loading"
        loader-height="8"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit Members from "{{ searchedWorkgroup.name }}"</v-card-title>
        <v-card-text>
            <v-row>
                <template v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedWorkgroup.creator.id">
                    <v-col cols="12" class="py-1 text-uppercase font-weight-light title">Coordinators</v-col>
                    <v-col cols="12" class="py-1">
                        <v-autocomplete
                            label="Members"
                            v-model="editmemberform.coordinators"
                            multiple
                            chips
                            outlined
                            item-value="id"
                            item-text="username"
                            :items="users"
                            :filter="customFilter"
                            return-object
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                >
                                    <v-avatar left v-if="data.item.avatar != ''">
                                        <v-img :src="data.item.avatar"></v-img>
                                    </v-avatar>
                                    <v-avatar left v-else>
                                        <v-icon color="primary" small>fas fa-user</v-icon>
                                    </v-avatar>
                                    <span class="pr-2">
                                        {{ data.item.username }}
                                    </span>
                                    <v-icon
                                        small
                                        @click="data.parent.selectItem(data.item)"
                                    >
                                        fas fa-times-circle
                                    </v-icon>
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
                                <v-list-item-avatar v-if="data.item.avatar != ''">
                                    <img :src="data.item.avatar">
                                </v-list-item-avatar>
                                <v-list-item-avatar v-else color="secondary"><v-icon color="primary">fas fa-user</v-icon></v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title v-html="data.item.firstname + ' ' + data.item.lastname + ' (' + data.item.username + ')'"></v-list-item-title>
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
                        item-text="username"
                        :items="users"
                        :filter="customFilter"
                        return-object
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                            >
                                <v-avatar left v-if="data.item.avatar != ''">
                                    <v-img :src="data.item.avatar"></v-img>
                                </v-avatar>
                                <v-avatar left v-else>
                                    <v-icon color="primary" small>fas fa-user</v-icon>
                                </v-avatar>
                                <span class="pr-2">
                                    {{ data.item.username }}
                                </span>
                                <v-icon
                                    small
                                    @click="data.parent.selectItem(data.item)"
                                >
                                    fas fa-times-circle
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-avatar v-if="data.item.avatar != ''">
                                <img :src="data.item.avatar">
                            </v-list-item-avatar>
                            <v-list-item-avatar v-else color="secondary"><v-icon color="primary">fas fa-user</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-html="data.item.firstname + ' ' + data.item.lastname + ' (' + data.item.username + ')'"></v-list-item-title>
                                <v-list-item-subtitle v-html="data.item.rol.name"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="primary" @click="saveMembers()" v-show="!editedMembers()" class="mt-8 mr-12">
                    <v-icon small>fas fa-save</v-icon>
                </v-btn>
            </v-slide-y-transition>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="info" @click="loadMembers({members:searchedWorkgroup.members,coordinators:searchedWorkgroup.coordinators})" v-show="!editedMembers()" class="mt-8">
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
            searchedWorkgroup: state => state.workgroups.searchedWorkgroup,
            editmemberform: state => state.workgroups.editmemberform,
            users: state => state.users.users,
            loginuser: state => state.user.loginuser
        })
    },
    methods: {
        ...mapActions('users',['loadUsersSilent']),
        ...mapActions('workgroups',['saveMembers']),
        ...mapGetters('workgroups',['editedMembers']),
        ...mapMutations('workgroups',['loadMembers']),
        // TODO: mejorar esta mierda de función de busqueda y extraer
        customFilter (item, queryText) {
            const username = item.username.toLowerCase()
            const firstname = item.firstname.toLowerCase()
            const lastname = item.lastname.toLowerCase()
            const name = firstname + ' ' + lastname
            const search = queryText.toLowerCase()

            return username.indexOf(search) > -1 ||
            firstname.indexOf(search) > -1 ||
            lastname.indexOf(search) > -1 ||
            name.indexOf(search) > -1
        },
    },
    created() {
        this.loadUsersSilent()
    },
}
</script>