<template>
  <v-skeleton-loader
    type="skeleton"
    :types="{ skeleton: 'card,article, table-tfoot' }"
    class="mx-auto pa-6"
    transition="fade-transition"
    :loading="skeleton"
  >
    <v-card flat>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Web config</v-card-title
      >
      <v-row>
        <v-col cols="12" sm="4" class="py-1">
          <v-text-field outlined label="Name" v-model="web.name">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-text-field outlined label="API Url" v-model="web.urlApi">
          </v-text-field>
        </v-col>
      </v-row>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Logos</v-card-title
      >
      <v-row>
        <v-col cols="12" sm="4" class="py-1">
          <v-img :src="logos.favicon" max-height="60" contain></v-img>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-img :src="logos.icon" max-height="60" contain></v-img>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-img :src="logos.logo" max-height="60" contain></v-img>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-file-input
            chips
            label="Favicon"
            outlined
            show-size
            prepend-icon="fas fa-image"
            hint=".png or .ico"
            v-model="newLogos.favicon"
            accept="image/png, image/x-icon"
            :rules="[rules.imageSize]"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-file-input
            chips
            label="Icon"
            outlined
            show-size
            prepend-icon="fas fa-image"
            hint=".jpg/jpeg .png or .gif"
            v-model="newLogos.icon"
            accept="image/*"
            :rules="[rules.imageSize]"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-file-input
            chips
            label="Logo"
            outlined
            show-size
            prepend-icon="fas fa-image"
            hint=".jpg/jpeg .png or .gif"
            v-model="newLogos.logo"
            accept="image/*"
            :rules="[rules.imageSize]"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-img
            v-if="newLogos.favicon"
            :src="makeUrl(newLogos.favicon)"
            max-height="60"
            contain
          ></v-img>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-img
            v-if="newLogos.icon"
            :src="makeUrl(newLogos.icon)"
            max-height="60"
            contain
          ></v-img>
        </v-col>
        <v-col cols="12" sm="4" class="py-1">
          <v-img
            v-if="newLogos.logo"
            :src="makeUrl(newLogos.logo)"
            max-height="60"
            contain
          ></v-img>
        </v-col>
      </v-row>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Theme colors</v-card-title
      >
      <v-row>
        <v-col cols="12">
          <v-card
            v-for="(theme, index) in Object.keys(colors).map((key) => [
              key,
              colors[key],
            ])"
            :key="index"
            :dark="theme[0] == 'dark'"
            :light="theme[0] == 'light'"
            flat
          >
            <v-card-title
              class="text-uppercase"
              v-text="theme[0]"
            ></v-card-title>
            <v-card-text>
              <v-row
                v-for="(color, i) in Object.keys(theme[1]).map((key) => [
                  key,
                  colors[key],
                ])"
                :key="index + '-' + i"
              >
                <v-col cols="12" class="py-1">
                  <v-row no-gutters>
                    <v-col cols="12" sm="3" class="px-2">
                      <h3 class="headline font-weight-thin">
                        {{ color[0] }}
                      </h3>
                    </v-col>
                    <v-col cols="4" sm="3" class="px-2">
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        :color="colors[theme[0]][color[0]]"
                        v-model="colors[theme[0]][color[0]]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="4" class="px-2">
                      <v-menu
                        :close-on-content-click="false"
                        :nudge-height="0"
                        offset-y
                        transition="slide-y-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            class="custom-btn"
                            :color="colors[theme[0]][color[0]]"
                            block
                            depressed
                            v-on="on"
                            :ripple="false"
                            elevation="0"
                            ><span
                              :class="`${textColor(
                                colors[theme[0]][color[0]]
                              )}--text`"
                              >{{ colors[theme[0]][color[0]] }}</span
                            ></v-btn
                          >
                        </template>
                        <v-card
                          :color="colors[theme[0]][color[0]]"
                          elevation="0"
                        >
                          <v-color-picker
                            hide-mode-switch
                            hide-inputs
                            mode.sync="hex"
                            flat
                            v-model="colors[theme[0]][color[0]]"
                          ></v-color-picker>
                        </v-card>
                      </v-menu>
                    </v-col>
                    <v-col cols="2" class="px-2">
                      <v-btn
                        :color="colors[theme[0]][color[0]]"
                        block
                        depressed
                        :ripple="false"
                        elevation="0"
                        @click="
                          randomColor({ theme: theme[0], color: color[0] })
                        "
                        ><v-icon :color="textColor(colors[theme[0]][color[0]])"
                          >fas fa-dice</v-icon
                        ></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-card-title class="display-2 text-uppercase font-weight-thin ml-4 mt-3"
        >Social media
        <v-chip small label color="info" class="ml-4">
          <v-icon x-small left>fas fa-tag</v-icon>Not implemented</v-chip
        >
        <!-- TODO: socialmedia --></v-card-title
      >
      <v-btn
        absolute
        fab
        top
        right
        class="my-2"
        color="primary"
        @click="saveThemeConfig"
        ><v-icon>fas fa-save</v-icon></v-btn
      >
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { idealTextColor } from "../../utils/utils";

export default {
  data() {
    return {
      skeleton: false,
    };
  },
  computed: {
    ...mapState({
      colors: (state) => state.menu.colors,
      web: (state) => state.menu.web,
      logos: (state) => state.menu.logos,
      newLogos: (state) => state.menu.newLogos,
      rules: (state) => state.general.rules,
    }),
  },
  methods: {
    ...mapMutations("menu", ["randomColor"]),
    ...mapActions("general", ["saveThemeConfig"]),
    textColor(color) {
      return idealTextColor(color);
    },
    makeUrl(url) {
      if (url) {
        return URL.createObjectURL(url);
      }
    },
  },
};
</script>

<style scoped>
.custom-btn::before {
  color: transparent;
}
</style>