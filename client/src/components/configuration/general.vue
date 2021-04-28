<template>
  <v-card>
    <v-card flat class="pa-6">
      <v-card-title>
        <v-icon>fas fa-cookie-bite</v-icon>
        <span class="display-1 text-uppercase font-weight-thin ml-4">Cookies Advice Page</span>
      </v-card-title>
      <textarea-editor v-model="legal.advice"></textarea-editor>
      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn fab small color="primary" @click="saveConfig('advice')" :disabled="!isEditedAdvice()">
              <v-icon small>fas fa-save</v-icon>
          </v-btn>
      </v-card-actions>
    </v-card>
    <v-card flat class="pa-6">
      <v-card-title>
        <v-icon>fas fa-user-secret</v-icon>
        <span class="display-1 text-uppercase font-weight-thin ml-4">Privacy Policy Page</span>
      </v-card-title>
      <textarea-editor v-model="legal.privacy"></textarea-editor>
      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn fab small color="primary" @click="saveConfig('privacy')" :disabled="!isEditedPrivacy()">
              <v-icon small>fas fa-save</v-icon>
          </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import textareaeditorVue from './textareaeditor.vue'

export default {
  components: {
    'textarea-editor':textareaeditorVue,
  },
  computed: {
    ...mapState({
        legal: state => state.general.legal
    })
  },
  methods: {
    ...mapActions('general', ['searchConfig','saveConfig']),
    ...mapGetters('general',['isEditedAdvice','isEditedPrivacy'])
  },
  created() {
    this.searchConfig('advice');
    this.searchConfig('privacy');
  }
}
</script>