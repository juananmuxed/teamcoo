<template>
  <v-container class="pa-12" fluid>
    <v-row v-if="homePage">
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
              <span class="display-2 font-weight-medium">{{
                homePage.title
              }}</span>
            </v-card-title>
            <v-card-text v-html="homePage.value"></v-card-text>
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
      homePage: (state) => state.general.pagesSpecials.home,
    }),
  },
  methods: {
    ...mapActions("general", ["getPage"]),
  },
  async created() {
    this.skeleton = true;
    await this.getPage("home");
    await sleep(400);
    this.skeleton = false;
  },
};
</script>