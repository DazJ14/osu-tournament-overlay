import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
	base: "./",
	build: {
		commonjsOptions: { transformMixedEsModules: true }, // Change
		target: "esnext", //browsers can handle the latest ES features,
		rollupOptions: {
			output: {
				entryFileNames: "assets/index.js",
				assetFileNames: "assets/style.css",
			},
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
});
