<template>
  <v-skeleton-loader
    type="skeleton"
    :types="{ skeleton: 'card,article, table-tfoot' }"
    class="mx-auto"
    transition="fade-transition"
    :loading="skeleton"
  >
    <v-card flat>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Static Pages</v-card-title
      >
      <v-card flat class="pa-6" v-for="(page, index) in pages" :key="index">
        <v-card-title>
          <v-icon>{{ page.icon }}</v-icon>
          <span class="display-1 text-uppercase font-weight-thin ml-4">{{
            `${page.name} page`
          }}</span>
        </v-card-title>
        <textarea-editor v-model="pagesValues[page.value]"></textarea-editor>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn fab small color="primary" @click="saveConfig(page)">
            <v-icon small>fas fa-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import { mapActions, mapState } from "vuex";
import textareaeditorVue from "./textareaeditor.vue";

export default {
  data() {
    return {
      skeleton: false,
    };
  },
  components: {
    "textarea-editor": textareaeditorVue,
  },
  computed: {
    ...mapState("general", ["pages", "pagesValues", "pagesValuesNotEdited"]),
  },
  methods: {
    ...mapActions("general", ["searchConfig", "saveConfig"]),
  },
  created() {
    this.skeleton = true;
    this.pages.forEach((page, i) => {
      this.searchConfig(page).finally(() => {
        if (this.pages.length - 1 == i) {
          this.skeleton = false;
        }
      });
    });
  },
};
</script>