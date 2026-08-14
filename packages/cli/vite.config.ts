import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [],
	build: {
		minify: true,
		outDir: "./dist",
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "@arkyn/cli",
			formats: ["es"],
		},
		rollupOptions: {
			external: (id) =>
				!id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
			output: {
				dir: "./dist",
				entryFileNames: "bundle.js",
				banner: "#!/usr/bin/env node",
			},
		},
	},
});
