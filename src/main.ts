import { createApp, markRaw } from "vue";
import { createPinia  } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@/scss/style.scss";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import VueApexCharts from "vue3-apexcharts";
// @ts-ignore:next-line
import InstantSearch from "vue-instantsearch/vue3/es";
import VCalendar from "v-calendar";
import Notifications from '@kyvg/vue3-notification'
import VueFeather from "vue-feather";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

const app = createApp(App)
app.component(VueFeather.name, VueFeather);
app.use(PerfectScrollbar);
app.use(InstantSearch);
app.use(pinia);
app.use(VCalendar, {});
app.use(VueApexCharts);
app.use(router);
app.use(Notifications)
app.use(vuetify).mount("#app");
