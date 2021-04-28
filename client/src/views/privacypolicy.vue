<template>
    <v-container
        class="pa-10"
        fluid
    >
        <v-row>
            <v-col>
                <v-card outlined flat max-width="1080" class="mx-auto pa-4">
                    <v-card-title class="mb-3">
                      <v-icon size="60" color="primary">fas fa-user-secret</v-icon>
                      <span class="display-2 font-weight-medium ml-6">Privacy Policy</span>
                    </v-card-title>
                    <v-card-text v-html="legal.privacy"></v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
        legal: state => state.general.legal
    })
  },
  methods: {
    ...mapActions('general', ['searchConfig'])
  },
  created() {
    this.searchConfig('privacy');
  }
}
</script>