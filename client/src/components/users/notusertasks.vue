<template>
    <v-row>
        <v-col cols="12" md="3" class="title font-weight-light">
            Next Tasks
        </v-col>
        <v-col col="12" md="9">
            <v-text-field label="Search" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" v-if="actions.length != 0"><v-divider></v-divider></v-col>
        <v-col cols="12" md="6" xl="3" class="pa-3" v-for="(action , index) in actions" :key="index">
            <v-skeleton-loader
                transition="fade-transition"
                :types="{skeleton:'card,article,actions'}"
                :loading="menu.loader.tasks"
                type="skeleton"
            >
                <v-card>
                    <v-img
                        v-if="action.image != ''"
                        height="200"
                        :src="action.image"
                        class="align-end"
                        gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.7)"
                    >
                        <v-chip small v-for="(workgroup , index) in action.workgroups" :key="index" :color="workgroup.color" class="ma-2">
                            <span :class="`${workgroup.textcolor}--text`">{{ workgroup.name }}</span>
                        </v-chip>
                    </v-img>
                    <v-img
                        v-else
                        height="200"
                        class="align-end"
                        :style="`background:linear-gradient(to bottom, ${action.color}, rgba(245,245,245,.2))`"
                    >
                        <v-chip small v-for="(workgroup , index) in action.workgroups" :key="index" :color="workgroup.color" class="ma-2">
                            <span :class="`${workgroup.textcolor}--text`">{{ workgroup.name }}</span>
                        </v-chip>
                    </v-img>
                    <v-card-title class="text-uppercase font-weight-light">{{ action.name }}</v-card-title>
                    <v-card-text>
                        By: 
                        <v-chip>
                            <v-avatar v-if="action.creator.avatar != ''" left><v-img :src="action.creator.avatar"></v-img></v-avatar>
                            <v-avatar v-else left color="primary"><v-icon x-small>fas fa-user</v-icon></v-avatar>
                            {{ action.creator.firstname }} {{ action.creator.lastname }}
                        </v-chip>

                        <template v-if="action.interests.length != 0">
                            <v-row>
                                <v-col cols="12" md="1">
                                    <v-tooltip
                                        bottom
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on">fas fa-address-card</v-icon>
                                        </template>
                                        <span class="text-right caption font-weight-light">Interests</span>
                                    </v-tooltip>
                                </v-col>
                                <v-col cols="12" md="11">
                                    <v-chip small v-for="(interest , index) in action.interests" :key="index" class="ma-1">{{ interest.name }}</v-chip>
                                </v-col>
                            </v-row>
                        </template>
                        <template v-if="action.usersjoined.length != 0">
                            <v-row>
                                <v-col cols="12" md="1">
                                    <v-tooltip
                                        bottom
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on">fas fa-users</v-icon>
                                        </template>
                                        <span class="text-right caption font-weight-light">Users joined</span>
                                    </v-tooltip>
                                </v-col>
                                <v-col cols="12" md="11">
                                    <v-chip v-for="(user , index) in action.usersjoined" :key="index" class="ma-1">
                                        <v-avatar left><v-img src="https://i.picsum.photos/id/567/100/100.jpg"></v-img></v-avatar>{{ user.name }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </template>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="info">Read more</v-btn>
                        <v-btn color="primary">Join</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn icon v-if="loginuser.rol.value == 'admin'"><v-icon small>fas fa-edit</v-icon></v-btn>
                        <v-dialog
                            max-width="400"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || action.creator.id == loginuser.id"><v-icon small>fas fa-trash</v-icon></v-btn>
                            </template>
                            <confirmation-template 
                                :title="`Delete ${action.name}`" 
                                description="You are about to delete this task. <br><br>Are you sure?" 
                                :cancelFunction="null" 
                                textButton="Delete" 
                                :actionparams="{id:action._id,type:'task'}" 
                                :action="delSomething"
                            ></confirmation-template>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
            </v-skeleton-loader>
        </v-col>
        <template v-if="loginuser.rol.value == 'coor' || loginuser.rol.value == 'admin'">
            <v-col cols="12"><v-divider></v-divider></v-col>
            <v-col cols="12" class="title font-weight-light">
                Your Tasks
            </v-col>
            <template v-for="(action , index) in actions">
                <v-col cols="12" md="6" xl="3" class="pa-3" :key="index + '-own'" v-if="action.creator.id == loginuser.id">
                    <v-skeleton-loader
                        transition="fade-transition"
                        :types="{skeleton:'card,article,actions'}"
                        :loading="menu.loader.tasks"
                        type="skeleton"
                    >
                        <v-card>
                            <v-img
                                v-if="action.image != ''"
                                height="200"
                                :src="action.image"
                                class="align-end"
                                gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.7)"
                            >
                                <v-chip small v-for="(workgroup , index) in action.workgroups" :key="index" :color="workgroup.color" class="ma-2">
                                    <span :class="`${workgroup.textcolor}--text`">{{ workgroup.name }}</span>
                                </v-chip>
                            </v-img>
                            <v-img
                                v-else
                                height="200"
                                class="align-end"
                                :gradient="`to bottom, ${action.color}, ${action.color} 30%`"
                                :style="`background:linear-gradient(to bottom, ${action.color}, rgba(245,245,245,.2))`"
                            >
                                <v-chip small v-for="(workgroup , index) in action.workgroups" :key="index" :color="workgroup.color" class="ma-2">
                                    <span :class="`${workgroup.textcolor}--text`">{{ workgroup.name }}</span>
                                </v-chip>
                            </v-img>
                            <v-card-title class="text-uppercase font-weight-light">{{ action.name }}</v-card-title>
                            <v-card-text>
                                By: 
                                <v-chip>
                                    <v-avatar v-if="action.creator.avatar != ''" left><v-img :src="action.creator.avatar"></v-img></v-avatar>
                                    <v-avatar v-else left color="primary"><v-icon x-small>fas fa-user</v-icon></v-avatar>
                                    {{ action.creator.firstname }} {{ action.creator.lastname }}
                                </v-chip>

                                <template v-if="action.interests.length != 0">
                                    <v-row>
                                        <v-col cols="12" md="1">
                                            <v-tooltip
                                                bottom
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on">fas fa-address-card</v-icon>
                                                </template>
                                                <span class="text-right caption font-weight-light">Interests</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="12" md="11">
                                            <v-chip small v-for="(interest , index) in action.interests" :key="index" class="ma-1">{{ interest.name }}</v-chip>
                                        </v-col>
                                    </v-row>
                                </template>
                                <template v-if="action.usersjoined.length != 0">
                                    <v-row>
                                        <v-col cols="12" md="1">
                                            <v-tooltip
                                                bottom
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-icon v-on="on">fas fa-users</v-icon>
                                                </template>
                                                <span class="text-right caption font-weight-light">Users joined</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="12" md="11">
                                            <v-chip v-for="(user , index) in action.usersjoined" :key="index" class="ma-1">
                                                <v-avatar left><v-img src="https://i.picsum.photos/id/567/100/100.jpg"></v-img></v-avatar>{{ user.name }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="info">Read more</v-btn>
                                <v-btn color="primary">Join</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn icon v-if="loginuser.rol.value == 'admin' || action.creator.id == loginuser.id"><v-icon small>fas fa-edit</v-icon></v-btn>
                                <v-dialog
                                    max-width="400"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon v-if="loginuser.rol.value == 'admin' || action.creator.id == loginuser.id"><v-icon small>fas fa-trash</v-icon></v-btn>
                                    </template>
                                    <confirmation-template 
                                        :title="`Delete ${action.name}`" 
                                        description="You are about to delete this task. <br><br>Are you sure?" 
                                        :cancelFunction="null" 
                                        textButton="Delete" 
                                        :actionparams="{id:action._id,type:'task'}" 
                                        :action="delSomething"
                                    ></confirmation-template>
                                </v-dialog>
                            </v-card-actions>
                        </v-card>
                    </v-skeleton-loader>
                </v-col>
            </template>
            <v-col cols="12" md="6" xl="3" class="pa-3">
                <v-dialog
                    max-width="650"
                    v-model="menu.dialogs.createtask"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn block small color="primary" height="320" class="headline" v-on="on">
                            <v-icon left>fas fa-plus</v-icon> New task
                        </v-btn>
                    </template>
                    <create-new-task></create-new-task>
                </v-dialog>
            </v-col>
        </template>

    </v-row>
</template>

<script>

import { mapState, mapActions , mapMutations } from 'vuex'
import createtask from '../actions/createtask.vue'
import confirm from '../general/confirm.vue'

export default {
    components: {
        'create-new-task':createtask,
        'confirmation-template': confirm
    },
    computed: {
        ...mapState({
            actions: state => state.actions.actions,
            loginuser: state => state.user.loginuser,
            menu: state => state.menu.menu
        })
    },
    methods: {
        ...mapMutations('menu',['cancelDialog']),
        ...mapActions('actions',['loadActions','delSomething'])
    },
    created() {
        if(this.actions.length == 0){
            this.loadActions()
        }
    },
}   
</script>