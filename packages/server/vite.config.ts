import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [],
	build: {
		minify: true,
		outDir: "./dist",
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "@arkyn/server",
		},
		rollupOptions: {
			external: (id) =>
				!id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
			output: [
				{
					dir: "./dist",
					entryFileNames: "index.js",
				},
				{
					dir: "./dist/modules",
					preserveModules: true,
					preserveModulesRoot: "src",
					entryFileNames: "[name].js",
				},
			],
		},
	},
});
