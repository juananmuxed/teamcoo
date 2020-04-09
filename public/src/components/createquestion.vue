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
                    <v-text-field
                        outlined
                        :label="`Option ${parseInt(selection.value) + 1}`"
                        v-model="selection.answer"
                        :rules="[rules.required]"
                        v-for="( selection , index) in questionForm.selections" v-bind:key="index"
                    >
                        <template v-slot:append-outer v-if="selection.value == questionForm.selectCount">
                            <v-icon color="primary" @click="addselect(index)">fas fa-plus</v-icon>
                        </template>
                        <template v-slot:prepend v-if="selection.value == questionForm.selectCount && questionForm.selectCount != 0">
                            <v-icon color="primary" @click="delselect()">fas fa-minus</v-icon>
                        </template>
                    </v-text-field>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-select
                            class="px-5"
                            outlined
                            :items="questionForm.selections"
                            item-text="answer"
                            :label="questionForm.name"
                            :hint="questionForm.description"
                            color="primary"
                        ></v-select>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="questionForm.type == 'checkbox'" class="py-1">
                    <v-text-field
                        outlined
                        :label="`Option ${parseInt(checkbox.value) + 1}`"
                        v-model="checkbox.answer"
                        :rules="[rules.required]"
                        v-for="( checkbox , index) in questionForm.checkboxs" v-bind:key="index"
                    >
                        <template v-slot:append-outer v-if="checkbox.value == questionForm.checkboxCount">
                            <v-icon color="primary" @click="addcheck(index)">fas fa-plus</v-icon>
                        </template>
                        <template v-slot:prepend v-if="checkbox.value == questionForm.checkboxCount && questionForm.checkboxCount != 0">
                            <v-icon color="primary" @click="delcheck()">fas fa-minus</v-icon>
                        </template>
                    </v-text-field>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-autocomplete
                            no-data-text="Not a valid search"
                            class="px-5"
                            :items="questionForm.checkboxs"
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
                    <v-text-field
                        outlined
                        :label="`Option ${parseInt(radio.value) + 1}`"
                        v-for="( radio , index) in questionForm.radios" v-bind:key="index"
                        :rules="[rules.required]"
                        v-model="radio.answer"
                    >
                        <template v-slot:append-outer v-if="radio.value == questionForm.radioCount">
                            <v-icon color="primary" @click="addradio(index)">fas fa-plus</v-icon>
                        </template>
                        <template v-slot:prepend v-if="radio.value == questionForm.radioCount && questionForm.radioCount != 0">
                            <v-icon color="primary" @click="delradio()">fas fa-minus</v-icon>
                        </template>
                    </v-text-field>
                    <p class="headline font-weight-medium text-uppercase primary--text">Preview</p>
                    <v-card outlined class="pa-2">
                        <v-card-title class="title font-weight-medium">{{ questionForm.name }}</v-card-title>
                        <v-card-subtitle>{{ questionForm.description }}</v-card-subtitle>
                        <v-row class="px-5">
                            <v-col cols="6" md="4" class="py-0">
                                <v-radio-group column>
                                    <v-radio
                                        v-for="( radio , index) in questionForm.radios" v-bind:key="index"
                                        outlined
                                        :label="radio.answer"
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
                <v-col cols="12">
                    <v-btn block color="primary" :disabled="validQuestion()" @click="createQuestion(userId)">Create Question</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            questionForm: state => state.actions.questionForm,
            userId: state => state.user.loginuser.id,
            rules: state => state.user.rules
        })
    },
    methods: {
        ...mapMutations('actions',['addselect','delselect','addcheck','delcheck','addradio','delradio']),
        ...mapGetters('actions',['validQuestion']),
        ...mapActions('actions',['createQuestion'])
    },
}
</script>