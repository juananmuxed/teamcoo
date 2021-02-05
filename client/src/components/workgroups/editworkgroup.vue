<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit "{{ searchedWorkgroup.name }}"</v-card-title>
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
                <v-col cols="10" class="py-1">
                    <v-menu :close-on-content-click="false" :nudge-height="0" offset-y transition="slide-y-transition">
                        <template v-slot:activator="{ on }">
                            <v-btn class="custom-btn mb-3" :color="workgroupForm.color" block depressed v-on="on" :ripple="false" elevation="0"><span :class="`${textColor(workgroupForm.color)}--text`">{{ workgroupForm.color }}</span></v-btn>
                        </template>
                        <v-card :color="workgroupForm.color" elevation="0">
                            <v-color-picker
                                hide-mode-switch
                                hide-inputs
                                mode.sync="hex"
                                flat
                                v-model="workgroupForm.color"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                </v-col>
                <v-col cols="2" class="py-1">
                    <v-btn class="mb-3" :color="workgroupForm.color" block depressed :ripple="false" elevation="0" @click="randomWorkgroupColor()"><v-icon :color="textColor(workgroupForm.color)">fas fa-dice</v-icon></v-btn>
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
                            <v-btn @click="clearquestionForm" block color="accent" class="mb-3" v-on="on">New Question</v-btn>
                        </template>
                        <create-question></create-question>
                    </v-dialog>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-autocomplete
                        label="Questions"
                        v-model="workgroupForm.questionsSelected"
                        multiple
                        return-object
                        small-chips
                        outlined
                        prepend-icon="fas fa-question"
                        item-value="_id"
                        item-text="name"
                        :items="questions"
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                        :filter="customFilter"
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                            >
                                <span class="pr-2">
                                    {{ data.item.name }}
                                </span>
                                <v-icon
                                    small
                                    @click="data.parent.selectItem(data.item)"
                                >
                                    fas fa-times-circle
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-content>
                                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ data.item.type.toUpperCase() }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="primary" @click="saveEditedworkgroup(searchedWorkgroup._id)" v-show="!editedWorkgroup() && !validWorkgroup()" class="mt-8 mr-12">
                    <v-icon small>fas fa-save</v-icon>
                </v-btn>
            </v-slide-y-transition>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="info" @click="loadEditedWorkgroup()" v-show="!editedWorkgroup()" class="mt-8">
                    <v-icon small>fas fa-undo</v-icon>
                </v-btn>
            </v-slide-y-transition>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { idealTextColor } from '../../utils/utils';
import createquestion from '../questions/createquestion.vue'
export default {
    components:{
        'create-question': createquestion
    },
    computed: {
        ...mapState({
            workgroupForm: state => state.workgroups.workgroupForm,
            searchedWorkgroup: state => state.workgroups.searchedWorkgroup,
            questions: state => state.questions.questions,
            loginuser: state => state.user.loginuser,
            menu: state => state.menu.menu,
            workgroups: state => state.workgroups.workgroups,
            secretWorkgroups: state => state.workgroups.secretWorkgroups,
            rules: state => state.general.rules,
            userId: state => state.user.loginuser.id
        })
    },
    methods: {
        ...mapMutations('workgroups',['verifySecret','loadEditedWorkgroup','randomWorkgroupColor']),
        ...mapGetters('workgroups',['editedWorkgroup','validWorkgroup']),
        ...mapActions('workgroups',['saveEditedworkgroup']),
        ...mapActions('questions',['loadQuestions']),
        ...mapMutations('questions',['clearquestionForm']),
        textColor(color) {
            return idealTextColor(color);
        },
        customFilter (item, queryText) {
            return item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 
        },
    },
    created() {
        this.loadQuestions();
    }
}
</script>

<style scoped>
.custom-btn::before {
    color: transparent
}
</style>