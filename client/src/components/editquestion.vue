<template>
    <v-card
        max-width="650"
        class="mx-auto"
        :loading="questionForm.loading"
        :disabled="questionForm.loading"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit {{ searchedQuestion.name }}</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" class="py-1">
                    <v-select
                        outlined
                        :items="questionForm.types"
                        v-model="questionForm.type"
                        label="Question type"
                    ></v-select>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Name"
                        v-model="questionForm.name"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-textarea
                        outlined
                        label="Description"
                        v-model="questionForm.description"
                        :rules="[rules.maxdescletters]"
                        counter
                        auto-grow
                    >
                    </v-textarea>
                </v-col>
                <v-col cols="12" v-if="questionForm.type == 'select'" class="py-1">
                    <v-combobox
                        v-model="questionForm.selectionsSelected"
                        :items="searchedQuestion.selections"
                        outlined
                        multiple
                        small-chips
                        return-object
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                        label="Answers"
                    >
                        <template v-slot:no-data>
                            <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                No results matching. Press <kbd>enter</kbd> to create a new one
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-select
                            class="px-5"
                            outlined
                            :items="questionForm.selectionsSelected"
                            item-text="answer"
                            :label="questionForm.name"
                            :hint="questionForm.description"
                            color="primary"
                        ></v-select>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="questionForm.type == 'checkbox'" class="py-1">
                    <v-combobox
                        v-model="questionForm.selectionsSelected"
                        :items="searchedQuestion.selections"
                        outlined
                        multiple
                        small-chips
                        return-object
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                        label="Options"
                    >
                        <template v-slot:no-data>
                            <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                No results matching. Press <kbd>enter</kbd> to create a new one
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-autocomplete
                            no-data-text="Not a valid search"
                            class="px-5"
                            :items="questionForm.selectionsSelected"
                            multiple
                            :label="questionForm.name"
                            item-text="answer"
                            color="primary"
                            chips
                            outlined
                        ></v-autocomplete>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="questionForm.type == 'radio'" class="py-1">
                    <v-combobox
                        v-model="questionForm.selectionsSelected"
                        :items="searchedQuestion.selections"
                        small-chips
                        outlined
                        multiple
                        return-object
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                        label="Radios"
                    >
                        <template v-slot:no-data>
                            <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                No results matching. Press <kbd>enter</kbd> to create a new one
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-row class="px-5">
                            <v-col cols="6" md="4" class="py-0">
                                <v-radio-group column>
                                    <v-radio
                                        v-for="( radio , index) in questionForm.selectionsSelected" v-bind:key="index"
                                        outlined
                                        :label="radio"
                                        color="primary"
                                    ></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="questionForm.type == 'text'" class="py-1">
                    <v-text-field
                        outlined
                        label="Question"
                        v-model="questionForm.text"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-text-field
                            class="px-5"
                            :label="questionForm.text"
                            outlined
                            color="primary"
                        ></v-text-field>
                    </v-card>
                </v-col>
            </v-row>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="primary" @click="saveEditedQuestion(searchedQuestion._id)" v-show="!validQuestion() && isEditedQuestion()" class="mt-8 mr-12">
                    <v-icon small>fas fa-save</v-icon>
                </v-btn>
            </v-slide-y-transition>
            <v-slide-y-transition origin="center center">
                <v-btn fab right small top absolute color="info" @click="loadEditedQuestion(searchedQuestion)" v-show="isEditedQuestion()" class="mt-8">
                    <v-icon small>fas fa-undo</v-icon>
                </v-btn>
            </v-slide-y-transition>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState , mapGetters , mapMutations, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            searchedQuestion: state => state.actions.searchedQuestion,
            questionForm: state => state.actions.questionForm,
            rules: state => state.general.rules
        })
    },
    methods: {
        ...mapMutations('actions',['loadEditedQuestion']),
        ...mapGetters('actions',['validQuestion','isEditedQuestion']),
        ...mapActions('actions',['saveEditedQuestion'])
    }
}
</script>