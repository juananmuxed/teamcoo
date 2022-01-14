<template>
  <v-card
    :disabled="!loginUser.verifiedEmail"
    v-if="loginUser.rol.value != 'user'"
    class="my-3"
  >
    <v-card-title class="title font-weight-light pa-3">Workgroups</v-card-title>
    <v-card-text>
      <v-skeleton-loader
        transition="fade-transition"
        :loading="loading || loadingSecret"
        :types="{
          skeleton: 'list-item-avatar-two-line,list-item-avatar-two-line',
        }"
        type="skeleton"
      >
        <v-treeview
          :items="getNestedWorkgroups()"
          item-children="childs"
          expand-icon="fas fa-angle-down"
          transition
          open-all
        >
          <template v-slot:label="{ item }">
            <span
              class="
                font-weight-bold
                subtitle-2
                text-uppercase text-truncate
                grey--text
              "
              >{{ item.name }}</span
            >
          </template>
          <template v-slot:prepend="{ item }">
            <v-tooltip transition="slide-x-transition" open-delay="100" right>
              <template v-slot:activator="{ on }">
                <router-link :to="'/workgroups/' + item._id">
                  <v-avatar v-on="on" :color="item.color" size="36"
                    ><span
                      :class="`font-weight-regular ${item.textcolor}--text`"
                      >{{ item.name.substring(0, 2) }}</span
                    ></v-avatar
                  >
                </router-link>
              </template>
              <span class="text-right caption font-weight-light">See more</span>
            </v-tooltip>
          </template>
          <template v-slot:append="{ item }">
            <v-tooltip transition="slide-x-transition" open-delay="100" right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on"></v-icon>
              </template>
              <span class="text-right caption font-weight-light">{{
                item._id
              }}</span>
            </v-tooltip>
          </template>
        </v-treeview>
      </v-skeleton-loader>
    </v-card-text>
    <v-dialog max-width="650" v-model="dialogs.createworkgroup">
      <template v-slot:activator="{ on: onDialog }">
        <v-tooltip
          transition="slide-x-reverse-transition"
          open-delay="100"
          left
        >
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn
              v-if="
                loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'
              "
              v-on="{ ...onDialog, ...onTooltip }"
              fab
              right
              top
              absolute
              color="info"
              class="mt-12 ml-2"
              @click="clearWorkgroupForm"
            >
              <v-icon>fas fa-network-wired</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">Create new</span>
        </v-tooltip>
      </template>
      <create-workgroup></create-workgroup>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import CreateWorkgroupVue from "../workgroups/CreateWorkgroup.vue";

export default {
  components: {
    "create-workgroup": CreateWorkgroupVue,
  },
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      loading: (state) => state.workgroups.loading,
      loadingSecret: (state) => state.workgroups.loadingSecret,
    }),
  },
  methods: {
    ...mapMutations("workgroups", ["clearWorkgroupForm"]),
    ...mapActions("user", ["sendVerificationMail"]),
    ...mapActions("workgroups", ["loadWorkgroups"]),
    ...mapGetters("workgroups", ["getNestedWorkgroups"]),
  },
  async created() {
    await this.loadWorkgroups();
  },
};
</script>