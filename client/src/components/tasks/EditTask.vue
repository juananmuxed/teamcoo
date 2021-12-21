<template>
  <v-card max-width="650" class="mx-auto pa-2">
    <v-card-title class="headline font-weight-medium text-uppercase"
      >Edit Task "{{ tasksForm.task.name }}"</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="Name"
            v-model="tasksForm.task.name"
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
            v-model="tasksForm.task.description"
            :rules="[rules.required, rules.maxdescletters]"
          >
          </v-textarea>
        </v-col>
        <v-col cols="10" class="py-1">
          <v-menu
            :close-on-content-click="false"
            :nudge-height="0"
            offset-y
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="custom-btn mb-3"
                :color="tasksForm.task.color"
                block
                depressed
                v-on="on"
                :ripple="false"
                elevation="0"
                ><span :class="`${textColor(tasksForm.task.color)}--text`">{{
                  tasksForm.task.color
                }}</span></v-btn
              >
            </template>
            <v-card :color="tasksForm.task.color" elevation="0">
              <v-color-picker
                hide-mode-switch
                hide-inputs
                mode.sync="hex"
                flat
                v-model="tasksForm.task.color"
              ></v-color-picker>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="2" class="py-1">
          <v-btn
            class="mb-3"
            :color="tasksForm.task.color"
            block
            depressed
            :ripple="false"
            elevation="0"
            @click="randomTaskColor()"
            ><v-icon :color="textColor(tasksForm.task.color)"
              >fas fa-dice</v-icon
            ></v-btn
          >
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
                v-model="tasksForm.task.eventStartDate"
                label="Start date"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :max="tasksForm.task.eventEndDate"
              color="primary"
              v-model="tasksForm.task.eventStartDate"
              @input="menu2 = false"
            ></v-date-picker>
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
                v-model="tasksForm.task.eventEndDate"
                label="End date"
                readonly
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker
              :min="tasksForm.task.eventStartDate"
              color="secondary"
              v-model="tasksForm.task.eventEndDate"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          class="py-1"
          v-if="tasksForm.task.image != null && tasksForm.task.image != ''"
        >
          <v-img
            :src="tasksForm.task.image"
            height="220"
            contain
            :aspect-ratio="16 / 9"
          ></v-img>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-file-input
            chips
            v-model="tasksForm.task.newImage"
            label="New Image"
            accept="image/png, image/jpeg, image/bmp , image/gif"
            :show-size="1000"
            outlined
            prepend-icon="fas fa-image"
            hint="PNG, JPEG, GIF or BMP"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            outlined
            label="External Link"
            v-model="tasksForm.task.link"
            :rules="[rules.validlink]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-autocomplete
            label="Workgroups"
            v-model="tasksForm.task.workgroups"
            multiple
            chips
            return-object
            outlined
            :items="workgroups.concat(secretWorkgroups)"
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
          </v-autocomplete>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-autocomplete
            label="Interests"
            v-model="tasksForm.task.interests"
            multiple
            return-object
            chips
            outlined
            :items="interests"
            item-text="name"
            item-value="_id"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip :color="item.color" v-if="index < 3">
                <span>{{ item.name }}</span>
              </v-chip>
              <span v-if="index === 3" class="grey--text caption"
                >(+{{ tasksForm.task.interests.length - 3 }} others)</span
              >
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="primary"
        @click="saveEditedTask()"
        :disabled="editedTask() || validTask()"
        class="mt-8"
      >
        <v-icon small>fas fa-save</v-icon>
      </v-btn>
      <v-btn
        fab
        right
        small
        top
        absolute
        color="info"
        @click="loadEditedTask()"
        :disabled="editedTask()"
        class="mt-8 mr-12"
      >
        <v-icon small>fas fa-undo</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { idealTextColor } from "../../utils/utils";
export default {
  computed: {
    ...mapState({
      task: (state) => state.tasks.task,
      tasksForm: (state) => state.tasks.tasksForm,
      workgroups: (state) => state.workgroups.workgroups,
      secretWorkgroups: (state) => state.workgroups.secretWorkgroups,
      loginuser: (state) => state.user.loginuser,
      menu: (state) => state.menu.menu,
      rules: (state) => state.general.rules,
      interests: (state) => state.interests.interests,
    }),
  },
  methods: {
    ...mapActions("tasks", ["saveEditedTask"]),
    ...mapMutations("tasks", [
      "loadEditedTask",
      "randomTaskColor",
      "clearImage",
    ]),
    ...mapGetters("tasks", ["validTask", "editedTask"]),
    ...mapActions("interests", ["loadInterests"]),
    ...mapActions("workgroups", ["loadWorkgroups"]),
    textColor(color) {
      return idealTextColor(color);
    },
  },
  created() {
    this.loadInterests();
    this.loadWorkgroups();
  },
};
</script>

<style scoped>
.custom-btn::before {
  color: transparent;
}
</style>