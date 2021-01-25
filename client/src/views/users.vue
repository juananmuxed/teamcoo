<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Users</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="users"
          :headers="headers"
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin">No Users</span>
          </template>
          <template v-slot:item.role="{ item }">
            <v-chip class="text-uppercase" :color="getColor(item.rol.value)" :text-color="getTextColor(item.rol.value)">{{ item.rol.name }}</v-chip>
          </template>
          <template v-slot:item.username="{ item }">
            <v-avatar v-if="item.avatar" size="32">
              <img :src="item.avatar">
            </v-avatar>
            <v-avatar v-else color="primary" size="32">
              <v-icon size="18">fas fa-user</v-icon>
            </v-avatar>
            <span class="font-italic pl-3">{{ item.username }}</span>
          </template>
          <template v-slot:item.name="{ item }">{{ item.firstname }} {{ item.lastname }}</template>
          <template v-slot:item.workgroups="{ item }">
            <v-chip small class="ma-1" v-for="(wg,index) in item.workgroups" v-bind:key="index" :color="wg.color" :text-color="wg.textcolor" :to="'/workgroups/' + wg._wgId">{{ wg.name }}</v-chip>
          </template>
          <template v-slot:item.membership="{ item }">
            <v-tooltip 
              transition="slide-x-transition"
              open-delay="100"
              right
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" :color="item.membership.status == 'active' ? 'info' : 'error'">{{item.membership.status == 'active' ? 'fas fa-check' : 'fas fa-times'}}</v-icon>
              </template>
              <span class="text-right caption font-weight-light">{{item.membership.state == 'active' ? 'Member' : 'Not Member'}}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn depressed color="info" :to="'/users/' + item.id">
              See more <v-icon small class="ml-3">fas fa-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="px-3">
      <v-col>
        <v-btn
          height="160"
          block
          color="success"
          class="my-2"
          @click="changeLoaded(false);refreshUsers()"
        >
          <v-icon left>fas fa-sync-alt</v-icon>Refresh list 
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Users',
          value: 'username',
          width: 10
        },
        {
          text: 'Role',
          value: 'role',
          sortable: false,
          width: 10
        },
        {
          text: 'Name',
          value: 'name',
          sortable: false,
          width: 30
        },
        {
          text: 'Workgroups',
          value: 'workgroups',
          width: 30
        },
        {
          text: 'Membership',
          value: 'membership',
          sortable: false,
          width: 10
        },
        {
          text: '',
          value: 'actions',
          sortable: false,
          width: 10
        },
      ]
    };
  },
  computed: {
    ...mapState({
      users: state => state.users.users,
      loginuser: state => state.user.loginuser
    })
  },
  methods: {
    ...mapActions('users', ['loadUsers']),
    ...mapActions('actions', ['loadWG']),
    ...mapMutations('users',['changeLoaded']),
    getColor(role) {
      return this.$store.getters['users/getRoleColor'](role).color;
    },
    getTextColor(role) {
      return this.$store.getters['users/getRoleColor'](role).textColor;
    },
    refreshUsers() {
      this.loadWG().then(() => {
        this.loadUsers();
      });
    }
  },
  created() {
    this.refreshUsers();
  }
};
</script>