<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">New Task</v-card-title>
        <v-card-text>
            <p>When creating a Task, volunteers can join to colaborate.</p>
            <v-row>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Name"
                        v-model="tasksForm.name"
                        :rules="[rules.required]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-textarea
                        outlined
                        label="Description"
                        auto-grow
                        counter
                        rows="5"
                        v-model="tasksForm.description"
                        :rules="[rules.required,rules.maxdescletters]"
                    >
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                    <v-menu
                        transition="slide-y-transition"
                        :nudge-top="20"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                        <v-text-field
                            class="pa-0"
                            outlined
                            v-model="tasksForm.startDate"
                            label="Start date"
                            readonly
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker :max="tasksForm.endDate" color="primary" v-model="tasksForm.startDate" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                    <v-menu
                        transition="slide-y-transition"
                        :nudge-top="20"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                        <v-text-field
                            color="secondary"
                            outlined
                            class="pa-0"
                            v-model="tasksForm.endDate"
                            label="End date"
                            readonly
                            v-on="on"
                            :rules="[rules.required]"
                        ></v-text-field>
                        </template>
                        <v-date-picker :min="tasksForm.startDate" color="secondary" v-model="tasksForm.endDate" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-file-input
                        chips
                        v-model="tasksForm.image"
                        label="Image"
                        accept="image/png, image/jpeg, image/bmp , image/gif"
                        :show-size="1000"
                        outlined
                        :clearable=false
                        prepend-icon="fas fa-image"
                        hint="PNG, JPEG, GIF or BMP"
                    >
                        <template v-slot:append-outer>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="tasksForm.image != null" @click="tasksForm.image = null">fas fa-times-circle</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-file-input>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="External Link"
                        v-model="tasksForm.link"
                        :rules="[rules.validlink]"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1" v-if="loginuser.rol.value == 'admin' || loginuser.rol.value == 'coor'">
                    <v-switch color="primary" v-model="tasksForm.secret" label="Private Task"></v-switch>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-select
                        label="Workgroups"
                        v-model="tasksForm.workgroupsSelected"
                        multiple
                        chips
                        outlined
                        :items="workgroups.concat(secretworkgroups)"
                        item-text="name"
                        item-value="_id"
                        hint="Select at least 1"
                        :rules="[rules.zerolength]"
                    >
                        <template v-slot:selection="{ item }">
                            <v-chip :color="item.color">
                                <span :class="`${item.textcolor}--text`">{{ item.name }}</span>
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-content>
                                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-select
                        label="Interests"
                        v-model="tasksForm.interestsSelected"
                        multiple
                        chips
                        outlined
                        :items="interests"
                        item-text="name"
                        item-value="_id"
                    >
                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < 3">
                                <span>{{ item.name }}</span>
                            </v-chip>
                            <span
                                v-if="index === 3"
                                class="grey--text caption"
                            >(+{{ tasksForm.interestsSelected.length - 3 }} others)</span>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12">
                    <v-btn block color="primary" :disabled="validTask()" @click="createTask(loginuser.id)">Add Task</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapState({
            tasksForm: state => state.tasks.tasksForm,
            workgroups: state => state.workgroups.workgroups,
            secretworkgroups: state => state.workgroups.secretworkgroups,
            loginuser: state => state.user.loginuser,
            menu: state => state.menu.menu,
            rules: state => state.general.rules,
            interests: state => state.interests.interests,
        })
    },
    methods: {
        ...mapActions('tasks',['createTask']),
        ...mapGetters('tasks',['validTask'])
    }
}
</script>