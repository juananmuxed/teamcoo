<template>
    <v-card
        max-width="650"
        class="mx-auto pa-2"
    >
        <v-card-title class="headline font-weight-medium text-uppercase">Edit User</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6" class="py-1">
                    <v-text-field
                        outlined
                        label="First Name"
                        v-model="edituser.firstname"
                        :rules="[rules.required]"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="edituser.firstname != ''" @click="edituser.firstname = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-1">
                    <v-text-field
                        outlined
                        label="Last Name"
                        v-model="edituser.lastname"
                        :rules="[rules.required]"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="edituser.lastname != ''" @click="edituser.lastname = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Username"
                        counter
                        v-model="edituser.username"
                        :rules="[rules.nospaces,rules.maxletters,rules.required]"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="edituser.username != ''" @click="edituser.username = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-file-input
                        :disabled="edituser.image != ''"
                        chips
                        v-model="edituser.imagefile"
                        label="Avatar"
                        accept="image/png, image/jpeg, image/bmp , image/gif"
                        :show-size="1000"
                        outlined
                        :clearable=false
                        prepend-icon="fas fa-camera"
                        hint="PNG, JPEG, GIF or BMP"
                    >
                        <template v-slot:append-outer>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="edituser.imagefile != null" @click="edituser.imagefile = null">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-file-input>
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-text-field
                        outlined
                        label="Link to Avatar"
                        v-model="edituser.image"
                        :disabled="edituser.imagefile != null"
                        hint="e.g.: https://i.picsum.photos/id/901/200/200.jpg"
                    >
                        <template v-slot:append>
                            <v-slide-x-transition>
                                <v-icon color="primary" v-if="edituser.image != ''" @click="edituser.image = ''">fas fa-times</v-icon>
                            </v-slide-x-transition>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1 headline">
                    Email Configurations
                </v-col>
                <v-col cols="12" class="py-1">
                    <v-switch v-model="edituser.emailconfig" value="newsletter" label="Newsletter" color="primary"></v-switch>
                    <v-switch v-model="edituser.emailconfig" value="yearreport" label="Annual Report" color="primary"></v-switch>
                    <v-switch v-model="edituser.emailconfig" value="newstaks" label="News Tasks" color="primary"></v-switch>
                </v-col>
                Edit interests
                <v-expand-transition>
                    <v-col cols="12" v-if="isChangeUser()">
                        <v-btn
                            class="mb-2"
                            x-large
                            block
                            depressed
                            color="primary"
                            @click="undoEdit"
                        >
                            <v-icon left>fas fa-undo-alt</v-icon> Undo
                        </v-btn>
                        <v-btn
                            class="mt-2"
                            x-large
                            block
                            :disabled="isValidSave()"
                            depressed
                            color="primary"
                            @click="saveEditedData(edituser)"
                        >
                            <v-icon left>fas fa-save</v-icon> Save
                        </v-btn>
                    </v-col>
                </v-expand-transition>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapState({
            edituser: state => state.user.edituser,
            rules: state => state.user.rules,
            loginuser: state => state.user.loginuser,
        })
    },
    methods: {
        ...mapMutations('user',['undoEdit']),
        ...mapGetters('user',['isValidSave','isChangeUser']),
        ...mapActions('user',['saveEditedData'])
    },
}
</script>