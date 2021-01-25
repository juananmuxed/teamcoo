<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">New Work Group</v-card-title>
        <v-card-text>
            <p>When creating a Work Group, volunteers can join this Work Group by answering the questions you ask.</p>
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
                    <v-select
                        label="Parent Work Group"
                        v-model="workgroupForm.parent"
                        outlined
                        :items="workgroups"
                        item-text="name"
                        item-value="_id"
                        :disabled="workgroupForm.secret"
                        :menu-props="{closeOnContentClick: true}"
                    >
                        <template v-slot:prepend-item>
                            <v-list-item @click="workgroupForm.parent = null">
                                <v-list-item-content>
                                    <v-list-item-title class="grey--text">No parent</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-select>
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
                <v-col cols="12" class="py-1">
                    <v-file-input
                        chips
                        label="Dossier"
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
                <v-col cols="12" class="py-1" v-if="loginuser.rol.value == 'admin'">
                    <v-switch color="primary" v-model="workgroupForm.secret" label="Private Work Group" @change="verifySecret()"></v-switch>
                </v-col>
                <v-col cols="12" class="py-1" v-if="loginuser.rol.value == 'admin' && workgroupForm.secret">
                    <v-select
                        label="Private Parent Work Group"
                        v-model="workgroupForm.secretparent"
                        outlined
                        :items="secretworkgroups"
                        item-text="name"
                        item-value="_id"
                        :menu-props="{closeOnContentClick: true}"
                        :disabled="workgroupForm.parent != null"
                    >
                        <template v-slot:prepend-item>
                            <v-list-item @click="workgroupForm.secretparent = null">
                                <v-list-item-content>
                                    <v-list-item-title class="grey--text">No parent</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12">
                    <v-btn block color="primary" :disabled="validWG()" @click="createWorkGroup(userId)">Create Work Group</v-btn>
                </v-col>
            </v-row>
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
            loginuser: state => state.user.loginuser,
            menu: state => state.menu.menu,
            workgroups: state => state.actions.workgroups,
            secretworkgroups: state => state.actions.secretworkgroups,
            rules: state => state.general.rules,
            userId: state => state.user.loginuser.id
        })
    },
    methods: {
        ...mapMutations('actions',['verifySecret']),
        ...mapActions('actions',['loadQuestions','idealTextColor','createWorkGroup']),
        ...mapGetters('actions',['validWG'])
    },
    created() {
        this.loadQuestions()
    }
}
</script>

<style scoped>
.custom-btn::before {
    color: transparent
}
</style>