<template>
    <v-card
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase" v-html="title"></v-card-title>
        <v-card-text v-html="description"></v-card-text>
        <v-card-actions>
            <v-row v-if="cancelFunction != null">
                <v-col cols="6">
                    <v-btn block color="error" @click="cancelFunction(dialog)">
                        Cancel
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn block color="primary" @click="action">
                        {{ textButton }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-btn block color="primary" @click="action(actionparams)">
                        {{ textButton }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props:{
        title:String,
        description:String,
        action:Function,
        actionparams:Object,
        cancelFunction:Function,
        textButton:String,
        dialog:String
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu
        })
    },
}
</script>