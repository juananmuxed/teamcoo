<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit {{ searchedWG.name }}</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Name"
                        v-model="workgroupForm.name"
                        :rules="[rules.required,rules.minletter]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-menu :close-on-content-click="false" :nudge-height="0" offset-y transition="slide-y-transition">
                        <template v-slot:activator="{ on }">
                            <v-btn class="custom-btn mb-3" :color="workgroupForm.color" block depressed v-on="on" :ripple="false" elevation="0"><span :class="`${workgroupForm.textcolor}--text`">{{ workgroupForm.color }}</span></v-btn>
                        </template>
                        <v-card :color="workgroupForm.color" elevation="0">
                            <v-color-picker
                                hide-mode-switch
                                hide-inputs
                                mode.sync="hex"
                                flat
                                v-model="workgroupForm.color"
                                v-on:update:color="idealTextColor(workgroupForm.color)"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-textarea
                        outlined
                        label="Description"
                        auto-grow
                        counter
                        rows="3"
                        v-model="workgroupForm.description"
                        :rules="[rules.required,rules.maxdescletters]"
                    >
                    </v-textarea>
                </v-col>
                <v-col cols="12" class="py-1" v-if="workgroupForm.oldDossier != null">
                    <a :href="workgroupForm.oldDossier" target="_blank">Actual Dossier</a><br>
                    If you change the Dossier, the Actual Dossier will be deleted.
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-file-input
                        chips
                        :label="workgroupForm.oldDossier != null ? 'New Dossier': 'Dossier'"
                        outlined
                        prepend-icon="fas fa-file"
                        hint="PDF"
                        :clearable=false
                        v-model="workgroupForm.dossier"
                        accept="application/pdf"
                        :rules="[rules.maxSize]"
                    >
                    </v-file-input>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Link to documents"
                        v-model="workgroupForm.link"
                        :rules="[rules.validlink]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-dialog
                        max-width="650"
                        v-model="menu.dialogs.createquestion"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn block color="accent" class="mb-3" v-on="on">New Question</v-btn>
                        </template>
                        <create-question></create-question>
                    </v-dialog>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-select
                        label="Questions"
                        v-model="workgroupForm.questionsSelected"
                        multiple
                        chips
                        outlined
                        prepend-icon="fas fa-question"
                        :items="workgroupForm.questions"
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                    >
                        <template v-slot:selection="{ data, item, index }">
                            <v-chip v-if="index < 3">
                                <span>{{ item.text }}</span>
                            </v-chip>
                            <span
                                v-if="index === 3"
                                class="grey--text caption"
                            >(+{{ workgroupForm.questionsSelected.length - 3 }} others)</span>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-content>
                                <v-list-item-title>{{ data.item.text }}</v-list-item-title>
                                <v-list-item-subtitle>{{ data.item.type.toUpperCase() }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="primary" @click="saveEditedWG(searchedWG._id)" v-show="!editedwg() && !correctwg()" class="mt-8 mr-12">
                    <v-icon small>fas fa-save</v-icon>
                </v-btn>
            </v-slide-y-transition>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="info" @click="loadeditedwg()" v-show="!editedwg()" class="mt-8">
                    <v-icon small>fas fa-undo</v-icon>
                </v-btn>
            </v-slide-y-transition>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import createquestion from './createquestion.vue'
export default {
    components:{
        'create-question': createquestion
    },
    computed: {
        ...mapState({
            workgroupForm: state => state.actions.workgroupForm,
            searchedWG: state => state.actions.searchedWG,
            loginuser: state => state.user.loginuser,
            menu: state => state.menu.menu,
            workgroups: state => state.actions.workgroups,
            secretworkgroups: state => state.actions.secretworkgroups,
            rules: state => state.user.rules,
            userId: state => state.user.loginuser.id
        })
    },
    methods: {
        ...mapMutations('actions',['verifySecret','loadeditedwg']),
        ...mapActions('actions',['idealTextColor','saveEditedWG']),
        ...mapGetters('actions',['editedwg','correctwg'])
    },
    created() {
        this.loadeditedwg()
    }
}
</script>

<style scoped>
.custom-btn::before {
    color: transparent
}
</style>