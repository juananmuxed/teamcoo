<template>
  <v-skeleton-loader
    type="skeleton"
    :types="{ skeleton: 'card,article, table-tfoot' }"
    class="mx-auto pa-6"
    transition="fade-transition"
    :loading="skeleton"
  >
    <v-card flat>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Pages</v-card-title
      >
      <v-card flat class="pa-6" v-for="(page, index) in pages" :key="index">
        <v-card-title>
          <v-icon>{{ page.icon }}</v-icon>
          <span
            class="display-1 text-uppercase font-weight-thin ml-4"
            v-text="page.title"
          ></span>
        </v-card-title>
        <v-row>
          <v-col cols="12" sm="4" class="py-1">
            <v-text-field
              outlined
              label="Title"
              v-model="page.title"
              :rules="[rules.required]"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="4" class="py-1">
            <v-autocomplete
              outlined
              :items="icons"
              v-model="page.icon"
              item-text="name"
              item-value="value"
            >
              <template v-slot:selection="data">
                <v-icon v-text="data.item.value"></v-icon>
                <span class="ml-4">{{ data.item.name }}</span>
              </template>
              <template v-slot:item="data">
                <v-list-item-avatar>
                  <v-icon v-text="data.item.value"></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.name"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" class="py-1">
            <v-select
              v-model="page.position"
              :items="positions"
              outlined
              label="Position"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" class="py-1">
            <v-checkbox v-model="page.protected" label="Protected"></v-checkbox>
          </v-col>
        </v-row>
        <textarea-editor v-model="page.value"></textarea-editor>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ma-2" fab small color="primary" @click="savePage(page)">
            <v-icon small>fas fa-save</v-icon>
          </v-btn>
          <v-btn
            class="ma-2"
            fab
            small
            color="error"
            @click="
              setTemporalPage(page);
              menu.dialogs.confirm = true;
            "
          >
            <v-icon small>fas fa-trash</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="menu.dialogs.confirm" max-width="400">
        <confirmation-template
          title="Delete static page"
          description="You are about to delete this Static Page. <br><br>Are you sure?"
          :cancelFunction="null"
          textButton="Delete"
          :action="deletePage"
          :actionparams="searchedPage"
        >
        </confirmation-template>
      </v-dialog>
      <v-row class="px-3">
        <v-col>
          <v-btn
            height="160"
            block
            color="primary"
            class="my-2"
            @click="addPageBlank()"
          >
            <v-icon left>fas fa-plus</v-icon>
            Add Page
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import textareaeditorVue from "./textareaeditor.vue";
import confirm from "../general/confirm.vue";

export default {
  data() {
    return {
      skeleton: false,
      positions: [
        { text: "Home", value: "home" },
        { text: "Registration page", value: "register" },
        { text: "Footer", value: "footer" },
        { text: "Lateral Menu", value: "lateral" },
        { text: "Membership Page", value: "membership" },
      ],
    };
  },
  components: {
    "textarea-editor": textareaeditorVue,
    "confirmation-template": confirm,
  },
  computed: {
    ...mapState({
      pages: (state) => state.general.config.pages,
      icons: (state) => state.general.icons,
      searchedPage: (state) => state.general.config.searchedPage,
      rules: (state) => state.general.rules,
      menu: (state) => state.menu.menu,
    }),
  },
  methods: {
    ...mapActions("general", [
      "savePage",
      "createPage",
      "getStaticPages",
      "deletePage",
    ]),
    ...mapMutations("general", ["addPageBlank", "setTemporalPage"]),
  },
  created() {
    this.skeleton = true;
    this.getStaticPages().finally(() => {
      this.skeleton = false;
    });
  },
};
</script>