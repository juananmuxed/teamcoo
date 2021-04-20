<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Tasks</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :items="tasks" :headers="headers" :loading="loading">
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4">Loading Tasks</span>
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin ma-5 pa-4">No Tasks</span>
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip bottom max-width="220" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <span class="d-inline-block text-truncate font-italic" style="max-width: 250px;" v-on="on">{{ item.description }}</span>
              </template>
              <span class="caption font-italic">{{ item.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.workgroups="{ item }">
            <v-chip small class="ma-1" v-for="(wg,index) in item.workgroups" v-bind:key="index" :color="wg.color" :text-color="textColor(wg.color)" :to="'/workgroups/' + wg._id">{{ wg.name }}</v-chip>
          </template>
          <template v-slot:item.interests="{ item }">
            <v-chip small class="ma-1" v-for="(interest,index) in item.interests" v-bind:key="index"><span>{{ interest.name.substring(0,7) }}</span><span v-if="interest.name.length >= 9">...</span></v-chip>
          </template>
          <template v-slot:item.usersjoined="{ item }">
            <v-avatar size="24px" left v-for="(user , index) in item.usersjoined" :key="index" class="ma-1">
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
          </template>
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color" :text-color="textColor(item.color)">{{ item.color }}</v-chip>
          </template>
          <template v-slot:item.creator="{ item }">
            <v-chip class="mx-1" :to="'/users/' + item.creator.id">
              <v-avatar left v-if="item.creator.avatar != ''"><v-img :src="item.creator.avatar"></v-img></v-avatar>
              <v-avatar left v-else><v-icon small color="info">fas fa-user</v-icon></v-avatar>
              {{ item.creator.username }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn depressed small color="info" :to="'/tasks/' + item._id">
              More <v-icon small class="ml-3">fas fa-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="px-3" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
      <v-col>
          <v-dialog
              max-width="650"
              v-model="dialogs.createworkgroup"
          >
              <template v-slot:activator="{ on }">
                  <v-btn height="160" v-on="on" block color="info" class="my-2" @click="clearTaskForm()">
                      <v-icon left>fas fa-tasks</v-icon> Create Task
                  </v-btn>
              </template>
              <create-task></create-task>
          </v-dialog>
      </v-col>
  </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import createtask from '../components/tasks/createtask.vue'
import { idealTextColor } from '../utils/utils';
export default {
  data() {
    return {
      headers: [
        {
          text: "Tasks",
          align: "start",
          value: "name",
          width: 100
        },
        { text: "Description", value: "description", sortable: false},
        { text: "Joined", value: "usersjoined", sortable: false, width: 200},
        { text: "Workgroups", value: "workgroups", sortable: false, width: 200},
        { text: "Interests", value: "interests", sortable: false, width: 200},
        { text: "Creator", value: "creator", sortable: false, width: 40},
        { text: "Color", value: "color", sortable: false, width: 40},
        { text: "", value: "actions", sortable: false, width: 100}
      ]
    };
  },
  components:{
      'create-task': createtask
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.tasks,
      loginuser: state => state.user.loginuser,
      loading: state => state.tasks.loading,
      dialogs: state => state.menu.menu.dialogs
    })
  },
  methods: {
    ...mapActions('tasks', ['loadTasks']),
    ...mapMutations('tasks',['clearTaskForm']),
    textColor(color) {
        return idealTextColor(color);
    }
  },
  created() {
    this.loadTasks();
  }
};
</script>