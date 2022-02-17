<template>
  <v-skeleton-loader
    type="card"
    transition="fade-transition"
    :loading="skeleton"
  >
    <v-card>
      <v-img
        v-if="task.image"
        height="200"
        :src="task.image"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,0), rgba(245,245,245,.7)"
      >
        <template v-for="(workgroup, index) in task.workgroups">
          <v-chip
            small
            :key="index"
            :color="workgroup.color"
            class="ma-1"
            v-if="!workgroup.secret"
          >
            <span :class="`${textColor(workgroup.color)}--text`">{{
              workgroup.name
            }}</span>
          </v-chip>
        </template>
      </v-img>
      <v-img
        v-else
        height="200"
        class="align-end"
        :gradient="`to bottom, ${task.color}, ${task.color} 30%`"
        :style="`background:linear-gradient(to bottom, ${task.color}, rgba(245,245,245,.2))`"
      >
        <template v-for="(workgroup, index) in task.workgroups">
          <v-chip
            small
            :key="index"
            :color="workgroup.color"
            class="ma-1"
            v-if="!workgroup.secret"
          >
            <span :class="`${textColor(workgroup.color)}--text`">{{
              workgroup.name
            }}</span>
          </v-chip>
        </template>
      </v-img>
      <v-card-title class="text-uppercase">
        <v-row no-gutters>
          <v-col class="grow">
            {{ task.name }}
          </v-col>
          <v-col class="shrink">
            <v-chip
              class="ml-1"
              small
              color="error"
              v-if="outdated(task.eventEndDate)"
            >
              <v-icon small left>fas fa-clock</v-icon>Outdated
            </v-chip>
          </v-col>
        </v-row></v-card-title
      >
      <v-card-subtitle>
        {{ dateFormated(task.eventStartDate) }} -
        {{ dateFormated(task.eventEndDate) }}
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <template v-if="task.interests.length != 0">
          <v-row>
            <v-col cols="12">
              <span class="text-uppercase">Interests</span>
            </v-col>
            <v-col cols="12">
              <v-chip
                small
                v-for="(interest, index) in task.interests"
                :key="index"
                class="ma-1"
                :color="interest.color"
                >{{ interest.name }}</v-chip
              >
            </v-col>
          </v-row>
        </template>
        <template v-if="task.suscribers.length != 0">
          <v-row>
            <v-col cols="12">
              <span
                class="text-uppercase"
                :class="
                  task.suscribers.length >= task.limit ? 'error--text' : ''
                "
                >Volunteers {{ task.suscribers.length }}/{{ task.limit }}</span
              >
              <v-chip
                class="ml-3"
                small
                label
                color="error"
                v-if="task.suscribers.length >= task.limit"
              >
                Full
              </v-chip>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-avatar
                left
                v-for="(user, index) in task.suscribers"
                :key="index"
                class="ma-1"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <template v-if="user.image != ''">
                      <v-avatar size="36">
                        <img :src="user.image" v-on="on" />
                      </v-avatar>
                    </template>
                    <template v-else>
                      <v-avatar size="36" color="secondary">
                        <v-icon small v-on="on">fas fa-user</v-icon>
                      </v-avatar>
                    </template>
                  </template>
                  <span class="text-right caption font-weight-light">{{
                    user.username
                  }}</span>
                </v-tooltip>
              </v-avatar>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <user-options-menu-component
          v-for="(user, index) in task.suscribers"
          v-bind:key="index"
          :user="user"
        ></user-options-menu-component>
        <v-spacer></v-spacer>
        <v-tooltip left transition="slide-x-reverse-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              depressed
              absolute
              top
              right
              fab
              class="mt-12"
              color="info"
              :to="`/tasks/${task._id}`"
            >
              <v-icon left>fas fa-eye</v-icon>
            </v-btn>
          </template>
          <span class="text-right caption font-weight-light">See task</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import {
  dateToBeauty,
  idealTextColor,
  sleep,
  outdated,
} from "../../utils/utils";
import UserOptionsMenuVue from "../users/UserOptionsMenu.vue";
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      skeleton: true,
    };
  },
  components: {
    "user-options-menu-component": UserOptionsMenuVue,
  },
  methods: {
    textColor(color) {
      return idealTextColor(color);
    },
    dateFormated(date) {
      return dateToBeauty(date);
    },
    outdated(date) {
      return outdated(date);
    },
  },
  async created() {
    await sleep(200);
    this.skeleton = false;
  },
};
</script>
