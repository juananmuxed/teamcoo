<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">New Question</v-card-title>
        <v-card-text>
            <p>Select one of the 4 types and fill the questions.</p>
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
                        outlined
                        v-model="questionForm.selectionsSelected"
                        label="Answers"
                        :items="interests"
                        :rules="[rules.zerolength]"
                        multiple
                        persistent-hint
                        hint="Press Enter to create a new one"
                    >
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                            <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                small
                            >
                                <span class="pr-2">
                                    {{ item }}
                                </span>
                                <v-icon
                                    small
                                    @click="parent.selectItem(item)"
                                >
                                    fas fa-times-circle
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title>
                                    Press <kbd>enter</kbd> to create a new one
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
                        outlined
                        v-model="questionForm.selectionsSelected"
                        label="Answers"
                        :items="interests"
                        :rules="[rules.zerolength]"
                        multiple
                        persistent-hint
                        hint="Press Enter to create a new one"
                    >
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                            <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                small
                            >
                                <span class="pr-2">
                                    {{ item }}
                                </span>
                                <v-icon
                                    small
                                    @click="parent.selectItem(item)"
                                >
                                    fas fa-times-circle
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title>
                                    Press <kbd>enter</kbd> to create a new one
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
                        outlined
                        v-model="questionForm.selectionsSelected"
                        label="Answers"
                        :items="interests"
                        :rules="[rules.zerolength]"
                        multiple
                        persistent-hint
                        hint="Press Enter to create a new one"
                    >
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                            <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                small
                            >
                                <span class="pr-2">
                                    {{ item }}
                                </span>
                                <v-icon
                                    small
                                    @click="parent.selectItem(item)"
                                >
                                    fas fa-times-circle
                                </v-icon>
                            </v-chip>
                        </template>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title>
                                    Press <kbd>enter</kbd> to create a new one
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
                <v-col cols="12" v-if="loginuser.rol.value == 'admin'">
                    <v-checkbox
                        dense
                        color="primary"
                        v-model="questionForm.common"
                    >
                        <template v-slot:label>
                            <div>
                                Common question
                            </div>
                        </template>
                    </v-checkbox>
                </v-col>
                <v-col cols="12">
                    <v-btn block color="primary" :disabled="validQuestion()" @click="createQuestion(loginuser.id)">Create Question</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState , mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            questionForm: state => state.questions.questionForm,
            interests: state => state.interests.interestsNames,
            loginuser: state => state.user.loginuser,
            rules: state => state.general.rules
        })
    },
    methods: {
        ...mapGetters('questions',['validQuestion']),
        ...mapActions('questions',['createQuestion']),
        ...mapActions('interests',['loadInterests'])
    },
    created() {
        this.loadInterests();
    }
}
</script>