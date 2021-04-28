<template>
  <v-card outlined elevation="0">
    <bubble-menu
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      v-if="editor"
    >
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
    <floating-menu
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      v-if="editor"
    >
      <v-btn-toggle dark>
        <v-btn
          v-for="(item, index) in 4"
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
      <v-btn-toggle multiple borderless>
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
      <v-btn
        fab
        small
        text
        @click="editor.chain().focus().unsetAllMarks().run()"
      >
        <v-icon>fas fa-remove-format</v-icon>
      </v-btn>
      <v-btn-toggle class="ml-2" borderless>
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
                v-for="(item, index) in 4"
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
              <v-list-item
                active-class="is-active"
                @click="editor.chain().focus().setParagraph().run()"
                :class="{ 'is-active': editor.isActive('paragraph') }"
              >
                <span>Paragraph</span>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-btn-toggle>
      <v-btn-toggle class="ml-2" borderless>
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
      <v-btn-toggle class="ml-2" borderless>
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
      <v-btn
        fab
        small
        text
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        <v-icon>fas fa-code</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        text
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <v-icon>fas fa-quote-right</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        text
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <v-icon>fas fa-grip-lines</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        text
        @click="editor.chain().focus().setHardBreak().run()"
      >
        <v-icon>fas fa-level-down-alt</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn fab small text @click="editor.chain().focus().undo().run()">
        <v-icon>fas fa-undo</v-icon>
      </v-btn>
      <v-btn fab small text @click="editor.chain().focus().redo().run()">
        <v-icon>fas fa-redo</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <editor-content :editor="editor" />
    </v-card-text>
  </v-card>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/vue-2";
import { defaultExtensions } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export default {
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;
      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()
      if (isSame) {
        return
      }
      this.editor.commands.setContent(this.value, false);
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [...defaultExtensions(), Underline, TextAlign],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML());
        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    });
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
</style>