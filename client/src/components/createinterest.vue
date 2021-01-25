<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">New Interest</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Name"
                        v-model="interestForm.name"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-btn block color="primary">Create Interest</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            interestForm: state => state.actions.interestForm,
            rules: state => state.general.rules
        })
    }
}
</script>