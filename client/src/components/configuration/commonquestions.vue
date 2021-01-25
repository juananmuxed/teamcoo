<template>
    <v-card flat class="pa-6">
        <v-row v-for="(question,index) in commonQuestions" v-bind:key="index">
            <v-col class="headline text-uppercase font-weight-light" cols="12">{{ question.name }}</v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            outlined
                            label="Name"
                            v-model="question.name"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select
                            outlined
                            :items="questionForm.types"
                            v-model="question.type"
                            label="Type"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-textarea
                            outlined
                            label="Description"
                            v-model="question.description"
                            :rules="[rules.maxdescletters]"
                            counter
                            auto-grow
                        >
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" md="6" v-if="question.type == 'select'" class="py-1">
                        <v-combobox
                            v-model="question.selections"
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
                    </v-col>
                    <v-col cols="12" md="6" v-if="question.type == 'checkbox'" class="py-1">
                        <v-combobox
                            v-model="question.selections"
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
                    </v-col>
                    <v-col cols="12" md="6" v-if="question.type == 'radio'" class="py-1">
                        <v-combobox
                            v-model="question.selections"
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
                    </v-col>
                    <v-col cols="12" md="6" v-if="question.type == 'text'" class="py-1">
                        <v-text-field
                            outlined
                            label="Question"
                            v-model="question.text"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="12">
                        <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    </v-col>
                    <v-col cols="12" v-if="question.type == 'select'" class="py-1">
                        <v-card outlined class="pa-2">
                            <v-card-title class="title font-weight-medium">{{ question.name }}</v-card-title>
                            <v-card-subtitle>{{ question.description }}</v-card-subtitle>
                            <v-select
                                class="px-5"
                                outlined
                                :items="question.selections"
                                item-text="answer"
                                :label="question.name"
                                :hint="question.description"
                                color="primary"
                            ></v-select>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-if="question.type == 'checkbox'" class="py-1">
                        <v-card outlined class="pa-2">
                            <v-card-title class="title font-weight-medium">{{ question.name }}</v-card-title>
                            <v-card-subtitle>{{ question.description }}</v-card-subtitle>
                            <v-autocomplete
                                no-data-text="Not a valid search"
                                class="px-5"
                                :items="question.selections"
                                multiple
                                :label="question.name"
                                item-text="answer"
                                color="primary"
                                chips
                                outlined
                            ></v-autocomplete>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-if="question.type == 'radio'" class="py-1">
                        <v-card outlined class="pa-2">
                            <v-card-title class="title font-weight-medium">{{ question.name }}</v-card-title>
                            <v-card-subtitle>{{ question.description }}</v-card-subtitle>
                            <v-row class="px-5">
                                <v-col cols="6" md="4" class="py-0">
                                    <v-radio-group column>
                                        <v-radio
                                            v-for="( radio , index) in question.selections" v-bind:key="index"
                                            outlined
                                            :label="radio"
                                            color="primary"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-if="question.type == 'text'" class="py-1">
                        <v-card outlined class="pa-2">
                            <v-card-title class="title font-weight-medium">{{ question.name }}</v-card-title>
                            <v-card-subtitle>{{ question.description }}</v-card-subtitle>
                            <v-text-field
                                class="px-5"
                                :label="question.text"
                                outlined
                                color="primary"
                            ></v-text-field>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-divider inset v-if="index < commonQuestions.length - 1"></v-divider>
        </v-row>
    </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            commonQuestions: state => state.configuration.commonQuestions,
            questionForm: state => state.actions.questionForm,
            rules: state => state.general.rules
        })
    },
    methods: {
        ...mapActions('configuration',['loadCommonQuestions'])
    },
    created() {
        this.loadCommonQuestions();
    }
}
</script>