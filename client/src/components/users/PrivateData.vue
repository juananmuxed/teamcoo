<template>
  <v-col>
    <v-row v-if="!loginUser.verifiedEmail" class="px-3">
      <v-col class="subtitle-1 font-weight-light text-justify">
        You need verify your email to edit or change data from this web.
        <v-btn
          color="primary"
          :loading="sendingEmail"
          block
          class="my-6"
          @click="sendVerificationMail(loginUser.email)"
        >
          Verify your Email
        </v-btn>
      </v-col>
    </v-row>
    <user-card-component
      :user="loginUser"
      :disabled="!loginUser.verifiedEmail"
    ></user-card-component>
    <v-card
      :disabled="!loginUser.verifiedEmail"
      v-if="loginUser.rol.value != 'user'"
      class="my-3"
    >
      <v-card-title class="title font-weight-light pa-3"
        >Working Groups</v-card-title
      >
      <v-card-text>
        <v-skeleton-loader
          transition="fade-transition"
          :loading="menu.loader.wg"
          :types="{
            skeleton: 'list-item-avatar-two-line,list-item-avatar-two-line',
          }"
          type="skeleton"
        >
          <v-treeview
            :items="workgroups"
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
                <span class="text-right caption font-weight-light"
                  >See more</span
                >
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-tooltip transition="slide-x-transition" open-delay="100" right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    :color="
                      loginUser.workgroups.some((wg) => wg._wgId === item._id)
                        ? 'info'
                        : 'error'
                    "
                    >{{
                      loginUser.workgroups.some((wg) => wg._wgId === item._id)
                        ? "fas fa-check"
                        : "fas fa-times"
                    }}</v-icon
                  >
                </template>
                <span class="text-right caption font-weight-light">{{
                  loginUser.workgroups.some((wg) => wg._wgId === item._id)
                    ? "Joined"
                    : "Unjoined"
                }}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-skeleton-loader>
        <v-row
          v-if="loginUser.rol.value == 'admin' && secretworkgroups.length != 0"
        >
          <v-col cols="12"> Privated Groups </v-col>
        </v-row>
        <v-skeleton-loader
          v-if="loginUser.rol.value == 'admin' && secretworkgroups.length != 0"
          transition="fade-transition"
          :loading="menu.loader.secretwg"
          :types="{
            skeleton: 'list-item-avatar-two-line,list-item-avatar-two-line',
          }"
          type="skeleton"
        >
          <v-treeview
            :items="secretworkgroups"
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
                <span class="text-right caption font-weight-light"
                  >See more</span
                >
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-tooltip transition="slide-x-transition" open-delay="100" right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    :color="
                      loginUser.workgroups.some((wg) => wg._wgId === item._id)
                        ? 'info'
                        : 'error'
                    "
                    >{{
                      loginUser.workgroups.some((wg) => wg._wgId === item._id)
                        ? "fas fa-check"
                        : "fas fa-times"
                    }}</v-icon
                  >
                </template>
                <span class="text-right caption font-weight-light">{{
                  loginUser.workgroups.some((wg) => wg._wgId === item._id)
                    ? "Joined"
                    : "Unjoined"
                }}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-skeleton-loader>
      </v-card-text>
      <v-row
        class="px-3"
        v-if="loginUser.rol.value == 'admin' || loginUser.rol.value == 'coor'"
      >
        <v-col>
          <v-dialog max-width="650" v-model="menu.dialogs.createworkgroup">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                block
                color="secondary"
                class="my-2"
                @click="clearWorkgroupForm"
              >
                <v-icon left>fas fa-users</v-icon> Create Work Group
              </v-btn>
            </template>
            <create-work-group></create-work-group>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import CreateWorkgroupVue from "../workgroups/CreateWorkgroup.vue";
import UserCardVue from "./UserCard.vue";

export default {
  components: {
    "create-work-group": CreateWorkgroupVue,
    "user-card-component": UserCardVue,
  },
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu,
      loginUser: (state) => state.user.loginUser,
      dialogs: (state) => state.menu.menu.dialogs,
      sendingEmail: (state) => state.user.sendingEmail,
      tasks: (state) => state.tasks.tasks,
      workgroups: (state) => state.workgroups.nestedWorkgroups,
      secretworkgroups: (state) => state.workgroups.secretNestedWorkgroups,
    }),
  },
  methods: {
    ...mapMutations("menu", ["cancelDialog"]),
    ...mapMutations("workgroups", ["clearLoadedWG", "clearWorkgroupForm"]),
    ...mapActions("user", ["sendVerificationMail"]),
    ...mapGetters("user", ["isSuscribed"]),
  },
};
</script>