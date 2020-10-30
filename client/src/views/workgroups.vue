<template>
  <v-container class="pa-10" fluid>
    <v-row class="text-center">
      <v-col>
        <p class="display-1 font-weight-thin text-uppercase">Workgroups</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :items="workgroups" :headers="headers" :loading="loading.workgroups">
          <template v-slot:loading>
            <span class="display-1 text-uppercase font-weight-thin ma-5">Loading Work Groups</span>
          </template>
          <template v-slot:no-data>
            <span class="display-1 text-uppercase font-weight-thin ma-5">No Work Groups</span>
          </template>
          <template v-slot:item.description="{ item }">
            <v-tooltip bottom max-width="220" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <span class="d-inline-block text-truncate font-italic" style="max-width: 250px;" v-on="on">{{ item.description }}</span>
              </template>
              <span class="caption font-italic">{{ item.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.color="{ item }">
            <v-chip :color="item.color">{{ item.color }}</v-chip>
          </template>
          <template v-slot:item.questions="{ item }">
            <v-chip small class="ma-1" v-for="(question,index) in item.questions" v-bind:key="index">{{ question.name }}</v-chip>
          </template>
          <template v-slot:item.members="{ item }">
            <span v-if="item.members.length==0">No members added</span>
            <v-chip small class="ma-1" v-for="(member,index) in item.members" v-bind:key="index">{{ member.firstname }}</v-chip>
          </template>
          <template v-slot:item.coordinators="{ item }">
            <span v-if="item.coordinators.length==0">No coordinators added</span>
            <v-chip small class="ma-1" v-for="(coor,index) in item.coordinators" v-bind:key="index">{{ coor.firstname }}</v-chip>
          </template>
          <template v-slot:item.creator="{ item }">
              {{ item.creator.firstname }}
          </template>
          <template v-slot:item.linktodocuments="{ item }">
            <template v-if="item.linktodocuments != ''">
              <v-btn :href="item.linktodocuments" target="_blank" depressed>Link to documents <v-icon small class="ml-1">fas fa-external-link-alt</v-icon></v-btn>
            </template>
            <template v-else>
              Without link
            </template>
          </template>
          <template v-slot:item.dossier="{ item }">
            <template v-if="item.dossier != null">
              <v-btn :href="item.dossier" target="_blank" depressed>Dossier <v-icon small class="ml-1">fas fa-external-link-alt</v-icon></v-btn>
            </template>
            <template v-else>
              Without dossier
            </template>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn depressed color="info" :to="'/workgroup/' + item._id">
              See more <v-icon small class="ml-3">fas fa-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <template v-if="loginuser.rol.value == 'admin' && secretworkgroups.length != 0">
      <v-row class="text-center">
        <v-col>
            <p class="display-1 font-weight-thin text-uppercase">Private Workgroups</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-data-table :items="secretworkgroups" :headers="headers" :loading="loading.secretworkgroups">
            <template v-slot:loading>
              <span class="display-1 text-uppercase font-weight-thin ma-5">Loading Work Groups</span>
            </template>
            <template v-slot:no-data>
              <span class="display-1 text-uppercase font-weight-thin ma-5">No Work Groups</span>
            </template>
            <template v-slot:item.description="{ item }">
              <v-tooltip bottom max-width="220" transition="slide-y-transition">
                <template v-slot:activator="{ on }">
                  <span class="d-inline-block text-truncate font-italic" style="max-width: 250px;" v-on="on">{{ item.description }}</span>
                </template>
                <span class="caption font-italic">{{ item.description }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.color="{ item }">
              <v-chip :color="item.color">{{ item.color }}</v-chip>
            </template>
            <template v-slot:item.questions="{ item }">
              <v-chip small class="ma-1" v-for="(question,index) in item.questions" v-bind:key="index">{{ question.name }}</v-chip>
            </template>
            <template v-slot:item.members="{ item }">
              <span v-if="item.members.length==0">No members added</span>
              <v-chip small class="ma-1" v-for="(member,index) in item.members" v-bind:key="index">{{ member.firstname }}</v-chip>
            </template>
            <template v-slot:item.coordinators="{ item }">
              <span v-if="item.coordinators.length==0">No coordinators added</span>
              <v-chip small class="ma-1" v-for="(coor,index) in item.coordinators" v-bind:key="index">{{ coor.firstname }}</v-chip>
            </template>
            <template v-slot:item.creator="{ item }">
                {{ item.creator.firstname }}
            </template>
            <template v-slot:item.linktodocuments="{ item }">
              <template v-if="item.linktodocuments != ''">
                <v-btn :href="item.linktodocuments" target="_blank" depressed>Link to documents <v-icon small class="ml-1">fas fa-external-link-alt</v-icon></v-btn>
              </template>
              <template v-else>
                Without link
              </template>
            </template>
            <template v-slot:item.dossier="{ item }">
              <template v-if="item.dossier != null">
                <v-btn :href="item.dossier" target="_blank" depressed>Dossier <v-icon small class="ml-1">fas fa-external-link-alt</v-icon></v-btn>
              </template>
              <template v-else>
                Without dossier
              </template>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn depressed color="info" :to="'/workgroup/' + item._id">
                See more <v-icon small class="ml-3">fas fa-eye</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
      <v-row class="px-3" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
      <v-col>
          <v-dialog
              max-width="650"
              v-model="dialogs.createwg"
          >
              <template v-slot:activator="{ on }">
                  <v-btn height="160" v-on="on" block color="info" class="my-2" @click="clearwgform">
                      <v-icon left>fas fa-users</v-icon> Create Work Group
                  </v-btn>
              </template>
              <create-work-group></create-work-group>
          </v-dialog>
      </v-col>
  </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import createwg from '../components/createwg.vue'
export default {
  data() {
    return {
      headers: [
        {
          text: "Work Groups",
          align: "start",
          value: "name",
          width: 100
        },
        { text: "Description", value: "description", sortable: false, width: 100},
        { text: "Link", value: "linktodocuments", sortable: false, width: 30},
        { text: "Dossier", value: "dossier", sortable: false, width: 30},
        { text: "Coordinators", value: "coordinators", sortable: false, width: 200},
        { text: "Members", value: "members", sortable: false, width: 200},
        { text: "Questions", value: "questions", sortable: false, width: 200},
        { text: "Creator", value: "creator", sortable: false, width: 100},
        { text: "Color", value: "color", sortable: false, width: 100},
        { text: "", value: "actions", sortable: false, width: 100}
      ]
    };
  },
  components:{
      'create-work-group': createwg
  },
  computed: {
    ...mapState({
      workgroups: state => state.actions.workgroups,
      secretworkgroups: state => state.actions.secretworkgroups,
      loginuser: state => state.user.loginuser,
      loading: state => state.actions.loading,
      dialogs: state => state.menu.menu.dialogs
    })
  },
  methods: {
    ...mapActions('actions', ['loadWG','loadQuestions','delSomething']),
    ...mapMutations('actions',['clearwgform'])
  },
  created() {
    this.loadQuestions().then(
      this.loadWG()
    )
  }
};
</script>