<template>
  <v-container class="pa-12" fluid>
    <v-row v-if="membershipPage">
      <v-col>
        <v-skeleton-loader
          type="article"
          max-width="1080"
          class="mx-auto"
          transition="fade-transition"
          :loading="skeleton"
        >
          <v-card flat max-width="1080" class="mx-auto pa-4">
            <v-card-title class="mb-3">
              <v-icon size="60" color="primary">{{
                membershipPage.icon
              }}</v-icon>
              <span class="display-2 font-weight-medium ml-6">{{
                membershipPage.title
              }}</span>
            </v-card-title>
            <v-card-text v-html="membershipPage.value"></v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { sleep } from "../utils/utils";
export default {
  data() {
    return {
      skeleton: true,
    };
  },
  computed: {
    ...mapState({
      membershipPage: (state) => state.general.pagesSpecials.membership,
    }),
  },
  methods: {
    ...mapActions("general", ["getPage"]),
  },
  async created() {
    this.skeleton = true;
    await this.getMemberPage("membership");
    await sleep(400);
    this.skeleton = false;
  },
};
</script>