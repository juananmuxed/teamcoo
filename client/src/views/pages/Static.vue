<template>
  <v-container class="pa-10" fluid>
    <v-row v-if="page">
      <v-col>
        <v-skeleton-loader
          type="article"
          max-width="1080"
          class="mx-auto"
          transition="fade-transition"
          :loading="skeleton"
        >
          <v-card outlined flat max-width="1080" class="mx-auto pa-4">
            <v-card-title class="mb-3">
              <v-icon size="60" color="primary">{{ page.icon }}</v-icon>
              <span class="display-2 font-weight-medium ml-6">{{
                page.title
              }}</span>
            </v-card-title>
            <v-card-text v-html="page.value"></v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { sleep } from "../../utils/utils";
export default {
  data() {
    return {
      skeleton: true,
    };
  },
  computed: {
    ...mapState({
      page: (state) => state.general.page,
    }),
  },
  methods: {
    ...mapActions("general", ["searchPage"]),
  },
  watch: {
    "$route.params.slug": async function (slug) {
      this.skeleton = true;
      await this.searchPage(slug);
      await sleep(400);
      this.skeleton = false;
    },
  },
  async created() {
    this.skeleton = true;
    await this.searchPage(this.$route.params.slug);
    await sleep(400);
    this.skeleton = false;
  },
};
</script>