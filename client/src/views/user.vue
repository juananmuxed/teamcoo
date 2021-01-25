<template>
    <v-container
        class="pa-10"
    >
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader type="heading" class="mx-auto pb-6" transition="fade-transition" :loading="menu.loader.itembig">
                    <v-col cols="12" class="text-uppercase display-1 font-weight-thin">
                        Personal information
                    </v-col>
                </v-skeleton-loader>
                <v-skeleton-loader type="skeleton" :types="{skeleton:'list-item-avatar, divider, card-heading, list-item-three-line, card-heading, list-item-three-line, actions'}" class="mx-auto" transition="fade-transition" :loading="menu.loader.itembig">
                    <v-col cols="12">
                        <v-card class="mx-auto">
                            <v-card-title>
                                <v-btn class="mr-n12" absolute fab top right color="info" @click="goBack()">
                                    <v-icon>fas fa-arrow-left</v-icon>
                                </v-btn>
                                <v-avatar v-if="searchedUser.image" size="32">
                                    <img :src="searchedUser.image">
                                </v-avatar>
                                <v-avatar v-else color="primary" size="32">
                                    <v-icon size="16">fas fa-user</v-icon>
                                </v-avatar>
                                <span class="font-weight-light pl-2">{{ searchedUser.username }}</span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" class="mb-4">
                                        <span class="text-uppercase headline">E-mail<br></span>
                                        <span class="font-weight-light">
                                            {{ searchedUser.email }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" md="6" class="mb-4">
                                        <span class="text-uppercase headline">First name<br></span>
                                        <span class="font-weight-light">
                                            {{ searchedUser.firstname }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" md="6" class="mb-4">
                                        <span class="text-uppercase headline">Last name<br></span>
                                        <span class="font-weight-light">
                                            {{ searchedUser.lastname }}
                                        </span>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <span v-if="searchedUser.membership.status != 'inactive'">
                                    <v-btn block color="primary" class="my-2" to="/membership">
                                        <v-icon left>fas fa-star</v-icon> Go to membership
                                    </v-btn>
                                </span>
                                <span v-else>
                                    <v-btn block color="info" class="my-2" to="/membership">
                                        <v-icon left>fas fa-star</v-icon> Be a member
                                    </v-btn>
                                </span>
                                <v-spacer></v-spacer>
                                <v-dialog
                                    max-width="650"
                                    v-model="menu.dialogs.edituser"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || loginuser.id == $route.params.id"><v-icon color="primary" small @click="loadUserData(searchedUser._id)">fas fa-edit</v-icon></v-btn>
                                    </template>
                                    <edit-user></edit-user>
                                </v-dialog>
                                <v-dialog
                                    max-width="400"
                                    v-model="dialogs.confirm"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin'"><v-icon color="error" small>fas fa-trash</v-icon></v-btn>
                                    </template>
                                    <confirmation-template 
                                        :title="`Delete ${searchedUser.username}`" 
                                        description="You are about to delete this User. <br><br>Are you sure?" 
                                        :cancelFunction="null" 
                                        textButton="Delete" 
                                        :actionparams="{id:searchedUser._id,type:'user'}" 
                                        :action="deleteUser"
                                    ></confirmation-template>
                                </v-dialog>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-skeleton-loader>
                <template v-if="loginuser.rol.value != 'user'">
                    <v-skeleton-loader type="heading" max-width="1080" class="mx-auto py-6" transition="fade-transition" :loading="menu.loader.itembig">
                        <v-col cols="12" class="text-uppercase display-1 font-weight-thin">
                            Extra information
                        </v-col>
                    </v-skeleton-loader>
                    <v-skeleton-loader type="skeleton" :types="{skeleton:'card-heading, list-item-three-line, card-heading, list-item-three-line, actions'}" class="mx-auto" transition="fade-transition" :loading="menu.loader.itembig">
                        <v-col cols="12">
                            <v-card class="mx-auto">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" class="mb-4">
                                            <span class="text-uppercase headline">E-mail<br></span>
                                            <span class="font-weight-light">
                                                {{ searchedUser.email }}
                                            </span>
                                        </v-col>
                                        <v-col cols="12" md="6" class="mb-4">
                                            <span class="text-uppercase headline">First name<br></span>
                                            <span class="font-weight-light">
                                                {{ searchedUser.firstname }}
                                            </span>
                                        </v-col>
                                        <v-col cols="12" md="6" class="mb-4">
                                            <span class="text-uppercase headline">Last name<br></span>
                                            <span class="font-weight-light">
                                                {{ searchedUser.lastname }}
                                            </span>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn icon v-if="loginuser.rol.value == 'admin' || loginuser.id == $route.params.id"><v-icon color="primary" small>fas fa-edit</v-icon></v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-skeleton-loader>
                    <v-skeleton-loader type="heading" max-width="1080" class="mx-auto py-6" transition="fade-transition" :loading="menu.loader.itembig">
                        <v-col cols="12" class="text-uppercase display-1 font-weight-thin">
                            Workgroups
                        </v-col>
                    </v-skeleton-loader>
                    <template v-for="(wg , index) in searchedUser.workgroups">
                        <v-col cols="12" md="6" xl="3" :key="index">
                            <v-skeleton-loader
                                transition="fade-transition"
                                :types="{skeleton:'article,actions'}"
                                :loading="menu.loader.itembig"
                                type="skeleton"
                            >
                                <v-card color="secondary">
                                    <v-card-title class="text-uppercase font-weight-light">{{ wg._wgId }}</v-card-title>
                                    <v-card-text>
                                        <v-chip>
                                            Creator
                                        </v-chip>
                                        <v-chip>Coordinador</v-chip>
                                        <v-chip>Coordinador</v-chip>
                                        <v-chip>Members</v-chip>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn color="info">Go to</v-btn>
                                        <v-btn color="primary">Join</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-skeleton-loader>
                        </v-col>
                    </template>
                </template>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import confirm from '../components/confirm.vue'
import edituser from '../components/edituser.vue'
export default {
    components:{
        'edit-user': edituser,
        'confirmation-template': confirm
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu,
            searchedUser: state => state.users.loadedUser,
            dialogs: state => state.menu.menu.dialogs,
            loginuser: state => state.user.loginuser
        })
    },
    methods: {
        ...mapActions('menu',['goBack']),
        ...mapActions('users',['searchUser','deleteUser','loadUserData'])
    },
    created() {
        if(this.searchedUser == {} || this.searchedUser._id != this.$route.params.id){
            this.searchUser(this.$route.params.id)
        }
    }
}
</script>