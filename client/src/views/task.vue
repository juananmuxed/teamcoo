<template>
    <v-container
        class="pa-10"
    >
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader 
                    type="skeleton" 
                    :types="{skeleton:'card,article, table-tfoot'}" 
                    max-width="1080" class="mx-auto" 
                    transition="fade-transition" 
                    :loading="skeleton">
                    <v-card class="mx-auto" max-width="1080" v-if="searchedTask._id">
                        <v-img
                            v-if="searchedTask.image != ''"
                            height="200"
                            :src="searchedTask.image"
                            class="align-end"
                            gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.7)"
                        >
                            <template v-for="(workgroup , index) in searchedTask.workgroups">
                                <v-chip small :key="index" :color="workgroup.color" class="ma-2" v-if="!workgroup.secret">
                                    <span :class="`${textColor(workgroup.color)}--text`">{{ workgroup.name }}</span>
                                </v-chip>
                            </template>
                        </v-img>
                        <v-img
                            v-else
                            height="200"
                            class="align-end"
                            :style="`background:linear-gradient(to bottom, ${searchedTask.color}, rgba(245,245,245,.2))`"
                        >
                            <template v-for="(workgroup , index) in searchedTask.workgroups">
                                <v-chip small :key="index" :color="workgroup.color" class="ma-2" v-if="!workgroup.secret">
                                    <span :class="`${textColor(workgroup.color)}--text`">{{ workgroup.name }}</span>
                                </v-chip>
                            </template>
                        </v-img>
                        <v-card-title>
                            <v-btn class="ml-n12" absolute fab top left color="info" @click="goBack()">
                                <v-icon>fas fa-arrow-left</v-icon>
                            </v-btn>
                            <v-dialog
                                v-model="dialogs.savemembertask"
                                max-width="650"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" class="mr-n12" absolute fab top right :color="!searchedTask.members.some(m => m.id == loginuser.id) ? 'primary' : 'secondary'">
                                        <v-icon>{{!searchedTask.members.some(m => m.id == loginuser.id) ? 'fas fa-user-plus' : 'fas fa-user-minus'}}</v-icon>
                                    </v-btn>
                                </template>
                                <confirmation-template 
                                    :title="`${!searchedTask.members.some(m => m.id == loginuser.id) ? 'Join' : 'Unjoin'} to ${searchedTask.name}</span>`" 
                                    :description="`You are about to ${!searchedTask.members.some(m => m.id == loginuser.id) ? 'Join' : 'Unjoin'} this Task.<br><br>Are you sure?`" 
                                    :cancelFunction="null" 
                                    textButton="Join" 
                                    :actionparams="{taskId:searchedTask._id, userId:loginuser.id, suscribe:!searchedTask.members.some(m => m.id == loginuser.id)}" 
                                    :action="saveMember"
                                ></confirmation-template>
                            </v-dialog>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="text-uppercase font-weight-thin display-1" v-text="searchedTask.name"></v-list-item-title>
                                    <v-list-item-subtitle>{{ dateFormated(searchedTask.eventStartDate) }} - {{ dateFormated(searchedTask.eventEndDate) }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text :class="`${textColor(searchedTask.color)}--text`">
                            <v-col cols="12" class="mb-4">
                                <span class="text-uppercase headline font-weight-light">Description<br></span>
                                <span class="font-italic">
                                    {{ searchedTask.description }}
                                </span>
                            </v-col>
                            <v-col cols="12">
                                <span class="text-uppercase headline font-weight-light">Interests<br></span>
                            </v-col>
                            <template v-if="searchedTask.interests.length != 0">
                                <v-col cols="12">
                                    <v-chip small v-for="(interest , index) in searchedTask.interests" :key="index" class="ma-1">{{ interest.name }}</v-chip>
                                </v-col>
                            </template>
                            <v-col cols="12" v-else>
                                <span class="text-uppercase font-weight-thin display-1">No interests</span>
                            </v-col>
                            <v-col cols="12">
                                <span class="text-uppercase headline font-weight-light">Members<br></span>
                            </v-col>
                            <template v-if="searchedTask.members.length != 0">
                                <v-col cols="12">
                                    <v-avatar left v-for="(user , index) in searchedTask.members" :key="index" class="ma-1">
                                        <v-tooltip
                                            top
                                        >
                                            <template v-slot:activator="{ on }">                                                    
                                                <template v-if="user.avatar != ''">
                                                    <v-img :src="user.avatar" v-on="on"></v-img>
                                                </template>
                                                <template v-else>
                                                    <v-icon small color="info" v-on="on">fas fa-user</v-icon>
                                                </template>
                                            </template>
                                            <span class="text-right caption font-weight-light">{{user.username}}</span>
                                        </v-tooltip>
                                    </v-avatar>
                                </v-col>
                            </template>
                            <v-col cols="12" v-else>
                                <span class="text-uppercase font-weight-thin display-1">No members</span>
                            </v-col>
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
                        <template v-if="loginuser.rol.value == 'admin' || loginuser.id == searchedTask.creator.id">
                            <v-divider></v-divider>
                            <v-card-actions>
                                    <v-row>
                                        <v-col cols="12" class="font-weight-light ml-5">Created by
                                            <v-chip class="font-italic ml-2" :to="`/users/`+ searchedTask.creator.id">
                                                <v-avatar left v-if="searchedTask.creator.avatar != ''"><v-img :src="searchedTask.creator.avatar"></v-img></v-avatar>
                                                <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
                                                {{ searchedTask.creator.username }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                <v-spacer></v-spacer>
                                <v-dialog
                                    max-width="650"
                                    v-model="dialogs.edittask"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn class="mx-1" @click="loadEditedTask" depressed small color="info" v-on="on" v-if="loginuser.rol.value == 'admin' || searchedTask.creator.id == loginuser.id || searchedTask.coordinators.some(coor => coor.id == loginuser.id)">
                                            Edit
                                            <v-icon x-small class="ml-1">fas fa-edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <edit-task></edit-task>
                                </v-dialog>
                                <v-dialog
                                    max-width="400"
                                    v-model="dialogs.confirm"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn class="mx-1" depressed small color="error" v-on="on" v-if="loginuser.rol.value == 'admin' || searchedTask.creator.id == loginuser.id">
                                            Delete
                                            <v-icon x-small class="ml-1">fas fa-trash</v-icon>
                                        </v-btn>
                                    </template>
                                    <confirmation-template 
                                        :title="`Delete ${searchedTask.name}`" 
                                        description="You are about to delete this Task. <br><br>Are you sure?" 
                                        :cancelFunction="null" 
                                        textButton="Delete" 
                                        :actionparams="{id:searchedTask._id}" 
                                        :action="delTask"
                                    ></confirmation-template>
                                </v-dialog>
                            </v-card-actions>
                        </template>
                    </v-card>
                    <invalid-static
                        v-else
                        item="Task"
                        goto="/tasks"
                    ></invalid-static>
                </v-skeleton-loader>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import invalidstatic from '../components/general/invalid.vue'
import confirm from '../components/general/confirm.vue'
import edittask from '../components/tasks/edittask.vue'
import { dateToBeauty, idealTextColor } from '../utils/utils'
export default {
    data() {
        return {
            polling:null
        }
    },
    components:{
        'invalid-static': invalidstatic,
        'confirmation-template': confirm,
        'edit-task': edittask
    },
    computed: {
        ...mapState({
            searchedTask: state => state.tasks.searchedTask,
            loginuser: state => state.user.loginuser,
            dialogs: state => state.menu.menu.dialogs,
            skeleton: state => state.tasks.skeleton,
        })
    },
    methods: {
        ...mapActions('tasks',['searchTask','searchTaskSilent','delTask','saveMember']),
        ...mapActions('menu',['goBack']),
        ...mapMutations('tasks',['loadMembers','loadEditedTask']),
        refreshing() {
            this.polling = setInterval(() => {
                this.searchTaskSilent(this.$route.params.id)
            }, 5 * 60 * 1000);
        },
        textColor(color) {
            return idealTextColor(color);
        },
        dateFormated(date) {
            return dateToBeauty(date);
        }
    },
    created() {
        this.refreshing()
        if(this.searchedTask == {} || this.searchedTask._id != this.$route.params.id){
            this.searchTask(this.$route.params.id)
        }
    },
    beforeDestroy() {
        clearInterval(this.polling)  
    },
}
</script>