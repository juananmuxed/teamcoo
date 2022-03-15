<template>
  <v-card outlined elevation="0">
    <bubble-menu :tippy-options="{ duration: 100 }" :editor="editor" v-if="editor">
      <v-btn-toggle multiple dark>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <v-icon>fas fa-bold</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <v-icon>fas fa-italic</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          <v-icon>fas fa-underline</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <v-icon>fas fa-strikethrough</v-icon>
        </v-btn>
      </v-btn-toggle>
    </bubble-menu>
    <floating-menu :tippy-options="{ duration: 100 }" :editor="editor" v-if="editor">
      <v-btn-toggle dark>
        <v-btn
          v-for="(item, index) in 6"
          :key="index"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: index + 1 })
              .run()
          "
          :class="{
            'is-active': editor.isActive('heading', { level: index + 1 }),
          }"
        >
          <span>H{{ index + 1 }}</span>
        </v-btn>
        <v-btn
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <v-icon>fas fa-paragraph</v-icon>
        </v-btn>
      </v-btn-toggle>
    </floating-menu>
    <v-toolbar elevation="1" dense v-if="editor" class="ma-0 pa-0">
      <v-btn-toggle multiple>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <v-icon>fas fa-bold</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <v-icon>fas fa-italic</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          <v-icon>fas fa-underline</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <v-icon>fas fa-strikethrough</v-icon>
        </v-btn>
        <v-btn fab small text @click="editor.chain().focus().unsetAllMarks().run()">
          <v-icon>fas fa-remove-format</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" fab small text>
              <v-icon>fas fa-heading</v-icon>
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item-group>
              <v-list-item
                active-class="is-active"
                v-for="(item, index) in 6"
                :key="index"
                @click="
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: index + 1 })
                    .run()
                "
                :class="{
                  'is-active': editor.isActive('heading', { level: index + 1 }),
                }"
              >
                <span>Heading {{ index + 1 }}</span>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <v-icon>fas fa-paragraph</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2">
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        >
          <v-icon>fas fa-align-left</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        >
          <v-icon>fas fa-align-center</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        >
          <v-icon>fas fa-align-right</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
        >
          <v-icon>fas fa-align-justify</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2">
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <v-icon>fas fa-list-ul</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <v-icon>fas fa-list-ol</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2">
        <v-btn fab small text @click="editor.chain().focus().setHorizontalRule().run()">
          <v-icon>fas fa-grip-lines</v-icon>
        </v-btn>
        <v-menu
          offset-y
          :nudge-width="300"
          :close-on-content-click="false"
          v-model="imageMenu"
        >
          <template v-slot:activator="{ on }">
            <v-btn fab small text v-on="on">
              <v-icon>fas fa-image</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Add image</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-file-input
                    prepend-icon="fas fa-file-image"
                    dense
                    label="Image"
                    outlined
                    v-model="imageFile"
                    clearable
                    :disabled="uploadingImage"
                  >
                    <template v-slot:append>
                      <v-progress-circular
                        v-if="uploadingImage"
                        size="24"
                        color="primary"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon
                        v-else
                        color="primary"
                        @click="uploadImage"
                        :disabled="imageFile == null"
                      >
                        fas fa-upload
                      </v-icon>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-text-field dense label="URL" outlined v-model="imageUrl">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-btn
              fab
              right
              small
              top
              absolute
              color="primary"
              @click="addImage(imageUrl)"
              :disabled="imageUrl == '' || imageUrl == null"
              class="mt-8"
            >
              <v-icon small>fas fa-save</v-icon>
            </v-btn>
          </v-card>
        </v-menu>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2" v-model="mode">
        <v-btn
          fab
          small
          text
        >
          <v-icon>fas fa-edit</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
        >
          <v-icon>fas fa-eye</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          text
        >
          <v-icon>fas fa-code</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-btn fab small text @click="editor.chain().focus().undo().run()">
        <v-icon>fas fa-undo</v-icon>
      </v-btn>
      <v-btn fab small text @click="editor.chain().focus().redo().run()">
        <v-icon>fas fa-redo</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <editor-content :editor="editor" v-show="mode === 0" />
      <v-row  v-show="mode === 1">
        <v-col>
          <div v-html="html"></div>
        </v-col>
      </v-row>
      <v-row v-show="mode === 2">
        <v-col>
          <v-textarea v-model="html" outlined></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import { mapActions, mapMutations } from "vuex";

const CustomDivider = HorizontalRule.extend({
  renderHTML() {
    return ["hr", { class: "v-divider theme--light", role: "separator" }, 0];
  },
});

export default {
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(value) {
      this.html = value;
      const isSame = this.editor.getHTML() === value;
      if (isSame) {
        return;
      }
      this.editor.commands.setContent(this.value, false);
    },
    html(value) {
      this.editor.commands.setContent(value, false);
    }
  },
  data() {
    return {
      editor: null,
      mode: 0,
      html: '',
      imageFile: null,
      imageUrl: null,
      imageMenu: false,
      uploadingImage: false,
    };
  },
  methods: {
    ...mapActions("general", ["saveFile"]),
    ...mapMutations("menu", ["notification"]),
    addImage(url) {
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
        this.imageMenu = false;
        this.imageUrl = null;
      }
    },
    async uploadImage() {
      try {
        this.uploadingImage = true;
        const url = await this.saveFile(this.imageFile);
        if (!url) throw new Error("Error saving");
        this.imageUrl = url;
        this.uploadingImage = false;
        this.imageFile = null;
        this.notification(["success", 3, "File upload"]);
      } catch (error) {
        this.notification(["error", 3, "Error uploading"]);
      } finally {
        this.uploadingImage = false;
      }
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Image,
        Dropcursor,
        CustomDivider,
      ],
      onUpdate: () => {
        this.$emit("input", this.editor.getHTML());
      },
    });
    this.html = this.value;
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.focus-visible {
  outline: none;
}
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #3cb673;
    }
  }
}
</style>
