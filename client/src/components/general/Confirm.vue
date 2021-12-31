<template>
    <v-card
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase" v-html="title"></v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" v-html="description"></v-col>
                <v-col cols="12" v-if="confirmationPass">
                    <v-text-field
                        outlined
                        label="Confirmation Pass"
                        type="password"
                        v-model="passValue"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-row v-if="cancelFunction != null">
                <v-col cols="6">
                    <v-btn block color="error" @click="cancelFunction(dialog)">
                        Cancel
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn block color="primary" @click="action(actionparams)">
                        {{ textButton }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-btn block color="primary" @click="addPass(actionparams)" :disabled="!validConfirmationPass">
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
    data() {
        return {
            passValue: ''
        };
    },
    props:{
        title:String,
        description:String,
        action:Function,
        actionparams:Object,
        cancelFunction:Function,
        textButton:String,
        confirmationPass:Boolean,
        dialog:String
    },
    computed: {
        ...mapState({
            menu: state => state.menu.menu
        }),
        validConfirmationPass() {
            if(!this.confirmationPass) { return true }
            else {
                return this.passValue != '' ? true: false;
            }
        }
    },
    methods: {
        addPass(params) {
            let newParams = params;
            if(this.confirmationPass) newParams.password = this.passValue;
            this.action(newParams)
        }
    }
}
</script>