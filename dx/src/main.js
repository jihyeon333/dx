import "@/assets/base.css";
import "@/assets/main.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@/assets/fonts/fonts.css";
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);

app.use(createPinia());

app.mount("#app");
