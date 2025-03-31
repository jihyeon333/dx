import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 5173
	},
	plugins: [
		vue(),
		vueJsx(),
		vuetify({
			// Vuetify 설정 추가
			styles: {
				configFile: "src/assets/styles/main.scss",
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	assetsInclude: ["**/*.svg"],
});
