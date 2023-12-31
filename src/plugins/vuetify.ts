import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    primary: "#e4b12e",
    info: "#03c9d7",
    success: "#5cb85c",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#fc4b6c",
    secondary: "#34384f", 
  },
};
// #34384
const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#ee8a6a",
    info: "#e4b12e",
    success: "#05b187",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#fc4b6c",
    secondary: "#0cb9c5",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: Lighttheme,
      dark: Darktheme,
    },
  },
  defaults: {
    VBtn: {
      color: "primary",
      rounded: "md",
      flat: true,
      fontWeight: "500",
      letterSpacing: "0",
    },
    VCard: {
      flat: true,
      elevation: 10,
    },
  },
});
